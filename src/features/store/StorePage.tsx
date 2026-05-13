import { SearchIcon } from "@/components/icons/SearchIcon";
import { BrandSlogan } from "@/components/layout/BrandSlogan";
import { ProductImageCarousel } from "@/features/products/components/ProductImageCarousel";
import type { Product } from "@/types/product";
import { formatPrice } from "@/utils/formatters";

type StorePageProps = {
  productsLoading: boolean;
  filteredProducts: Product[];
  categories: string[];
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterCategory: string;
  setFilterCategory: (value: string) => void;
  setSelectedProduct: (product: Product) => void;
  setShowPrivacy: (show: boolean) => void;
};

export function StorePage({ productsLoading, filteredProducts, categories, searchTerm, setSearchTerm, filterCategory, setFilterCategory, setSelectedProduct, setShowPrivacy }: StorePageProps) {
  return (
<main>
  <section className="hero-bg" style={{ padding:"clamp(48px,8vw,96px) 20px clamp(36px,6vw,64px)", textAlign:"center", position:"relative", overflow:"hidden" }}>
    <div style={{ position:"absolute", top:20, left:"5%", fontSize:40, opacity:0.15, transform:"rotate(-15deg)" }}>✦</div>
    <div style={{ position:"absolute", top:30, right:"8%", fontSize:36, opacity:0.15, transform:"rotate(10deg)" }}>✧</div>
    <div style={{ position:"absolute", bottom:20, left:"12%", fontSize:32, opacity:0.12, transform:"rotate(5deg)" }}>✦</div>
    <div style={{ position:"absolute", bottom:10, right:"15%", fontSize:44, opacity:0.12, transform:"rotate(-8deg)" }}>✧</div>

    <div style={{ maxWidth:700, margin:"0 auto", position:"relative" }}>
      <div style={{ display:"inline-block", background:"linear-gradient(135deg,#fce7f3,#fef9c3)", borderRadius:50, padding:"8px 24px", marginBottom:20, border:"2px solid #f4a0c8" }}>
        <BrandSlogan />
      </div>
      <h1 style={{ fontFamily:"'Pacifico',cursive", fontSize:"clamp(32px,8vw,58px)", color:"#4a1040", lineHeight:1.2, marginBottom:16 }}>
        Amigurumis que<br /><span style={{ background:"linear-gradient(135deg,#ec4899,#f472b6)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>encantam corações</span>
      </h1>
      <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:"clamp(14px,3vw,17px)", color:"#7a5070", lineHeight:1.8, marginBottom:32, maxWidth:500, margin:"0 auto 32px" }}>
        Cada peça é única, feita à mão com carinho e cuidado.
      </p>
      <div style={{ display:"flex", justifyContent:"center", gap:16, flexWrap:"wrap" }}>
        {["🧸","🐰","🐱","🦕","🐼","🦊"].map((item, index) => (
          <span key={item} className="bounce" style={{ fontSize:"clamp(26px,5vw,38px)", animationDelay:`${index*0.25}s`, display:"inline-block", background:"#fff", borderRadius:50, width:60, height:60, lineHeight:"60px", textAlign:"center", boxShadow:"0 8px 24px rgba(212,86,138,0.2)", border:"3px solid #fad4e8" }}>
            {item}
          </span>
        ))}
      </div>
    </div>
  </section>

  <section style={{ maxWidth:1200, margin:"0 auto", padding:"40px 16px 100px" }}>
    <div style={{ display:"flex", flexDirection:"column", gap:14, marginBottom:32 }}>
      <div className="search-shell">
        <span className="search-icon-bubble">
          <SearchIcon />
        </span>
        <input className="input-field search-input" placeholder="Pesquisar fofurinhas..." value={searchTerm}
          onChange={event => setSearchTerm(event.target.value)} />
      </div>
      <div style={{ display:"flex", flexWrap:"wrap" }}>
        {categories.map(category => (
          <span key={category} className={`tag ${filterCategory===category?"active":""}`} onClick={() => setFilterCategory(category)}>{category}</span>
        ))}
      </div>
    </div>

    {productsLoading ? (
      <div style={{ textAlign:"center", padding:"80px 0", color:"#c06090" }}>
        <div style={{ fontSize:64, marginBottom:16 }} className="bounce">🧶</div>
        <p style={{ fontFamily:"'Pacifico',cursive", fontSize:20 }}>Carregando produtos...</p>
      </div>
    ) : filteredProducts.length===0 ? (
      <div style={{ textAlign:"center", padding:"80px 0", color:"#c06090" }}>
        <div style={{ fontSize:64, marginBottom:16 }} className="bounce">🧶</div>
        <p style={{ fontFamily:"'Pacifico',cursive", fontSize:20 }}>Nenhum amigurumi encontrado</p>
      </div>
    ) : (
      <div className="grid-products">
        {filteredProducts.map((product, index) => (
          <div key={product.id} className="card-hover" onClick={() => setSelectedProduct(product)}
            style={{ background:"#fff", borderRadius:24, overflow:"hidden", border:"3px solid #fad4e8", boxShadow:"0 8px 28px rgba(212,86,138,0.1)", animationDelay:`${index*0.05}s` }}>
            <div style={{ position:"relative" }}>
              <ProductImageCarousel product={product} variant="card" />
              <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(74,16,64,0.35) 0%,transparent 50%)", pointerEvents:"none" }} />
              <div style={{ position:"absolute", top:10, right:10, pointerEvents:"none" }}>
                <span className={`badge ${product.isPreorder?"badge-yellow":product.stock>3?"badge-green":product.stock>0?"badge-yellow":"badge-red"}`}>
                  {product.isPreorder?"Sob encomenda":product.stock>0?`${product.stock} und.`:"Esgotado"}
                </span>
              </div>
              {product.emoji && (
                <div style={{ position:"absolute", top:10, left:10, fontSize:20, background:"rgba(255,255,255,0.9)", borderRadius:50, width:38, height:38, display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 12px rgba(0,0,0,0.1)", pointerEvents:"none" }}>
                  {product.emoji}
                </div>
              )}
            </div>
            <div style={{ padding:"clamp(12px,3vw,18px)" }}>
              <div style={{ fontFamily:"'Nunito',sans-serif", fontSize:10, color:"#ec4899", fontWeight:900, letterSpacing:1.5, textTransform:"uppercase", marginBottom:4 }}>{product.category}</div>
              <h3 style={{ fontFamily:"'Pacifico',cursive", fontSize:"clamp(15px,3vw,18px)", color:"#4a1040", marginBottom:6, lineHeight:1.3 }}>{product.name}</h3>
              <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:"clamp(11px,2.5vw,13px)", color:"#9a6080", lineHeight:1.6, marginBottom:14, display:"-webkit-box", WebkitLineClamp:2, WebkitBoxOrient:"vertical", overflow:"hidden" }}>{product.description}</p>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8 }}>
                <span style={{ fontFamily:"'Pacifico',cursive", fontSize:"clamp(16px,4vw,20px)", color:"#ec4899" }}>{formatPrice(product.price)}</span>
                <button className="btn-primary" style={{ padding:"8px 16px", fontSize:11 }} onClick={event => { event.stopPropagation(); setSelectedProduct(product); }}>
                  Ver mais
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </section>

  <footer style={{ background:"linear-gradient(135deg,#4a1040,#6d1a5a)", color:"#fde8f4", padding:"48px 20px 32px", textAlign:"center" }}>
    <div style={{ maxWidth:600, margin:"0 auto" }}>
      <div style={{ fontFamily:"'Pacifico',cursive", fontSize:"clamp(24px,5vw,32px)", marginBottom:8 }}>Artípica</div>
      <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:13, color:"#f4a0c8", letterSpacing:1, marginBottom:20 }}>
        <BrandSlogan variant="footer" />
      </p>
      <div style={{ display:"flex", justifyContent:"center", gap:16, flexWrap:"wrap", marginBottom:24 }}>
        <button onClick={() => setShowPrivacy(true)} style={{ background:"rgba(255,255,255,0.12)", border:"1.5px solid rgba(255,255,255,0.25)", borderRadius:50, padding:"8px 20px", color:"#fde8f4", fontFamily:"'Nunito',sans-serif", fontSize:12, fontWeight:800, cursor:"pointer" }}>
          Privacidade & LGPD
        </button>
        <span style={{ background:"rgba(255,255,255,0.12)", border:"1.5px solid rgba(255,255,255,0.25)", borderRadius:50, padding:"8px 20px", color:"#fde8f4", fontFamily:"'Nunito',sans-serif", fontSize:12, fontWeight:800 }}>
          LGPD Compliant
        </span>
      </div>
      <hr style={{ border:"none", borderTop:"1px solid rgba(255,255,255,0.15)", margin:"0 auto 16px", maxWidth:200 }} />
      <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:11, color:"#c492b4" }}>© {new Date().getFullYear()} Artípica · Todos os direitos reservados · Lei 13.709/2018</p>
    </div>
  </footer>
</main>
  );
}
