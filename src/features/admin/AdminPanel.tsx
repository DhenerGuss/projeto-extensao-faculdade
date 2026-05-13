import { useState, type Dispatch, type SetStateAction } from "react";
import { emptyProductForm } from "@/constants/app";
import { ProductForm } from "@/features/admin/components/ProductForm";
import { ProductImageCarousel } from "@/features/products/components/ProductImageCarousel";
import { labelStyle } from "@/styles/labelStyle";
import type { AdminTab, Product, ProductFormData } from "@/types/product";
import { formatPrice } from "@/utils/formatters";

type PasswordFormState = {
  current: string;
  next: string;
  confirm: string;
};

type AdminPanelProps = {
  adminAuthed: boolean;
  adminEmail: string;
  setAdminEmail: (value: string) => void;
  adminEmailConfigured: boolean;
  adminPassword: string;
  setAdminPassword: (value: string) => void;
  handleAdminLogin: () => void | Promise<void>;
  adminSigningIn: boolean;
  adminError: string;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  setEditingProduct: Dispatch<SetStateAction<ProductFormData | null>>;
  products: Product[];
  startEdit: (product: Product) => void;
  handleDeleteProduct: (id: string) => void | Promise<void>;
  handleReorderProducts: (products: Product[]) => void | Promise<void>;
  savingProductOrder: boolean;
  passwordForm: PasswordFormState;
  setPasswordForm: Dispatch<SetStateAction<PasswordFormState>>;
  handleChangePassword: () => void | Promise<void>;
  changingPassword: boolean;
  form: ProductFormData;
  setForm: Dispatch<SetStateAction<ProductFormData>>;
  handleAddProduct: () => void | Promise<void>;
  resetForm: () => void;
  savingProduct: boolean;
  editingProduct: ProductFormData | null;
  handleEditProduct: () => void | Promise<void>;
};

