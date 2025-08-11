// src/components/ProfileCard.tsx
"use client";
import { User } from "@/models/User";

type Props = {
  user: User;
};

export default function ProfileCard({ user }: Props) {
  return (
    <div className="border p-4 rounded-2xl space-y-1">
      <p>
        <strong>ID:</strong> {user.id}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
    </div>
  );
}
