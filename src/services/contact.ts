// src/services/contact.ts
import axios from "axios";
import { ContactPayload, ContactResponse } from "@/models/Contact";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export async function sendContact(payload: ContactPayload) {
  const res = await axios.post<ContactResponse>(`${API}/contact`, payload, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data; // ContactResponse
}
