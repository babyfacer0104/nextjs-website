"use client";

import Link from "next/link";
import { useActionState } from "react";
import type { Product } from "@/lib/db";
import type { ProductFormState } from "../actions/products";

type Props = {
  action: (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  product?: Product;
  submitText: string;
};

export default function ProductForm({ action, product, submitText }: Props) {
  const [state, formAction, pending] = useActionState(action, undefined);
  // 校验失败时回填用户刚输入的值
  const value = (key: "name" | "price" | "stock" | "description") =>
    state?.values?.[key] ?? (product ? String(product[key]) : "");

  return (
    <form action={formAction} className="space-y-5 rounded-xl border bg-white p-6">
      <Field label="名称" error={state?.errors?.name}>
        <input name="name" defaultValue={value("name")} className="input" />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="价格（元）" error={state?.errors?.price}>
          <input name="price" type="number" step="0.01" min="0" defaultValue={value("price")} className="input" />
        </Field>
        <Field label="库存" error={state?.errors?.stock}>
          <input name="stock" type="number" step="1" min="0" defaultValue={value("stock")} className="input" />
        </Field>
      </div>
      <Field label="描述" error={state?.errors?.description}>
        <textarea name="description" rows={4} defaultValue={value("description")} className="input" />
      </Field>
      <div className="flex justify-end gap-3">
        <Link href="/dashboard" className="btn-secondary">
          取消
        </Link>
        <button type="submit" disabled={pending} className="btn-primary">
          {pending ? "保存中…" : submitText}
        </button>
      </div>
    </form>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
}
