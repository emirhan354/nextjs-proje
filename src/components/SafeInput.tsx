"use client";

import { useState } from "react";

export const SafeInput = () => {
  const [value, setValue] = useState("");
  const [hasSpecialChar, setHasSpecialChar] = useState(false);

  // Tüm özel karakterleri kapsayan regex
  const specialCharRegex = /[^a-zA-Z0-9\s]/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    setHasSpecialChar(specialCharRegex.test(inputValue));
  };

  return (
    <div className="flex flex-col space-y-2 w-full max-w-md">
      <label htmlFor="safe-input" className="text-sm font-medium text-gray-100">
        Sadece harf ve rakam giriniz
      </label>
      <input
        id="safe-input"
        type="text"
        value={value}
        onChange={handleChange}
        className="p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        placeholder="Metin girin"
      />
      {hasSpecialChar && (
        <p className="text-red-500 text-sm">
          Özel karakter kullanılamaz. Lütfen sadece harf veya rakam giriniz.
        </p>
      )}
    </div>
  );
};
