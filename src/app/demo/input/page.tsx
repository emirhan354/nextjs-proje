// src/app/demo/input/page.tsx
"use client";
import { useState } from "react";
import ValidatedInput from "@/components/ValidatedInput";

export default function DemoInputPage() {
  const [warnVal, setWarnVal] = useState("");
  const [blockVal, setBlockVal] = useState("");

  return (
    <div className="min-h-screen p-6 space-y-6">
      <h1 className="text-xl font-semibold">Özel Karakter Kontrolü (Demo)</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <h2 className="font-medium">Uyarı Modu (warn)</h2>
          <ValidatedInput
            label="Ad/Soyad (uyarı verir)"
            placeholder="Örn: Emirhan Yılmaz"
            mode="warn"
            value={warnVal}
            onChange={setWarnVal}
          />
        </div>

        <div className="space-y-2">
          <h2 className="font-medium">Engelleme Modu (block)</h2>
          <ValidatedInput
            label="Kullanıcı Adı (yasakları temizler)"
            placeholder="Örn: emirhan_yilmaz"
            mode="block"
            value={blockVal}
            onChange={setBlockVal}
          />
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium mb-2">Değerler</h3>
        <pre className="border p-3 rounded-2xl bg-gray-50 text-black">
          {JSON.stringify({ warnVal, blockVal }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
