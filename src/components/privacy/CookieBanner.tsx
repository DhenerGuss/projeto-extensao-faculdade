export function CookieBanner({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
  return (
    <div style={{ position:"fixed", bottom:0, left:0, right:0, zIndex:9000, background:"linear-gradient(135deg,#fff0f8,#fffde7)", borderTop:"3px solid #f4a0c8", padding:"20px 24px", boxShadow:"0 -8px 32px rgba(212,86,138,0.15)", fontFamily:"'Nunito',sans-serif" }}>
      <div style={{ maxWidth:900, margin:"0 auto", display:"flex", alignItems:"center", gap:20, flexWrap:"wrap" }}>
        <span style={{ fontSize:32 }}>🍪</span>
        <div style={{ flex:1, minWidth:260 }}>
          <div style={{ fontSize:15, fontWeight:800, color:"#a0306a", marginBottom:4 }}>Usamos cookies 🌸</div>
          <div style={{ fontSize:13, color:"#b06090", lineHeight:1.6 }}>
            Este site usa cookies essenciais para funcionar. Em conformidade com a <strong>LGPD (Lei 13.709/2018)</strong>, pedimos seu consentimento antes de coletar qualquer dado. Leia nossa{" "}
            <span style={{ color:"#d4568a", cursor:"pointer", textDecoration:"underline" }} onClick={() => alert("Política de Privacidade\n\nColetamos apenas dados necessários para o funcionamento da loja (contato via WhatsApp). Não compartilhamos dados com terceiros. Você pode solicitar exclusão a qualquer momento pelo contato da loja.")}>Política de Privacidade</span>.
          </div>
        </div>
        <div style={{ display:"flex", gap:10, flexShrink:0, flexWrap:"wrap" }}>
          <button onClick={onDecline} style={{ padding:"10px 20px", borderRadius:50, border:"2px solid #f4a0c8", background:"transparent", color:"#c06090", fontFamily:"'Nunito',sans-serif", fontSize:13, fontWeight:800, cursor:"pointer" }}>
            Recusar
          </button>
          <button onClick={onAccept} style={{ padding:"10px 22px", borderRadius:50, border:"none", background:"linear-gradient(135deg,#f472b6,#ec4899)", color:"#fff", fontFamily:"'Nunito',sans-serif", fontSize:13, fontWeight:800, cursor:"pointer", boxShadow:"0 4px 16px rgba(236,72,153,0.35)" }}>
            Aceitar tudo 🎀
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal de Privacidade LGPD ──────────────────────────────────────────────────
