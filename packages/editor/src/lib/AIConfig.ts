import { getAkiradocsConfig } from '@/lib/getAkiradocsConfig'
import { SupportedProvider } from '@/types/AkiraConfigType'

interface BaseProviderConfig {
    apiKey: string | undefined;
    model?: string;
    temperature?: number;
}

interface AzureProviderConfig extends BaseProviderConfig {
    endpoint?: string;
    deploymentName?: string;
}

type AIProviderConfig = BaseProviderConfig | AzureProviderConfig

export const aiConfig = (() => {
    const config = getAkiradocsConfig()
    return {
        provider: config.rewrite?.provider as SupportedProvider || 'openai',
        settings: {
            ...config.rewrite?.settings,
        },
        providers: {
            openai: {
                apiKey: process.env.OPENAI_API_KEY,
                model: config.rewrite?.settings?.model || 'gpt-4-turbo-preview',
            },
            azure: {
                apiKey: process.env.AZURE_OPENAI_API_KEY,
                endpoint: process.env.AZURE_OPENAI_ENDPOINT,
                deploymentName: config.rewrite?.settings?.azureDeploymentName,
                model: config.rewrite?.settings?.model || 'gpt-4',
            },
            anthropic: {
                apiKey: process.env.ANTHROPIC_API_KEY,
                model: config.rewrite?.settings?.model || 'claude-3-sonnet',
            },
            google: {
                apiKey: process.env.GOOGLE_AI_API_KEY,
                model: config.rewrite?.settings?.model || 'gemini-pro',
            }
        }
    }
})()

export function validateConfig() {
    const provider = aiConfig.provider;
    const providerConfig = aiConfig.providers[provider];

    if (!providerConfig?.apiKey) {
        throw new Error(`API key for ${provider.toUpperCase()} is missing`);
    }

    // Additional validation for Azure
    if (provider === 'azure') {
        const azureConfig = providerConfig as AzureProviderConfig;
        if (!azureConfig.endpoint) {
            throw new Error('AZURE_OPENAI_ENDPOINT is required for Azure provider');
        }
        if (!azureConfig.deploymentName) {
            throw new Error('Azure deployment name is required in config');
        }
    }
}

export function getProviderConfig(): AIProviderConfig {
  return aiConfig.providers[aiConfig.provider]
}

// Helper to check if using Azure
export function isAzureProvider(): boolean {
  return aiConfig.provider === 'azure'
}