export function AdminPanel({
  adminAuthed,
  adminEmail,
  setAdminEmail,
  adminEmailConfigured,
  adminPassword,
  setAdminPassword,
  handleAdminLogin,
  adminSigningIn,
  adminError,
  adminTab,
  setAdminTab,
  setEditingProduct,
  products,
  startEdit,
  handleDeleteProduct,
  handleReorderProducts,
  savingProductOrder,
  passwordForm,
  setPasswordForm,
  handleChangePassword,
  changingPassword,
  form,
  setForm,
  handleAddProduct,
  resetForm,
  savingProduct,
  editingProduct,
  handleEditProduct,
}: AdminPanelProps) {
  const [draggedProductId, setDraggedProductId] = useState<string | null>(null);
  const [dragOverProductId, setDragOverProductId] = useState<string | null>(null);

  const moveProduct = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex || fromIndex < 0 || toIndex < 0) return;

    const nextProducts = [...products];
    const [selectedProduct] = nextProducts.splice(fromIndex, 1);
    nextProducts.splice(toIndex, 0, selectedProduct);
    void handleReorderProducts(nextProducts);
  };

  const moveProductById = (productId: string, direction: -1 | 1) => {
    const currentIndex = products.findIndex(product => product.id === productId);
    moveProduct(currentIndex, currentIndex + direction);
  };

  const dropProduct = (sourceProductId: string, targetProductId: string) => {
    setDraggedProductId(null);
    setDragOverProductId(null);

    if (!sourceProductId || sourceProductId === targetProductId) return;

    const fromIndex = products.findIndex(product => product.id === sourceProductId);
    const toIndex = products.findIndex(product => product.id === targetProductId);
    moveProduct(fromIndex, toIndex);
  };

  return (
    <div style={{ maxWidth:960, margin:"0 auto", padding:"clamp(24px,5vw,48px) 16px 100px", display:"flex", flexDirection:"column", alignItems:"center", width:"100%" }}>
      <div style={{ marginBottom:32, textAlign:"center", width:"100%" }}>
        <h1 style={{ fontFamily:"'Pacifico',cursive", fontSize:"clamp(24px,6vw,36px)", color:"#a0306a", marginBottom:8 }}>Painel Administrativo</h1>
        <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:13, color:"#9a6080" }}>Gerencie produtos, fotos, estoque, precos e contatos.</p>
      </div>

      {!adminAuthed ? (
        <div style={{ background:"linear-gradient(135deg,#fff0f8,#fffde7)", borderRadius:28, padding:"clamp(24px,5vw,40px)", maxWidth:420, width:"100%", margin:"0 auto", border:"3px solid #fad4e8", boxShadow:"0 12px 40px rgba(212,86,138,0.12)" }}>
          <div style={{ textAlign:"center", marginBottom:28 }}>
            <h2 style={{ fontFamily:"'Pacifico',cursive", fontSize:"clamp(18px,5vw,24px)", color:"#a0306a" }}>Acesso Restrito</h2>
            <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:13, color:"#9a6080", marginTop:8 }}>Entre com sua conta administrativa.</p>
          </div>

          {!adminEmailConfigured && (
            <input
              className="input-field"
              type="email"
              placeholder="E-mail do admin"
              value={adminEmail}
              onChange={event => setAdminEmail(event.target.value)}
              style={{ marginBottom:12 }}
            />
          )}
          <input
            className="input-field"
            type="password"
            placeholder="Senha..."
            value={adminPassword}
            onChange={event => setAdminPassword(event.target.value)}
            onKeyDown={event => event.key === "Enter" && !adminSigningIn && void handleAdminLogin()}
            style={{ marginBottom:12 }}
          />
          {adminError && <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:13, color:"#ef4444", fontWeight:800, marginBottom:10, textAlign:"center" }}>{adminError}</p>}
          <button
            className="btn-primary"
            type="button"
            style={{ width:"100%", opacity:adminSigningIn ? 0.7 : 1, cursor:adminSigningIn ? "not-allowed" : "pointer" }}
            onClick={() => void handleAdminLogin()}
            disabled={adminSigningIn}
          >
            {adminSigningIn ? "Entrando..." : "Entrar"}
          </button>
          <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:11, color:"#c06090", textAlign:"center", marginTop:16 }}>
            A sessao usa Supabase Auth e respeita as regras de seguranca do banco.
          </p>
        </div>
      ) : (
        <>
          <div style={{ display:"flex", gap:10, marginBottom:28, flexWrap:"wrap", justifyContent:"center", width:"100%" }}>
            {[["list","Produtos"],["add","Adicionar"],["password","Trocar senha"]].map(([tab,label]) => (
              <button key={tab} type="button" onClick={() => { setAdminTab(tab as AdminTab); if(tab==="list") setEditingProduct(null); }}
                style={{ padding:"11px 24px", borderRadius:50, background: adminTab===tab ? "linear-gradient(135deg,#f472b6,#ec4899)" : "#fff0f8", color: adminTab===tab ? "#fff" : "#be185d", fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:13, cursor:"pointer", border: adminTab===tab ? "none" : "2px solid #fad4e8", boxShadow: adminTab===tab ? "0 6px 20px rgba(236,72,153,0.35)" : "none", transition:"all 0.2s" }}>
                {label}
              </button>
            ))}
            {adminTab==="edit" && (
              <button type="button" style={{ padding:"11px 24px", borderRadius:50, border:"none", background:"linear-gradient(135deg,#fbbf24,#f59e0b)", color:"#fff", fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:13, cursor:"default" }}>
                Editando
              </button>
            )}
          </div>

          {adminTab==="list" && (
            <div style={{ display:"flex", flexDirection:"column", gap:14, width:"100%" }}>
              {products.length===0 && (
                <div style={{ textAlign:"center", padding:60, color:"#c06090" }}>
                  <p style={{ fontFamily:"'Pacifico',cursive", fontSize:18 }}>Nenhum produto ainda</p>
                </div>
              )}
              {savingProductOrder && (
                <div style={{ alignSelf:"center", fontFamily:"'Nunito',sans-serif", fontSize:12, fontWeight:900, color:"#be185d", background:"#fff0f8", border:"2px solid #fad4e8", borderRadius:999, padding:"8px 16px" }}>
                  Salvando ordem...
                </div>
              )}
              {products.map((product, index) => (
                <div
                  key={product.id}
                  className="admin-row"
                  draggable={!savingProductOrder}
                  onDragStart={event => {
                    setDraggedProductId(product.id);
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", product.id);
                  }}
                  onDragOver={event => {
                    event.preventDefault();
                    event.dataTransfer.dropEffect = "move";
                    setDragOverProductId(product.id);
                  }}
                  onDrop={event => {
                    event.preventDefault();
                    dropProduct(event.dataTransfer.getData("text/plain") || draggedProductId || "", product.id);
                  }}
                  onDragEnd={() => {
                    setDraggedProductId(null);
                    setDragOverProductId(null);
                  }}
                  style={{
                    background:"linear-gradient(135deg,#fff8fb,#fffde7)",
                    borderRadius:20,
                    padding:"16px 20px",
                    display:"flex",
                    gap:16,
                    alignItems:"center",
                    border:dragOverProductId === product.id && draggedProductId !== product.id ? "2.5px dashed #ec4899" : "2.5px solid #fad4e8",
                    boxShadow:draggedProductId === product.id ? "0 10px 28px rgba(236,72,153,0.22)" : "0 4px 16px rgba(212,86,138,0.08)",
                    opacity:draggedProductId === product.id ? 0.62 : 1,
                    transform:dragOverProductId === product.id && draggedProductId !== product.id ? "scale(1.01)" : "none",
                    transition:"border-color 0.2s, box-shadow 0.2s, transform 0.2s, opacity 0.2s",
                  }}
                >
                  <div title="Arrastar para reordenar" style={{ width:34, height:58, borderRadius:14, background:"#fff0f8", border:"2px solid #fad4e8", display:"flex", alignItems:"center", justifyContent:"center", color:"#be185d", fontFamily:"'Nunito',sans-serif", fontSize:18, fontWeight:900, flexShrink:0 }}>
                    =
                  </div>
                  <ProductImageCarousel product={product} variant="admin" />
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap", marginBottom:4 }}>
                      {product.emoji && <span style={{ fontSize:16 }}>{product.emoji}</span>}
                      <h3 style={{ fontFamily:"'Pacifico',cursive", fontSize:"clamp(14px,3vw,17px)", color:"#4a1040" }}>{product.name}</h3>
                      <span className={`badge ${product.isPreorder?"badge-yellow":product.stock>3?"badge-green":product.stock>0?"badge-yellow":"badge-red"}`}>{product.isPreorder?`Sob encomenda: ${product.preorderDays || 14} dias`:`Estoque: ${product.stock}`}</span>
                    </div>
                    <p style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, color:"#9a6080", marginBottom:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{product.description}</p>
                    <div style={{ display:"flex", gap:14, flexWrap:"wrap" }}>
                      <span style={{ fontFamily:"'Pacifico',cursive", fontSize:"clamp(14px,3vw,17px)", color:"#ec4899" }}>{formatPrice(product.price)}</span>
                      <span style={{ fontFamily:"'Nunito',sans-serif", fontSize:12, color:"#9a6080", alignSelf:"center" }}>{product.contact}</span>
                    </div>
                  </div>
                  <div className="admin-actions" style={{ display:"flex", gap:8, flexShrink:0, flexWrap:"wrap", justifyContent:"flex-end" }}>
                    <button className="btn-outline" type="button" title="Mover para cima" disabled={index === 0 || savingProductOrder} onClick={() => moveProductById(product.id, -1)} style={{ padding:"9px 13px", opacity:index === 0 || savingProductOrder ? 0.45 : 1 }}>Subir</button>
                    <button className="btn-outline" type="button" title="Mover para baixo" disabled={index === products.length - 1 || savingProductOrder} onClick={() => moveProductById(product.id, 1)} style={{ padding:"9px 13px", opacity:index === products.length - 1 || savingProductOrder ? 0.45 : 1 }}>Descer</button>
                    <button className="btn-edit" type="button" onClick={() => startEdit(product)}>Editar</button>
                    <button className="btn-danger" type="button" onClick={() => void handleDeleteProduct(product.id)}>Excluir</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {adminTab==="password" && (
            <div style={{ background:"linear-gradient(135deg,#fff0f8,#fffde7)", borderRadius:28, padding:"clamp(20px,4vw,36px)", border:"3px solid #fad4e8", boxShadow:"0 12px 40px rgba(212,86,138,0.12)", maxWidth:520, width:"100%" }}>
              <h2 style={{ fontFamily:"'Pacifico',cursive", fontSize:"clamp(18px,4vw,24px)", color:"#a0306a", marginBottom:18 }}>Trocar senha</h2>
              <div style={{ display:"grid", gap:14 }}>
                <div>
                  <label style={labelStyle}>Senha atual</label>
                  <input className="input-field" type="password" value={passwordForm.current} onChange={e => setPasswordForm(prev => ({ ...prev, current:e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Nova senha</label>
                  <input className="input-field" type="password" value={passwordForm.next} onChange={e => setPasswordForm(prev => ({ ...prev, next:e.target.value }))} />
                </div>
                <div>
                  <label style={labelStyle}>Confirmar nova senha</label>
                  <input className="input-field" type="password" value={passwordForm.confirm} onChange={e => setPasswordForm(prev => ({ ...prev, confirm:e.target.value }))} onKeyDown={e => e.key==="Enter" && !changingPassword && void handleChangePassword()} />
                </div>
                <button className="btn-primary" type="button" onClick={() => void handleChangePassword()} disabled={changingPassword} style={{ opacity:changingPassword ? 0.7 : 1, cursor:changingPassword ? "not-allowed" : "pointer" }}>
                  {changingPassword ? "Salvando..." : "Salvar nova senha"}
                </button>
              </div>
            </div>
          )}

          {adminTab==="add" && (
            <ProductForm title="Novo Produto" data={form} setData={setForm}
              onSubmit={handleAddProduct} onCancel={() => { resetForm(); setAdminTab("list"); }} submitLabel="Adicionar" isSubmitting={savingProduct} />
          )}
          {adminTab==="edit" && editingProduct && (
            <ProductForm title={`Editando: ${editingProduct.name}`} data={editingProduct} setData={updater => setEditingProduct(prev => {
                const currentData = prev || emptyProductForm;
                return typeof updater === "function" ? updater(currentData) : updater;
              })}
              onSubmit={handleEditProduct} onCancel={() => { setEditingProduct(null); setAdminTab("list"); }} submitLabel="Salvar alteracoes" isSubmitting={savingProduct} />
          )}
        </>
      )}
    </div>
  );
}
