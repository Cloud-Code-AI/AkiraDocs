declare global {
    namespace NodeJS {
      interface ProcessEnv {
        OPENAI_API_KEY?: string;
        ANTHROPIC_API_KEY?: string;
        GOOGLE_AI_API_KEY?: string;
        AZURE_OPENAI_API_KEY?: string;
        AZURE_OPENAI_ENDPOINT?: string;
      }
    }
  }
  
  export {}