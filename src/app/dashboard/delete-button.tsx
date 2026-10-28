"use client";

import { useTransition } from "react";
import { deleteProductAction } from "../actions/products";

export default function DeleteButton({ id, name }: { id: string; name: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm(`确定删除「${name}」吗？`)) {
          startTransition(() => deleteProductAction(id));
        }
      }}
      className="text-red-600 hover:underline disabled:opacity-50"
    >
      {pending ? "删除中…" : "删除"}
    </button>
  );
}
