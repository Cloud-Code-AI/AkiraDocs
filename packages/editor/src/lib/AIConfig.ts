export const aiConfig = {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
    }
  }
  
  export function validateConfig() {
    if (!aiConfig.openai.apiKey) {
      throw new Error('OPENAI_API_KEY is required')
    }
  } 