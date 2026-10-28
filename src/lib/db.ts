import "server-only";
import { randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

// 简单起见，数据保存在项目根目录的 data/products.json 中
const DB_FILE = path.join(process.cwd(), "data", "products.json");

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type ProductInput = Pick<Product, "name" | "price" | "stock" | "description">;

async function readAll(): Promise<Product[]> {
  try {
    return JSON.parse(await fs.readFile(DB_FILE, "utf-8"));
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }
}

async function writeAll(products: Product[]) {
  await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
  await fs.writeFile(DB_FILE, JSON.stringify(products, null, 2));
}

export async function listProducts(keyword?: string) {
  const products = await readAll();
  const q = keyword?.trim().toLowerCase();
  const filtered = q
    ? products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      )
    : products;
  return filtered.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getProduct(id: string) {
  const products = await readAll();
  return products.find((p) => p.id === id) ?? null;
}

export async function createProduct(input: ProductInput) {
  const products = await readAll();
  const now = new Date().toISOString();
  const product: Product = { id: randomUUID(), ...input, createdAt: now, updatedAt: now };
  products.push(product);
  await writeAll(products);
  return product;
}

export async function updateProduct(id: string, input: ProductInput) {
  const products = await readAll();
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return null;
  products[index] = { ...products[index], ...input, updatedAt: new Date().toISOString() };
  await writeAll(products);
  return products[index];
}

export async function deleteProduct(id: string) {
  const products = await readAll();
  await writeAll(products.filter((p) => p.id !== id));
}
