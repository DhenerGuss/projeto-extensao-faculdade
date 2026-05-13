import { INITIAL_PRODUCTS } from "@/constants/app";
import type { ImageFit, ImagePosition, Product, ProductFormData, ProductInput, ProductRow } from "@/types/product";

export class ProductValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ProductValidationError";
  }
}

const parseNonNegativeNumber = (value: string, field: string) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new ProductValidationError(`${field} deve ser um numero maior ou igual a zero.`);
  }
  return parsed;
};

const parsePositiveInteger = (value: string, field: string) => {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 1) {
    throw new ProductValidationError(`${field} deve ser um numero inteiro maior que zero.`);
  }
  return parsed;
};

const normalizeContact = (value: string) => {
  const trimmedContact = value.trim();
  const contactDigits = trimmedContact.replace(/\D/g, "");

  if (contactDigits.length < 10 || contactDigits.length > 13) {
    throw new ProductValidationError("Contato deve conter um telefone valido.");
  }

  return trimmedContact;
};

export const generateId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : String(Date.now() + Math.random());

export const getSafeImages = (product: ProductInput): string[] => {
  const imageList = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  if (imageList.length > 0) return imageList;
  return product.image ? [product.image] : [];
};

export const normalizeProduct = (product: ProductInput): Product => {
  const images = getSafeImages(product);
  const parsedDisplayOrder = product.displayOrder === null || product.displayOrder === undefined
    ? null
    : Number(product.displayOrder);

  return {
    id: product.id ? String(product.id) : generateId(),
    name: product.name || "",
    description: product.description || "",
    price: Number(product.price) || 0,
    stock: Number(product.stock) || 0,
    isPreorder: Boolean(product.isPreorder),
    preorderDays: Math.max(1, Number(product.preorderDays) || 14),
    contact: product.contact || "",
    image: images[0] || "",
    images,
    imageFit: (product.imageFit as ImageFit) || "cover",
    imagePosition: (product.imagePosition as ImagePosition) || "center center",
    category: product.category || "",
    emoji: product.emoji || "",
    displayOrder: Number.isFinite(parsedDisplayOrder) ? parsedDisplayOrder : null,
  };
};

export const mapProductRow = (row: ProductRow): Product => normalizeProduct({
  id: row.id,
  name: row.name,
  description: row.description || "",
  price: Number(row.price) || 0,
  stock: Number(row.stock) || 0,
  isPreorder: Boolean(row.is_preorder),
  preorderDays: Math.max(1, Number(row.preorder_days) || 14),
  contact: row.contact || "",
  images: Array.isArray(row.images) ? row.images : getSafeImages({ image: row.image || "" }),
  image: Array.isArray(row.images) ? row.images[0] || "" : row.image || "",
  imageFit: row.image_fit || "cover",
  imagePosition: row.image_position || "center center",
  category: row.category || "",
  emoji: row.emoji || "",
  displayOrder: row.display_order === null || row.display_order === undefined ? null : Number(row.display_order),
});

export const createProductPayload = (data: ProductFormData) => {
  const name = data.name.trim();
  const price = parseNonNegativeNumber(data.price, "Preco");
  const stock = data.isPreorder ? 0 : parseNonNegativeNumber(data.stock, "Estoque");
  const preorderDays = data.isPreorder
    ? parsePositiveInteger(data.preorderDays || "14", "Prazo de encomenda")
    : 14;
  const contact = normalizeContact(data.contact);

  if (!name) {
    throw new ProductValidationError("Informe o nome do produto.");
  }

  return {
    name,
    description: data.description.trim(),
    price,
    stock,
    is_preorder: Boolean(data.isPreorder),
    preorder_days: preorderDays,
    contact,
    images: (data.images || []).filter(Boolean),
    image_fit: data.imageFit || "cover",
    image_position: data.imagePosition || "center center",
    category: data.category.trim(),
    emoji: data.emoji || "",
  };
};

export const getInitialProducts = (): Product[] => INITIAL_PRODUCTS.map(normalizeProduct);

export const sortProductsByDisplayOrder = (products: Product[]) =>
  products
    .map((product, index) => ({ product, index }))
    .sort((left, right) => {
      const leftOrder = left.product.displayOrder;
      const rightOrder = right.product.displayOrder;

      if (leftOrder !== null && rightOrder !== null) return leftOrder - rightOrder;
      if (leftOrder !== null) return -1;
      if (rightOrder !== null) return 1;
      return left.index - right.index;
    })
    .map(({ product }) => product);

export const getProductCover = (product: Product) =>
  product.images?.[0] ||
  product.image ||
  `https://placehold.co/400x400/fce7f3/ec4899?text=${encodeURIComponent(product.emoji || "??")}`;
