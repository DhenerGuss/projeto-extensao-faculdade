import { useRef, type PointerEvent } from "react";
import { ProductImageCarousel } from "@/features/products/components/ProductImageCarousel";
import type { Product } from "@/types/product";
import { formatPrice } from "@/utils/formatters";

type ProductModalProps = {
  product: Product;
  onClose: () => void;
  onOpenPrivacy: () => void;
  onPreviousProduct: () => void;
  onNextProduct: () => void;
  hasPreviousProduct: boolean;
  hasNextProduct: boolean;
};

const SWIPE_THRESHOLD = 70;
const SWIPE_VERTICAL_TOLERANCE = 42;

const getWhatsAppDigits = (contact: string) => {
  const digits = contact.replace(/\D/g, "");
  return digits.startsWith("55") ? digits : `55${digits}`;
};

export function ProductModal({ product, onClose, onOpenPrivacy, onPreviousProduct, onNextProduct, hasPreviousProduct, hasNextProduct }: ProductModalProps) {
  const pointerStartRef = useRef<{ x: number; y: number; startedOnImages: boolean } | null>(null);
  const whatsappDigits = getWhatsAppDigits(product.contact);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    const startedOnInteractiveControl = Boolean(target.closest("button, a, input, textarea, select, [role='button'], [role='link']"));

    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      startedOnImages: Boolean(target.closest("[data-product-images='true']")) || startedOnInteractiveControl,
    };
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (!start || start.startedOnImages) return;

    const deltaX = event.clientX - start.x;
    const deltaY = event.clientY - start.y;
    const isHorizontalSwipe = Math.abs(deltaX) >= SWIPE_THRESHOLD && Math.abs(deltaY) <= SWIPE_VERTICAL_TOLERANCE;
    if (!isHorizontalSwipe) return;

    if (deltaX < 0 && hasNextProduct) onNextProduct();
    if (deltaX > 0 && hasPreviousProduct) onPreviousProduct();
  };

  return (
<div className="overlay" onClick={() => onClose()}>
  <div
    className="modal"
    onClick={event => event.stopPropagation()}
    onPointerDown={handlePointerDown}
    onPointerUp={handlePointerUp}
    onPointerCancel={() => { pointerStartRef.current = null; }}
    style={{ touchAction:"pan-y" }}
  >
    <div style={{ position:"relative", marginBottom:20 }}>
      <ProductImageCarousel key={product.id} product={product} variant="modal" />
      {product.emoji && (
        <div style={{ position:"absolute", top:12, left:12, fontSize:24, background:"rgba(255,255,255,0.9)", borderRadius:50, width:44, height:44, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 12px rgba(0,0,0,0.1)", pointerEvents:"none" }}>
          {product.emoji}
        </div>
      )}
      <div style={{ position:"absolute", top:12, right:12, pointerEvents:"none" }}>
        <span className={`badge ${product.isPreorder?"badge-yellow":product.stock>3?"badge-green":product.stock>0?"badge-yellow":"badge-red"}`}>
          {product.isPreorder?"Sob encomenda":product.stock>0?`${product.stock} em estoque`:"Esgotado"}
        </span>
      </div>
    </div>
    <div style={{ display:"flex", justifyContent:"space-between", gap:10, marginBottom:14 }}>
      <button className="btn-outline" type="button" disabled={!hasPreviousProduct} onClick={onPreviousProduct} style={{ padding:"8px 14px", opacity:hasPreviousProduct ? 1 : 0.45 }}>Anterior</button>
      <button className="btn-outline" type="button" disabled={!hasNextProduct} onClick={onNextProduct} style={{ padding:"8px 14px", opacity:hasNextProduct ? 1 : 0.45 }}>Próximo</button>
    </div>
    <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:11, fontWeight:800, color:"#ec4899", letterSpacing:1.5, textTransform:"uppercase", marginBottom:6 }}>{product.category}</div>
    <h2 style={{ fontFamily:"'Pacifico',cursive", fontSize:"clamp(20px,5vw,26px)", color:"#4a1040", marginBottom:10, lineHeight:1.3 }}>{product.name}</h2>
    <p style={{ fontSize:14, color:"#7a5070", lineHeight:1.8, marginBottom:20 }}>{product.description}</p>
    {product.isPreorder && (
      <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, background:"#fff8ef", border:"2px solid #fed7aa", color:"#d97706", borderRadius:18, padding:"12px 14px", fontFamily:"'Nunito',sans-serif", fontSize:14, fontWeight:900, marginBottom:18, textAlign:"center" }}>
        <span>Sob encomenda: envio após {product.preorderDays || 14} dias da compra</span>
      </div>
    )}
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:12, marginBottom:20, background:"#fce7f3", borderRadius:16, padding:"16px 20px" }}>
      <span style={{ fontFamily:"'Pacifico',cursive", fontSize:"clamp(24px,6vw,30px)", color:"#ec4899" }}>{formatPrice(product.price)}</span>
      <a href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent(`Olá! Quero ${product.isPreorder || product.stock<=0 ? "encomendar" : "pedir"} a peça ${product.name}.`)}`} target="_blank" rel="noreferrer">
        <button className="btn-primary" style={{ background:(!product.isPreorder && product.stock>0)?"linear-gradient(135deg,#34d399,#10b981)":"linear-gradient(135deg,#8b5cf6,#6d28d9)", boxShadow:(!product.isPreorder && product.stock>0)?"0 6px 20px rgba(16,185,129,0.35)":"0 6px 20px rgba(109,40,217,0.35)", fontSize:13 }}>
          {!product.isPreorder && product.stock>0 ? "Pedir via WhatsApp" : "Encomendar pelo WhatsApp"}
        </button>
      </a>
    </div>
    <div style={{ fontSize:11, color:"#c06090", fontFamily:"'Nunito',sans-serif", marginBottom:16, textAlign:"center" }}>
      Ao entrar em contato, você concorda com nossa{" "}
      <span style={{ color:"#ec4899", cursor:"pointer", fontWeight:800 }} onClick={() => { onClose(); onOpenPrivacy(); }}>Política de Privacidade</span>
    </div>
    <button className="btn-outline" style={{ width:"100%" }} onClick={() => onClose()}>Fechar</button>
  </div>
</div>
  );
}
