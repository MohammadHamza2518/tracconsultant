/**
 * Utility to crop and compress profile pictures (DP) into a clean, lightweight square Base64 data URL.
 * Automatically centers and crops photos to 1:1 aspect ratio and limits dimensions to prevent heavy payloads.
 */
export function compressAvatarImage(file: File, targetSize = 320, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    // Validate file type (supports MIME type and file extension fallback)
    const isImageMime = file.type && file.type.startsWith('image/');
    const isImageExt = /\.(jpe?g|png|webp|jfif|avif|heic|bmp)$/i.test(file.name || '');
    if (!isImageMime && !isImageExt) {
      reject(new Error('Please select a valid image file (JPG, PNG, WEBP).'));
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const dataUrlResult = event.target?.result as string;
      if (!dataUrlResult) {
        reject(new Error('Failed to read image data.'));
        return;
      }

      const img = new Image();
      img.src = dataUrlResult;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const width = img.width || targetSize;
          const height = img.height || targetSize;

          // Square center-crop logic for DP
          const minDim = Math.min(width, height);
          const startX = (width - minDim) / 2;
          const startY = (height - minDim) / 2;

          const finalSize = Math.min(minDim, targetSize);
          canvas.width = finalSize;
          canvas.height = finalSize;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(dataUrlResult);
            return;
          }

          // Draw cropped square
          ctx.drawImage(img, startX, startY, minDim, minDim, 0, 0, finalSize, finalSize);

          // Output as compressed JPEG
          const compressed = canvas.toDataURL('image/jpeg', quality);
          resolve(compressed || dataUrlResult);
        } catch {
          // Graceful fallback to uncropped data URL if canvas throws
          resolve(dataUrlResult);
        }
      };
      img.onerror = () => {
        // Fallback to raw data URL if Image element decoding fails
        resolve(dataUrlResult);
      };
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
  });
}
