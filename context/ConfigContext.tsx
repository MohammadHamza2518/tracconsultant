'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { 
  SystemConfig, 
  TaxRatesConfig, 
  ToolPricingConfig, 
  ServicePricingItem, 
  DEFAULT_SYSTEM_CONFIG 
} from '@/lib/systemConfigDefaults';

interface ConfigContextType {
  config: SystemConfig;
  taxRates: TaxRatesConfig;
  toolPrices: ToolPricingConfig;
  servicePricing: ServicePricingItem[];
  getToolPrice: (toolId: string, defaultFallback?: number) => number;
  getService: (serviceId: string) => ServicePricingItem | undefined;
  refreshConfig: () => Promise<void>;
  isLoading: boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfig] = useState<SystemConfig>(DEFAULT_SYSTEM_CONFIG);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/config', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.config) {
          setConfig(data.config);
        }
      }
    } catch (err) {
      console.warn('Failed to load remote system config, using defaults:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  const getToolPrice = useCallback((toolId: string, defaultFallback?: number): number => {
    const key = toolId as keyof ToolPricingConfig;
    if (config.toolPrices && config.toolPrices[key] !== undefined) {
      return config.toolPrices[key];
    }
    if (toolId === 'all-access-pass' || toolId === 'allAccessPass') {
      return config.toolPrices?.allAccessPass || 999;
    }
    return defaultFallback !== undefined ? defaultFallback : 199;
  }, [config.toolPrices]);

  const getService = useCallback((serviceId: string): ServicePricingItem | undefined => {
    return config.servicePricing?.find(s => s.id === serviceId);
  }, [config.servicePricing]);

  return (
    <ConfigContext.Provider
      value={{
        config,
        taxRates: config.taxRates || DEFAULT_SYSTEM_CONFIG.taxRates,
        toolPrices: config.toolPrices || DEFAULT_SYSTEM_CONFIG.toolPrices,
        servicePricing: config.servicePricing || DEFAULT_SYSTEM_CONFIG.servicePricing,
        getToolPrice,
        getService,
        refreshConfig: fetchConfig,
        isLoading
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    // Return graceful fallback with default config if used outside provider
    return {
      config: DEFAULT_SYSTEM_CONFIG,
      taxRates: DEFAULT_SYSTEM_CONFIG.taxRates,
      toolPrices: DEFAULT_SYSTEM_CONFIG.toolPrices,
      servicePricing: DEFAULT_SYSTEM_CONFIG.servicePricing,
      getToolPrice: (toolId: string, defaultFallback?: number) => {
        const key = toolId as keyof ToolPricingConfig;
        if (DEFAULT_SYSTEM_CONFIG.toolPrices[key] !== undefined) {
          return DEFAULT_SYSTEM_CONFIG.toolPrices[key];
        }
        if (toolId === 'all-access-pass' || toolId === 'allAccessPass') {
          return DEFAULT_SYSTEM_CONFIG.toolPrices.allAccessPass;
        }
        return defaultFallback ?? 199;
      },
      getService: (serviceId: string) => DEFAULT_SYSTEM_CONFIG.servicePricing.find(s => s.id === serviceId),
      refreshConfig: async () => {},
      isLoading: false
    };
  }
  return context;
};
