/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ASTROGATORS_TABLE_HOST: string;
  readonly VITE_ASTROGATORS_TABLE_PORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
