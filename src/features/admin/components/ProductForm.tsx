import type { ChangeEvent, Dispatch, SetStateAction } from "react";
import { EMOJIS } from "@/constants/app";
import { ImageUploader } from "@/features/products/components/ImageUploader";
import { labelStyle } from "@/styles/labelStyle";
import type { ProductFormData } from "@/types/product";

type ProductFormProps = {
  title: string;
  data: ProductFormData;
  setData: Dispatch<SetStateAction<ProductFormData>>;
  onSubmit: () => void | Promise<void>;
  onCancel: () => void;
  submitLabel: string;
  isSubmitting?: boolean;
};

export function ProductForm({ title, data, setData, onSubmit, onCancel, submitLabel, isSubmitting=false }: ProductFormProps) {
  const set = (field: keyof ProductFormData) => (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setData(prev => ({ ...prev, [field]: e.target.value }));
  return (
    <div style={{ background:"linear-gradient(135deg,#fff0f8,#fffde7)", borderRadius:28, padding:"clamp(20px,4vw,36px)", border:"3px solid #fad4e8", boxShadow:"0 12px 40px rgba(212,86,138,0.12)", maxWidth:640, width:"100%" }}>
      <h2 style={{ fontFamily:"'Pacifico',cursive", fontSize:"clamp(18px,4vw,24px)", color:"#a0306a", marginBottom:24 }}>{title} 🌸</h2>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        <div style={{ gridColumn:"1 / -1" }}>
          <label style={labelStyle}>✏️ Nome do Produto *</label>
          <input className="input-field" placeholder="Ex: Urso Mel" value={data.name} onChange={set("name")} />
        </div>
        <div style={{ gridColumn:"1 / -1" }}>
          <label style={labelStyle}>💬 Descrição *</label>
          <textarea className="input-field" placeholder="Descreva o produto..." value={data.description} onChange={set("description")} style={{ minHeight:80, resize:"vertical" }} />
        </div>
        <div>
          <label style={labelStyle}>💰 Preço (R$) *</label>
          <input className="input-field" type="number" placeholder="89.90" value={data.price} onChange={set("price")} step="0.01" inputMode="decimal" />
        </div>
        <div>
          <label style={labelStyle}>📦 Estoque *</label>
          <input
            className="input-field"
            type="number"
            placeholder="5"
            value={data.stock}
            onChange={set("stock")}
            min="0"
            inputMode="numeric"
            disabled={data.isPreorder}
            style={{ opacity:data.isPreorder ? 0.55 : 1, cursor:data.isPreorder ? "not-allowed" : "text" }}
          />
        </div>
        <div style={{ gridColumn:"1 / -1", background:"#fff", border:"2px solid #fad4e8", borderRadius:18, padding:14 }}>
          <label style={{ display:"flex", alignItems:"center", gap:10, fontFamily:"'Nunito',sans-serif", fontSize:14, fontWeight:900, color:"#a0306a", cursor:"pointer" }}>
            <input
              type="checkbox"
              checked={data.isPreorder}
              onChange={e => setData(prev => ({
                ...prev,
                isPreorder:e.target.checked,
                stock:e.target.checked ? "0" : prev.stock
              }))}
              style={{ width:18, height:18, accentColor:"#ec4899" }}
            />
            Sob encomenda
          </label>
          {data.isPreorder && (
            <div style={{ marginTop:12 }}>
              <label style={labelStyle}>⏰ Envio após quantos dias da compra?</label>
              <input
                className="input-field"
                type="number"
                placeholder="14"
                value={data.preorderDays}
                onChange={set("preorderDays")}
                min="1"
                inputMode="numeric"
              />
            </div>
          )}
        </div>
        <div style={{ gridColumn:"1 / -1" }}>
          <label style={labelStyle}>📱 Contato (WhatsApp) *</label>
          <input className="input-field" placeholder="(34) 99999-0000" value={data.contact} onChange={set("contact")} inputMode="tel" />
        </div>
        <div style={{ gridColumn:"1 / -1" }}>
          <label style={labelStyle}>🏷️ Categoria</label>
          <input className="input-field" placeholder="Ex: Ursos, Gatos..." value={data.category} onChange={set("category")} />
        </div>
        <div style={{ gridColumn:"1 / -1" }}>
          <ImageUploader
            images={data.images || []}
            imageFit={data.imageFit || "cover"}
            imagePosition={data.imagePosition || "center center"}
            onChange={images => setData(prev => ({ ...prev, images, image: images[0] || "" }))}
            onFitChange={imageFit => setData(prev => ({ ...prev, imageFit }))}
            onPositionChange={imagePosition => setData(prev => ({ ...prev, imagePosition }))}
          />
        </div>
        <div style={{ gridColumn:"1 / -1" }}>
          <label style={labelStyle}>✨ Emoji do personagem (opcional)</label>
          <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginTop:6 }}>
            {EMOJIS.map((em, idx) => (
              <button key={idx} type="button" onClick={() => setData(prev => ({ ...prev, emoji: em }))}
                style={{ fontSize: em ? 20 : 10, width: em ? 42 : 58, height:42, borderRadius:50, border: data.emoji===em ? "3px solid #ec4899" : "2px solid #fad4e8", background: data.emoji===em ? "linear-gradient(135deg,#fce7f3,#fdf2fb)" : "#fff", cursor:"pointer", color: em ? "inherit" : "#c06090", fontWeight:800, fontFamily:"'Nunito',sans-serif", transition:"all 0.15s", boxShadow: data.emoji===em ? "0 4px 12px rgba(236,72,153,0.25)" : "none" }}>
                {em || "Nenhum"}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div style={{ display:"flex", gap:12, marginTop:28, flexWrap:"wrap" }}>
        <button className="btn-primary" type="button" onClick={onSubmit} disabled={isSubmitting} style={{ opacity:isSubmitting?0.7:1, cursor:isSubmitting?"not-allowed":"pointer" }}>
          {isSubmitting ? "Salvando..." : submitLabel} 💕
        </button>
        <button className="btn-outline" type="button" onClick={onCancel} disabled={isSubmitting} style={{ opacity:isSubmitting?0.7:1, cursor:isSubmitting?"not-allowed":"pointer" }}>Cancelar</button>
      </div>
    </div>
  );
}
