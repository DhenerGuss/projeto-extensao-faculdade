export type ImageFit = "cover" | "contain";
export type ImagePosition = "center center" | "center top" | "center bottom" | "left center" | "right center";
export type AdminTab = "list" | "add" | "edit" | "password";
export type ViewMode = "store" | "admin";
export type ToastType = "success" | "error" | "info";

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  isPreorder: boolean;
  preorderDays: number;
  contact: string;
  image?: string;
  images: string[];
  imageFit: ImageFit;
  imagePosition: ImagePosition;
  category: string;
  emoji: string;
  displayOrder: number | null;
};

export type ProductFormData = Omit<Product, "id" | "price" | "stock" | "preorderDays" | "displayOrder"> & {
  id?: string;
  price: string;
  stock: string;
  preorderDays: string;
  displayOrder?: number | null;
};

export type ToastState = { msg: string; type: ToastType } | null;
export type ProductInput = Partial<Omit<Product, "id">> & { id?: string | number; image?: string; images?: string[] };

export type ProductRow = {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  stock: number | string;
  is_preorder?: boolean | null;
  preorder_days?: number | string | null;
  contact?: string | null;
  images?: string[] | null;
  image?: string | null;
  image_fit?: ImageFit | null;
  image_position?: ImagePosition | null;
  category?: string | null;
  emoji?: string | null;
  display_order?: number | string | null;
};
