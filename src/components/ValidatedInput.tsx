// src/components/ValidatedInput.tsx
"use client";
import { useState } from "react";
import { hasBlockedChars, sanitizeBlockedChars } from "../utils/validators";

type Props = {
  label?: string;
  placeholder?: string;
  /** warn = uyar, block = yazarken otomatik temizle */
  mode?: "warn" | "block";
  value?: string;
  onChange?: (v: string) => void;
};

export default function ValidatedInput({
  label = "Metin",
  placeholder = "",
  mode = "warn",
  value,
  onChange,
}: Props) {
  const [internal, setInternal] = useState("");
  const val = value ?? internal;

  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let next = e.target.value;

    if (mode === "block") {
      const cleaned = sanitizeBlockedChars(next);
      if (cleaned !== next)
        setError("Bu alanda şu karakterler yasak: / - : ; ( )");
      else setError("");
      next = cleaned;
    } else {
      setError(hasBlockedChars(next) ? "Lütfen / - : ; ( ) kullanmayın" : "");
    }

    if (onChange) onChange(next);
    else setInternal(next);
  };

  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium">{label}</label>
      <input
        className={`w-full border p-2 rounded bg-white text-black placeholder-gray-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
        placeholder={placeholder}
        value={val}
        onChange={handleChange}
      />
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
