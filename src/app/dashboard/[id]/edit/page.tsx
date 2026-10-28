import { notFound } from "next/navigation";
import { getProduct } from "@/lib/db";
import { requireSession } from "@/lib/session";
import { updateProductAction } from "../../../actions/products";
import ProductForm from "../../product-form";

export default async function EditProductPage({ params }: PageProps<"/dashboard/[id]/edit">) {
  await requireSession();
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">编辑商品</h1>
      <ProductForm action={updateProductAction.bind(null, id)} product={product} submitText="保存" />
    </div>
  );
}
