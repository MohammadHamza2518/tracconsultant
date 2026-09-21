/**
 * Utility to crop and compress profile pictures (DP) into a clean, lightweight square Base64 data URL.
 * Automatically centers and crops photos to 1:1 aspect ratio and limits dimensions to prevent heavy payloads.
 */
export function compressAvatarImage(file: File, targetSize = 400, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file (JPG, PNG, WEBP).'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const width = img.width;
          const height = img.height;

          // Square center-crop logic for DP
          const minDim = Math.min(width, height);
          const startX = (width - minDim) / 2;
          const startY = (height - minDim) / 2;

          const finalSize = Math.min(minDim, targetSize);
          canvas.width = finalSize;
          canvas.height = finalSize;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(event.target?.result as string);
            return;
          }

          // Draw cropped square
          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, finalSize, finalSize);

          // Output as compressed JPEG
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = () => reject(new Error('Failed to load image for processing.'));
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
  });
}
