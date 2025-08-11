// src/app/contact/page.tsx
"use client";
import { useState } from "react";
import ValidatedInput from "@/components/ValidatedInput";
import { hasBlockedChars } from "@/utils/validators";
import { sendContact } from "@/services/contact";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState("");
  const [err, setErr] = useState("");

  const invalidName = hasBlockedChars(name);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfo("");
    setErr("");

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErr("Lütfen tüm alanları doldurun.");
      return;
    }
    if (invalidName) {
      setErr("Ad Soyad alanında yasak karakter var.");
      return;
    }

    try {
      setLoading(true);
      const data = await sendContact({ name, email, message });
      setInfo(data.message || "Mesaj alındı");
      setName("");
      setEmail("");
      setMessage("");
    } catch (e: any) {
      setErr(e?.response?.data?.message || "Gönderim sırasında hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 space-y-6">
      <h1 className="text-xl font-semibold">İletişim</h1>

      <form onSubmit={onSubmit} className="max-w-2xl space-y-4">
        <ValidatedInput
          label="Ad Soyad"
          placeholder="Örn: Emirhan Yılmaz"
          mode="block"
          value={name}
          onChange={setName}
        />
        <div className="space-y-1">
          <label className="block text-sm font-medium">Email</label>
          <input
            className="w-full border p-2 rounded bg-white text-black placeholder-gray-500"
            placeholder="ornek@mail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
          />
        </div>
        <div className="space-y-1">
          <label className="block text-sm font-medium">Mesaj</label>
          <textarea
            className="w-full border p-2 rounded bg-white text-black placeholder-gray-500"
            rows={5}
            placeholder="Mesajınız..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        {info && <p className="text-green-600">{info}</p>}
        {err && <p className="text-red-600">{err}</p>}

        <button
          className="border p-2 rounded-2xl disabled:opacity-60"
          disabled={loading || invalidName}
        >
          {loading ? "Gönderiliyor..." : "Gönder"}
        </button>
      </form>
    </div>
  );
}
