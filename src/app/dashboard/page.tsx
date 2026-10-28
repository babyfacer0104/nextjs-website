import Link from "next/link";
import { listProducts } from "@/lib/db";
import { requireSession } from "@/lib/session";
import DeleteButton from "./delete-button";

export default async function ProductsPage({ searchParams }: PageProps<"/dashboard">) {
  await requireSession();
  const { q } = await searchParams;
  const keyword = typeof q === "string" ? q : "";
  const products = await listProducts(keyword);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">商品列表</h1>
        <div className="flex gap-2">
          <form className="flex gap-2">
            <input
              name="q"
              defaultValue={keyword}
              placeholder="搜索名称或描述"
              className="input w-48"
            />
            <button type="submit" className="btn-secondary">
              搜索
            </button>
          </form>
          <Link href="/dashboard/new" className="btn-primary">
            新增商品
          </Link>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500">
            <tr>
              <th className="px-4 py-3 font-medium">名称</th>
              <th className="px-4 py-3 font-medium">价格</th>
              <th className="px-4 py-3 font-medium">库存</th>
              <th className="px-4 py-3 font-medium">描述</th>
              <th className="px-4 py-3 font-medium">更新时间</th>
              <th className="px-4 py-3 text-right font-medium">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  {keyword ? "没有匹配的商品" : "暂无商品，点击右上角新增"}
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                  <td className="px-4 py-3">¥{p.price.toFixed(2)}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="max-w-xs truncate px-4 py-3 text-gray-500">{p.description || "-"}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {new Date(p.updatedAt).toLocaleString("zh-CN")}
                  </td>
                  <td className="space-x-3 px-4 py-3 text-right whitespace-nowrap">
                    <Link href={`/dashboard/${p.id}/edit`} className="text-indigo-600 hover:underline">
                      编辑
                    </Link>
                    <DeleteButton id={p.id} name={p.name} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
