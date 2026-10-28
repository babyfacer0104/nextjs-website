import { createProductAction } from "../../actions/products";
import ProductForm from "../product-form";

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">新增商品</h1>
      <ProductForm action={createProductAction} submitText="创建" />
    </div>
  );
}
