import type { ProductFormData, ProductInput } from "@/types/product";

export const emptyProductForm: ProductFormData = {
  name: "",
  description: "",
  price: "",
  stock: "",
  isPreorder: false,
  preorderDays: "14",
  contact: "",
  image: "",
  images: [],
  imageFit: "cover",
  imagePosition: "center center",
  category: "",
  emoji: "",
};


export const INITIAL_PRODUCTS: ProductInput[] = [
  { id:1, name:"Urso Mel", description:"Urso fofo em crochê com detalhes em tons de mel e bege. Perfeito para decoração ou presente especial.", price:89.90, stock:5, contact:"(34) 99999-0001", image:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop", category:"Ursos", emoji:"🐻" },
  { id:2, name:"Coelhinha Rosa", description:"Coelhinha delicada feita à mão com fio de algodão orgânico. Ideal para bebês e crianças pequenas.", price:75.00, stock:3, contact:"(34) 99999-0001", image:"https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=400&fit=crop", category:"Coelhos", emoji:"🐰" },
  { id:3, name:"Dinossauro Verde", description:"Dino estiloso e robusto, cheio de personalidade! Com detalhes em crochê texturizado.", price:110.00, stock:2, contact:"(34) 98888-0002", image:"https://images.unsplash.com/photo-1564349683136-77e08dba1ef3?w=400&h=400&fit=crop", category:"Fantasia", emoji:"🦕" },
  { id:4, name:"Gatinho Lunar", description:"Gatinho místico com detalhes de lua e estrelas bordados. Uma peça única e encantadora.", price:95.50, stock:7, contact:"(34) 97777-0003", image:"https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400&h=400&fit=crop", category:"Gatos", emoji:"🐱" },
];

export const EMOJIS = ["","🧸","🐻","🐰","🐱","🐶","🦕","🐸","🐼","🦊","🐨","🦄","🐙","🐝","🦋","🐠","🦖","🌸","⭐","🎀"];
export const DECORATIONS = ["🌸","💕","🎀","✨","🌷","💫","🍭","🌺","💝","🌼"];
export const SUPABASE_PRODUCTS_TABLE = "products";
export const SUPABASE_PRODUCTS_BUCKET = "produtos";
export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "";
