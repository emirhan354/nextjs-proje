"use client";
import { useState } from "react";

export const SafeInput = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const forbidden = /[\/\-:;()$€£%&=?<>#"'!@~^*{}\[\]|\\]/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    if (forbidden.test(newValue)) {
      setError("Özel karakterlere izin verilmez.");
    } else {
      setError("");
    }
  };

  return (
    <div className="flex flex-col w-full max-w-md">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="Bir şeyler yaz..."
        className="px-4 py-2 border border-white bg-black text-white rounded outline-none"
      />
      {error && <span className="text-red-500 text-sm mt-2">{error}</span>}
    </div>
  );
};
