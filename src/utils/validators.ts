// src/utils/validators.ts

// Yasak karakterler:  /  -  :  ;  (  )
const BLOCKED_CHARS = /[\/\-:;()]/g;

export function hasBlockedChars(value: string): boolean {
  return BLOCKED_CHARS.test(value);
}

export function sanitizeBlockedChars(value: string): string {
  return value.replace(BLOCKED_CHARS, "");
}
