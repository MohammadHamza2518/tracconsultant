import fs from 'fs';
import path from 'path';
import { 
  TaxRatesConfig, 
  ToolPricingConfig, 
  ServicePricingItem, 
  SystemConfig, 
  DEFAULT_SYSTEM_CONFIG 
} from './systemConfigDefaults';

export type { TaxRatesConfig, ToolPricingConfig, ServicePricingItem, SystemConfig };
export { DEFAULT_SYSTEM_CONFIG };

const CONFIG_FILE = path.join(process.cwd(), 'data', 'system_config.json');

function ensureConfigFile(): void {
  const dir = path.dirname(CONFIG_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(CONFIG_FILE)) {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_SYSTEM_CONFIG, null, 2), 'utf-8');
  }
}

export function getSystemConfig(): SystemConfig {
  try {
    ensureConfigFile();
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read system_config.json, returning default:', err);
    return DEFAULT_SYSTEM_CONFIG;
  }
}

export function saveSystemConfig(newConfig: Partial<SystemConfig>, updatedBy = 'Senior CA Partner'): SystemConfig {
  ensureConfigFile();
  const current = getSystemConfig();
  const updated: SystemConfig = {
    ...current,
    ...newConfig,
    taxRates: {
      ...current.taxRates,
      ...(newConfig.taxRates || {})
    },
    toolPrices: {
      ...current.toolPrices,
      ...(newConfig.toolPrices || {})
    },
    servicePricing: newConfig.servicePricing || current.servicePricing,
    lastUpdated: new Date().toISOString(),
    updatedBy
  };

  fs.writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

export function resetSystemConfig(): SystemConfig {
  ensureConfigFile();
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(DEFAULT_SYSTEM_CONFIG, null, 2), 'utf-8');
  return DEFAULT_SYSTEM_CONFIG;
}
