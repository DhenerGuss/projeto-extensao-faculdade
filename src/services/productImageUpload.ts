import { SUPABASE_PRODUCTS_BUCKET } from "@/constants/app";
import { supabase } from "@/services/supabaseClient";

const MAX_IMAGE_UPLOAD_SIZE = 12 * 1024 * 1024;
const PRODUCT_IMAGE_FOLDER = "products/uploads";
const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

const createImageId = () => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
};

const getImageExtension = (file: File) => {
  const extensionFromName = file.name.split(".").pop()?.toLowerCase();
  const extensionFromType = ALLOWED_IMAGE_TYPES.get(file.type) || "jpg";
  if (extensionFromName && ["jpg", "jpeg", "png", "webp", "gif"].includes(extensionFromName)) {
    return extensionFromName === "jpeg" ? "jpg" : extensionFromName;
  }

  return extensionFromType;
};

export const uploadProductImage = async (file: File): Promise<string> => {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    throw new Error("Selecione uma imagem JPG, PNG, WebP ou GIF.");
  }

  if (file.size > MAX_IMAGE_UPLOAD_SIZE) {
    throw new Error("Escolha imagens de ate 12MB cada.");
  }

  const filePath = `${PRODUCT_IMAGE_FOLDER}/${createImageId()}.${getImageExtension(file)}`;

  const { error } = await supabase.storage
    .from(SUPABASE_PRODUCTS_BUCKET)
    .upload(filePath, file, {
      cacheControl: "31536000",
      contentType: file.type || "image/jpeg",
      upsert: false,
    });

  if (error) throw new Error(`Erro ao enviar imagem: ${error.message}`);

  const { data } = supabase.storage
    .from(SUPABASE_PRODUCTS_BUCKET)
    .getPublicUrl(filePath);

  return data.publicUrl;
};
