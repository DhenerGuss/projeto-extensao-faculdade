import { useRef, useState, type ChangeEvent } from "react";
import { uploadProductImage } from "@/services/productImageUpload";
import { labelStyle } from "@/styles/labelStyle";
import type { ImageFit, ImagePosition } from "@/types/product";

type ImageUploaderProps = {
  images: string[];
  onChange: (images: string[]) => void;
  imageFit?: ImageFit;
  imagePosition?: ImagePosition;
  onFitChange?: (fit: ImageFit) => void;
  onPositionChange?: (position: ImagePosition) => void;
};

const TRUSTED_IMAGE_HOSTS = new Set(["images.unsplash.com", "placehold.co"]);

const getSupabaseHost = () => {
  try {
    return new URL(import.meta.env.VITE_SUPABASE_URL || "").hostname;
  } catch {
    return "";
  }
};

const isAllowedImageUrl = (value: string) => {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;

    const supabaseHost = getSupabaseHost();
    return url.hostname === supabaseHost || TRUSTED_IMAGE_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
};

export function ImageUploader({ images, onChange, imageFit="cover", imagePosition="center center", onFitChange, onPositionChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const safeImages = images.filter(Boolean);

  const updateImages = (nextImages: string[]) => onChange(nextImages.filter(Boolean));

  const handleFiles = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (files.length === 0) return;

    try {
      setIsUploading(true);
      const uploadedImages = await Promise.all(files.map(uploadProductImage));
      updateImages([...safeImages, ...uploadedImages]);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Não foi possível enviar uma das imagens. Tente outra foto.");
    } finally {
      setIsUploading(false);
    }
  };

  const addUrlImage = () => {
    const trimmedUrl = urlValue.trim();
    if (!trimmedUrl) return;

    if (!isAllowedImageUrl(trimmedUrl)) {
      alert("Use uma URL HTTPS de imagem autorizada.");
      return;
    }

    updateImages([...safeImages, trimmedUrl]);
    setUrlValue("");
  };

  const removeImage = (index: number) => updateImages(safeImages.filter((_, currentIndex) => currentIndex !== index));
  const moveImage = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= safeImages.length) return;
    const nextImages = [...safeImages];
    [nextImages[index], nextImages[targetIndex]] = [nextImages[targetIndex], nextImages[index]];
    updateImages(nextImages);
  };

  return (
    <div>
      <label style={labelStyle}>📷 Fotos do Produto</label>
      <div style={{ display:"flex", gap:12, alignItems:"flex-start", flexWrap:"wrap" }}>
        <button type="button" onClick={() => inputRef.current?.click()} style={{ width:100, height:100, borderRadius:20, border:"3px dashed #f4a0c8", background:"#fff0f8", cursor:"pointer", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"all 0.2s" }}>
          <div style={{ textAlign:"center" }}><div style={{ fontSize:28 }}>📷</div><div style={{ fontFamily:"'Nunito',sans-serif", fontSize:10, color:"#d4568a", fontWeight:800, marginTop:4 }}>ADICIONAR</div></div>
        </button>
        <div style={{ flex:1, minWidth:180 }}>
          <button type="button" onClick={() => inputRef.current?.click()}
            style={{ width:"100%", padding:"10px 0", borderRadius:50, border:"2.5px solid #f4a0c8", background:"#fff0f8", color:"#d4568a", fontFamily:"'Nunito',sans-serif", fontSize:13, fontWeight:800, cursor:"pointer", marginBottom:8 }}>
            {isUploading ? "⏳ Enviando imagens..." : "📂 Escolher uma ou mais fotos"}
          </button>
          <input ref={inputRef} type="file" accept="image/*" multiple style={{ display:"none" }} onChange={handleFiles} />
          <div style={{ display:"flex", gap:8 }}>
            <input className="input-field" placeholder="…ou cole URL da imagem" value={urlValue} onChange={e => setUrlValue(e.target.value)} onKeyDown={e => e.key === "Enter" && addUrlImage()} style={{ fontSize:12 }} />
            <button type="button" className="btn-outline" onClick={addUrlImage} style={{ padding:"0 14px", whiteSpace:"nowrap" }}>Add</button>
          </div>
          <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:11, color:"#c06090", marginTop:6, lineHeight:1.5 }}>
            A primeira foto será a capa do produto. Você pode reorganizar ou remover as fotos abaixo.
          </p>
        </div>
      </div>

      {safeImages.length > 0 && (
        <div style={{ marginTop:14, display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(96px,1fr))", gap:10 }}>
          {safeImages.map((image, index) => (
            <div key={`${image}-${index}`} style={{ position:"relative", border:"2px solid #fad4e8", borderRadius:18, overflow:"hidden", background:"#fff" }}>
              <img src={image} alt={`Foto ${index + 1}`} style={{ width:"100%", aspectRatio:"1/1", objectFit:imageFit, objectPosition:imagePosition, display:"block" }} />
              {index === 0 && <span style={{ position:"absolute", top:6, left:6, background:"#ec4899", color:"#fff", fontSize:10, fontWeight:900, borderRadius:50, padding:"3px 8px", fontFamily:"'Nunito',sans-serif" }}>CAPA</span>}
              <button type="button" onClick={() => removeImage(index)} style={{ position:"absolute", top:6, right:6, width:24, height:24, borderRadius:50, border:"none", background:"rgba(220,38,38,0.9)", color:"#fff", cursor:"pointer", fontWeight:900 }}>×</button>
              <div style={{ display:"flex", gap:4, padding:6 }}>
                <button type="button" className="btn-outline" disabled={index===0} onClick={() => moveImage(index, -1)} style={{ flex:1, padding:"5px 0", fontSize:10, opacity:index===0?0.45:1 }}>←</button>
                <button type="button" className="btn-outline" disabled={index===safeImages.length-1} onClick={() => moveImage(index, 1)} style={{ flex:1, padding:"5px 0", fontSize:10, opacity:index===safeImages.length-1?0.45:1 }}>→</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {safeImages.length > 0 && (
        <div style={{ marginTop:14, display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          <div>
            <label style={labelStyle}>🖼️ Enquadramento</label>
            <select className="input-field" value={imageFit} onChange={e => onFitChange?.(e.target.value as ImageFit)} style={{ fontSize:12 }}>
              <option value="cover">Preencher quadrado</option>
              <option value="contain">Mostrar foto inteira</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>🎯 Posição da foto</label>
            <select className="input-field" value={imagePosition} onChange={e => onPositionChange?.(e.target.value as ImagePosition)} style={{ fontSize:12 }}>
              <option value="center center">Centro</option>
              <option value="center top">Topo</option>
              <option value="center bottom">Base</option>
              <option value="left center">Esquerda</option>
              <option value="right center">Direita</option>
            </select>
          </div>
          <p style={{ gridColumn:"1 / -1", fontFamily:"'Nunito',sans-serif", fontSize:11, color:"#c06090", lineHeight:1.5 }}>
            No computador, as setas aparecem quando há mais de uma foto. No celular, o cliente pode arrastar para o lado.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Galeria / carrossel do produto ───────────────────────────────────────────
