declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number;
      GLOBAL_PREFIX: string;
      UPLOAD_URL: string;
    }
  }
}

export {};
