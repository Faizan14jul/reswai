"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        router.refresh();
      }}
      className="rounded-full border border-white/12 bg-white/6 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10"
    >
      Log out
    </button>
  );
}
