/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ASTROGATORS_TABLE_URL: string;
  readonly VITE_MOD_LEDGER_UI_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module 'astrogators-shared-ui/styles';
