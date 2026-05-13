export function PrivacyModal({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(90,20,70,0.55)", zIndex:9100, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }} onClick={onClose}>
      <div style={{ background:"#fff0f8", borderRadius:28, maxWidth:520, width:"100%", maxHeight:"85vh", overflowY:"auto", padding:36, boxShadow:"0 30px 80px rgba(180,50,120,0.25)", fontFamily:"'Nunito',sans-serif" }} onClick={e=>e.stopPropagation()}>
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <span style={{ fontSize:48 }}>🔐</span>
          <h2 style={{ fontFamily:"'Pacifico',cursive", fontSize:24, color:"#a0306a", marginTop:8, marginBottom:0 }}>Privacidade & LGPD</h2>
        </div>
        {[
          { icon:"🌸", title:"Dados que coletamos", text:"Apenas os dados necessários para comunicação via WhatsApp (nome e telefone que você compartilha voluntariamente ao clicar no botão de contato)." },
          { icon:"💕", title:"Finalidade", text:"Os dados são usados exclusivamente para atendimento de pedidos da Artípica. Não realizamos marketing sem consentimento." },
          { icon:"🎀", title:"Compartilhamento", text:"Não vendemos nem compartilhamos seus dados com terceiros. Os dados ficam apenas entre você e a loja." },
          { icon:"✨", title:"Seus direitos (LGPD)", text:"Você tem direito de acessar, corrigir, excluir ou revogar consentimento dos seus dados a qualquer momento, conforme Art. 18 da Lei 13.709/2018." },
          { icon:"🌷", title:"Contato do DPO", text:"Para exercer seus direitos ou tirar dúvidas sobre privacidade, entre em contato diretamente com a loja via WhatsApp." },
          { icon:"🍪", title:"Cookies", text:"Usamos apenas cookies estritamente necessários para o funcionamento da loja. Não usamos cookies de rastreamento ou publicidade." },
        ].map(({ icon, title, text }) => (
          <div key={title} style={{ background:"#fff", borderRadius:16, padding:"16px 20px", marginBottom:12, border:"2px solid #fad4e8" }}>
            <div style={{ fontSize:13, fontWeight:800, color:"#a0306a", marginBottom:4 }}>{icon} {title}</div>
            <div style={{ fontSize:13, color:"#b06090", lineHeight:1.6 }}>{text}</div>
          </div>
        ))}
        <button onClick={onClose} style={{ width:"100%", padding:"14px 0", borderRadius:50, border:"none", background:"linear-gradient(135deg,#f472b6,#ec4899)", color:"#fff", fontFamily:"'Nunito',sans-serif", fontSize:14, fontWeight:800, cursor:"pointer", marginTop:8 }}>
          Entendido! 💕
        </button>
      </div>
    </div>
  );
}

// ── Upload de Imagens ─────────────────────────────────────────────────────────
