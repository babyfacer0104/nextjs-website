"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createProduct, deleteProduct, updateProduct, type ProductInput } from "@/lib/db";
import { requireSession } from "@/lib/session";

export type ProductFormState =
  | { errors?: Partial<Record<keyof ProductInput, string>>; values?: Record<string, string> }
  | undefined;

function parse(formData: FormData) {
  const values = {
    name: String(formData.get("name") ?? "").trim(),
    price: String(formData.get("price") ?? "").trim(),
    stock: String(formData.get("stock") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
  };
  const errors: Partial<Record<keyof ProductInput, string>> = {};

  if (!values.name) errors.name = "名称不能为空";
  else if (values.name.length > 50) errors.name = "名称不能超过 50 个字符";

  const price = Number(values.price);
  if (values.price === "" || Number.isNaN(price) || price < 0) errors.price = "请输入有效的价格";

  const stock = Number(values.stock);
  if (values.stock === "" || !Number.isInteger(stock) || stock < 0) errors.stock = "库存必须是非负整数";

  if (values.description.length > 200) errors.description = "描述不能超过 200 个字符";

  const input: ProductInput = { name: values.name, price, stock, description: values.description };
  return { values, errors, input };
}

export async function createProductAction(
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  // Server Action 可被直接调用，所以每个操作都要再次校验登录状态
  await requireSession();
  const { values, errors, input } = parse(formData);
  if (Object.keys(errors).length) return { errors, values };

  await createProduct(input);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function updateProductAction(
  id: string,
  _prev: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  await requireSession();
  const { values, errors, input } = parse(formData);
  if (Object.keys(errors).length) return { errors, values };

  await updateProduct(id, input);
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteProductAction(id: string) {
  await requireSession();
  await deleteProduct(id);
  revalidatePath("/dashboard");
}
