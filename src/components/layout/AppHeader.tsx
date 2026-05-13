import artipicaLogo from "@/assets/brand/artipica-logo.jpg";
import { BrandSlogan } from "@/components/layout/BrandSlogan";
import type { ViewMode } from "@/types/product";

type AppHeaderProps = {
  view: ViewMode;
  adminAuthed: boolean;
  mobileMenuOpen: boolean;
  navTo: (nextView: ViewMode) => void;
  onAdminLogout: () => void;
  onOpenPrivacy: () => void;
  onToggleMobileMenu: () => void;
  onCloseMobileMenu: () => void;
};

export function AppHeader({ view, adminAuthed, mobileMenuOpen, navTo, onAdminLogout, onOpenPrivacy, onToggleMobileMenu, onCloseMobileMenu }: AppHeaderProps) {
  return (
<header style={{ background:"rgba(255,248,251,0.92)", backdropFilter:"blur(12px)", borderBottom:"3px solid #fad4e8", position:"sticky", top:0, zIndex:500, boxShadow:"0 4px 20px rgba(212,86,138,0.1)" }}>
  <div style={{ maxWidth:1200, margin:"0 auto", padding:"0 20px", display:"flex", alignItems:"center", justifyContent:"space-between", height:86, position:"relative" }}>
    <div style={{ display:"flex", alignItems:"center", gap:12, cursor:"pointer", minWidth:0 }} onClick={() => navTo("store")}>
      <div style={{ position:"relative" }}>
        <img src={artipicaLogo} alt="Artipica" style={{ width:70, height:70, borderRadius:"50%", objectFit:"cover", border:"3px solid #f4a0c8", boxShadow:"0 4px 16px rgba(236,72,153,0.3)" }} />
        <span style={{ position:"absolute", bottom:-2, right:-2, fontSize:14 }}>✦</span>
      </div>
      <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", gap:4, minWidth:0 }}>
        <div style={{ fontFamily:"'Pacifico',cursive", fontSize:"clamp(18px,4vw,24px)", color:"#a0306a", lineHeight:1.15, whiteSpace:"nowrap" }}>Artípica</div>
        <div style={{ maxWidth:240 }}>
          <BrandSlogan />
        </div>
      </div>
    </div>

    <nav className="desktop-nav" style={{ gap:8, alignItems:"center" }}>
      <span className={`nav-link ${view==="store"?"active":""}`} onClick={() => navTo("store")}>Loja</span>
      {adminAuthed && (
        <>
          <span className={`nav-link ${view==="admin"?"active":""}`} onClick={() => navTo("admin")}>Admin</span>
          <button onClick={onAdminLogout} style={{ background:"none", border:"2px solid #fad4e8", borderRadius:50, padding:"6px 14px", fontFamily:"'Nunito',sans-serif", fontSize:12, fontWeight:800, color:"#be185d", cursor:"pointer" }}>Sair</button>
        </>
      )}
      <button onClick={() => onOpenPrivacy()} style={{ background:"none", border:"2px solid #fad4e8", borderRadius:50, padding:"6px 14px", fontFamily:"'Nunito',sans-serif", fontSize:12, fontWeight:800, color:"#be185d", cursor:"pointer" }}>LGPD</button>
    </nav>

    <button className="hamburger" onClick={() => onToggleMobileMenu()}>
      <span style={{ transform:mobileMenuOpen?"rotate(45deg) translate(5px,6px)":"none" }}/>
      <span style={{ opacity:mobileMenuOpen?0:1 }}/>
      <span style={{ transform:mobileMenuOpen?"rotate(-45deg) translate(5px,-6px)":"none" }}/>
    </button>

    {mobileMenuOpen && (
      <div className="mobile-menu">
        <div className={`mobile-menu-item ${view==="store"?"active":""}`} onClick={() => navTo("store")}>Loja</div>
        {adminAuthed && (
          <>
            <div className={`mobile-menu-item ${view==="admin"?"active":""}`} onClick={() => navTo("admin")}>Admin</div>
            <div className="mobile-menu-item" onClick={onAdminLogout}>Sair</div>
          </>
        )}
        <div className="mobile-menu-item" onClick={() => { onOpenPrivacy(); onCloseMobileMenu(); }}>Privacidade & LGPD</div>
      </div>
    )}
  </div>
</header>
  );
}
