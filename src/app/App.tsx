import { useCallback, useEffect, useState } from "react";
import "./styles.css";
import { Toast } from "@/components/feedback/Toast";
import { AppHeader } from "@/components/layout/AppHeader";
import { FloatingDecorations } from "@/components/layout/FloatingDecorations";
import { CookieBanner } from "@/components/privacy/CookieBanner";
import { PrivacyModal } from "@/components/privacy/PrivacyModal";
import { ADMIN_EMAIL, DECORATIONS, emptyProductForm, SUPABASE_PRODUCTS_TABLE } from "@/constants/app";
import { AdminPanel } from "@/features/admin/AdminPanel";
import { ProductModal } from "@/features/products/components/ProductModal";
import { StorePage } from "@/features/store/StorePage";
import { supabase } from "@/services/supabaseClient";
import type { AdminTab, Product, ProductFormData, ProductRow, ToastState, ToastType, ViewMode } from "@/types/product";
import { createProductPayload, getProductCover, getSafeImages, mapProductRow, ProductValidationError, sortProductsByDisplayOrder } from "@/utils/productMappers";

const isAdminAccessUrl = () => {
  if (typeof window === "undefined") return false;

  const url = new URL(window.location.href);
  return url.searchParams.get("admin") === "1" || url.hash === "#admin";
};

const getInitialView = (): ViewMode => (isAdminAccessUrl() ? "admin" : "store");

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object" && "message" in error) return String(error.message);
  return "";
};

const logSafeError = (context: string, error: unknown) => {
  if (import.meta.env.DEV) {
    console.error(context, error);
  }
};

const getAdminOperationErrorMessage = (error: unknown, fallback: string) =>
  error instanceof ProductValidationError ? error.message : fallback;

const isMissingOrderColumnError = (error: unknown) =>
  getErrorMessage(error).toLowerCase().includes("display_order");

const getNextDisplayOrder = (products: Product[]) =>
  products.reduce((maxOrder, product, index) => Math.max(maxOrder, product.displayOrder ?? index + 1), 0) + 1;

const checkCurrentUserIsAdmin = async () => {
  const { data, error } = await supabase.rpc("is_admin");

  if (error) {
    logSafeError("Erro ao verificar permissao de admin:", error);
    return false;
  }

  return data === true;
};

export default function Artipica() {
  const [view, setView] = useState<ViewMode>(getInitialView);
  const [products, setProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [savingProduct, setSavingProduct] = useState(false);
  const [savingProductOrder, setSavingProductOrder] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adminTab, setAdminTab] = useState<AdminTab>("list");
  const [editingProduct, setEditingProduct] = useState<ProductFormData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todas");
  const [adminEmail, setAdminEmail] = useState(ADMIN_EMAIL);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminAuthed, setAdminAuthed] = useState(false);
  const [adminSigningIn, setAdminSigningIn] = useState(false);
  const [adminError, setAdminError] = useState("");
  const [passwordForm, setPasswordForm] = useState({ current:"", next:"", confirm:"" });
  const [changingPassword, setChangingPassword] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cookieConsent, setCookieConsent] = useState<boolean | null>(() => {
    if (typeof window === "undefined") return null;
    const saved = localStorage.getItem("artipica_lgpd");
    return saved ? saved === "true" : null;
  });
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [form, setForm] = useState<ProductFormData>(emptyProductForm);

  const showToast = useCallback((msg: string, type: ToastType="success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  }, []);

  const syncAdminSession = useCallback(async (session: { user: { email?: string } } | null) => {
    setAdminEmail(session?.user.email || ADMIN_EMAIL);

    if (!session) {
      setAdminAuthed(false);
      return;
    }

    const isAdmin = await checkCurrentUserIsAdmin();
    setAdminAuthed(isAdmin);

    if (!isAdmin) {
      setAdminError("Essa conta existe, mas nao esta liberada como admin no Supabase.");
    }
  }, []);

  useEffect(() => {
    const syncAdminAccess = () => {
      if (isAdminAccessUrl()) setView("admin");
    };

    window.addEventListener("hashchange", syncAdminAccess);
    window.addEventListener("popstate", syncAdminAccess);

    return () => {
      window.removeEventListener("hashchange", syncAdminAccess);
      window.removeEventListener("popstate", syncAdminAccess);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadAdminSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!isMounted) return;

      await syncAdminSession(data.session);
    };

    void loadAdminSession();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      void syncAdminSession(session);
    });

    return () => {
      isMounted = false;
      data.subscription.unsubscribe();
    };
  }, [syncAdminSession]);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      let { data, error } = await supabase
        .from(SUPABASE_PRODUCTS_TABLE)
        .select("*")
        .order("display_order", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: false });

      if (error && isMissingOrderColumnError(error)) {
        const fallbackResult = await supabase
          .from(SUPABASE_PRODUCTS_TABLE)
          .select("*")
          .order("created_at", { ascending: false });

        data = fallbackResult.data;
        error = fallbackResult.error;
      }

      if (!isMounted) return;

      if (error) {
        logSafeError("Erro ao carregar produtos do Supabase:", error);
        setProducts([]);
        showToast("Nao foi possivel carregar os produtos.", "error");
      } else {
        setProducts(sortProductsByDisplayOrder((data || []).map(row => mapProductRow(row as ProductRow))));
      }

      setProductsLoading(false);
    };

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, [showToast]);

  const acceptCookies = () => { setCookieConsent(true); localStorage.setItem("artipica_lgpd","true"); };
  const declineCookies = () => { setCookieConsent(false); localStorage.setItem("artipica_lgpd","false"); };

  const categories = ["Todas", ...new Set(products.map(p => p.category))];
  const filteredProducts = products.filter(p => {
    const s = searchTerm.toLowerCase();
    return (p.name.toLowerCase().includes(s) || p.description.toLowerCase().includes(s)) && (filterCategory==="Todas" || p.category===filterCategory);
  });
  const selectedProductIndex = selectedProduct
    ? filteredProducts.findIndex(product => product.id === selectedProduct.id)
    : -1;
  const hasPreviousProduct = selectedProductIndex > 0;
  const hasNextProduct = selectedProductIndex >= 0 && selectedProductIndex < filteredProducts.length - 1;
  const selectAdjacentProduct = (direction: -1 | 1) => {
    if (selectedProductIndex < 0) return;

    const nextProduct = filteredProducts[selectedProductIndex + direction];
    if (nextProduct) setSelectedProduct(nextProduct);
  };

  const requireAdminSession = () => {
    if (adminAuthed) return true;

    showToast("Entre no admin antes de alterar produtos.", "error");
    setView("admin");
    return false;
  };

  const handleAdminLogin = async () => {
    const email = adminEmail.trim();

    if (!email) {
      setAdminError("Informe o e-mail do admin.");
      return;
    }

    try {
      setAdminSigningIn(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: adminPassword,
      });

      if (error) throw error;

      const isAdmin = await checkCurrentUserIsAdmin();

      if (!isAdmin) {
        await supabase.auth.signOut();
        setAdminAuthed(false);
        setAdminError("Essa conta existe, mas nao esta liberada como admin no Supabase.");
        return;
      }

      setAdminAuthed(true);
      setAdminEmail(email);
      setAdminError("");
      setAdminPassword("");
      showToast("Acesso administrativo liberado.");
    } catch (error) {
      logSafeError("Erro ao entrar no admin:", error);
      setAdminError("E-mail ou senha incorretos.");
    } finally {
      setAdminSigningIn(false);
    }
  };

  const handleChangePassword = async () => {
    const email = adminEmail.trim();

    if (!email) { showToast("Sessao administrativa sem e-mail.", "error"); return; }
    if (!passwordForm.current) { showToast("Informe a senha atual.", "error"); return; }
    if (!passwordForm.next || passwordForm.next.length < 6) { showToast("A nova senha precisa ter pelo menos 6 caracteres.", "error"); return; }
    if (passwordForm.next !== passwordForm.confirm) { showToast("A confirmacao da nova senha nao confere.", "error"); return; }

    try {
      setChangingPassword(true);
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: passwordForm.current,
      });

      if (signInError) throw signInError;

      const { error } = await supabase.auth.updateUser({ password: passwordForm.next });

      if (error) throw error;

      setPasswordForm({ current:"", next:"", confirm:"" });
      showToast("Senha alterada com sucesso.");
    } catch (error) {
      logSafeError("Erro ao trocar senha:", error);
      showToast("Nao foi possivel trocar a senha. Confira a senha atual.", "error");
    } finally {
      setChangingPassword(false);
    }
  };

  const resetForm = () => setForm(emptyProductForm);

  const handleAddProduct = async () => {
    if (!requireAdminSession()) return;
    if (!form.name || !form.price || (!form.isPreorder && form.stock === "") || !form.contact) { showToast("Preencha os campos obrigatorios.", "error"); return; }

    try {
      setSavingProduct(true);
      const displayOrder = getNextDisplayOrder(products);
      const { data, error } = await supabase
        .from(SUPABASE_PRODUCTS_TABLE)
        .insert({ ...createProductPayload(form), display_order: displayOrder })
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => sortProductsByDisplayOrder([...prev, mapProductRow(data as ProductRow)]));
      resetForm();
      setAdminTab("list");
      showToast("Produto adicionado e salvo no Supabase.");
    } catch (error) {
      logSafeError("Erro ao adicionar produto:", error);
      showToast(getAdminOperationErrorMessage(error, "Nao foi possivel salvar o produto."), "error");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleEditProduct = async () => {
    if (!requireAdminSession()) return;
    if (!editingProduct?.id) return;
    if (!editingProduct.name || !editingProduct.price || (!editingProduct.isPreorder && editingProduct.stock === "") || !editingProduct.contact) { showToast("Preencha os campos obrigatorios.", "error"); return; }

    try {
      setSavingProduct(true);
      const { data, error } = await supabase
        .from(SUPABASE_PRODUCTS_TABLE)
        .update(createProductPayload(editingProduct))
        .eq("id", editingProduct.id)
        .select()
        .single();

      if (error) throw error;

      setProducts(prev => sortProductsByDisplayOrder(prev.map(product => product.id === editingProduct.id ? mapProductRow(data as ProductRow) : product)));
      setAdminTab("list");
      setEditingProduct(null);
      showToast("Produto atualizado no Supabase.");
    } catch (error) {
      logSafeError("Erro ao editar produto:", error);
      showToast(getAdminOperationErrorMessage(error, "Nao foi possivel atualizar o produto."), "error");
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!requireAdminSession()) return;

    const canDelete = window.confirm("Tem certeza que deseja excluir este produto?");
    if (!canDelete) return;

    try {
      const { error } = await supabase
        .from(SUPABASE_PRODUCTS_TABLE)
        .delete()
        .eq("id", id);

      if (error) throw error;

      setProducts(prev => prev.filter(product => product.id !== id));
      showToast("Produto removido do Supabase.", "info");
    } catch (error) {
      logSafeError("Erro ao excluir produto:", error);
      showToast("Nao foi possivel excluir o produto.", "error");
    }
  };

  const startEdit = (product: Product) => {
    setEditingProduct({
      ...product,
      price:String(product.price),
      stock:String(product.stock),
      isPreorder:product.isPreorder,
      preorderDays:String(product.preorderDays || 14),
      images:getSafeImages(product),
      image:getProductCover(product),
    });
    setAdminTab("edit");
  };

  const handleReorderProducts = async (nextProducts: Product[]) => {
    if (!requireAdminSession()) return;

    const previousProducts = products;
    const orderedProducts = nextProducts.map((product, index) => ({
      ...product,
      displayOrder: index + 1,
    }));

    setProducts(orderedProducts);

    try {
      setSavingProductOrder(true);
      const { error } = await supabase.rpc("reorder_products", {
        product_ids: orderedProducts.map(product => product.id),
      });

      if (error) throw error;

      showToast("Ordem dos produtos salva.", "success");
    } catch (error) {
      logSafeError("Erro ao salvar ordem dos produtos:", error);
      setProducts(previousProducts);
      showToast(
        isMissingOrderColumnError(error)
          ? "Crie a coluna display_order no Supabase para salvar a ordem."
          : "Nao foi possivel salvar a ordem dos produtos.",
        "error",
      );
    } finally {
      setSavingProductOrder(false);
    }
  };

  const navTo = (nextView: ViewMode) => {
    setView(nextView);
    setSelectedProduct(null);
    setMobileMenuOpen(false);

    if (nextView === "store" && typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.delete("admin");
      if (url.hash === "#admin") url.hash = "";
      window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
    }
  };

  const handleAdminLogout = async () => {
    await supabase.auth.signOut();
    setAdminAuthed(false);
    setAdminPassword("");
    setAdminError("");
    setAdminTab("list");
    setEditingProduct(null);
    navTo("store");
    showToast("Sessao administrativa encerrada.", "info");
  };

  return (
    <div style={{ fontFamily:"'Nunito',sans-serif", minHeight:"100vh", background:"#fff8fb", color:"#4a1040" }}>
      <FloatingDecorations items={DECORATIONS} />

      {cookieConsent === null && <CookieBanner onAccept={acceptCookies} onDecline={declineCookies} />}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}
      <Toast toast={toast} />

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOpenPrivacy={() => setShowPrivacy(true)}
          onPreviousProduct={() => selectAdjacentProduct(-1)}
          onNextProduct={() => selectAdjacentProduct(1)}
          hasPreviousProduct={hasPreviousProduct}
          hasNextProduct={hasNextProduct}
        />
      )}

      <AppHeader
        view={view}
        adminAuthed={adminAuthed}
        mobileMenuOpen={mobileMenuOpen}
        navTo={navTo}
        onAdminLogout={handleAdminLogout}
        onOpenPrivacy={() => setShowPrivacy(true)}
        onToggleMobileMenu={() => setMobileMenuOpen(open => !open)}
        onCloseMobileMenu={() => setMobileMenuOpen(false)}
      />

      {view === "store" && (
        <StorePage
          productsLoading={productsLoading}
          filteredProducts={filteredProducts}
          categories={categories}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterCategory={filterCategory}
          setFilterCategory={setFilterCategory}
          setSelectedProduct={setSelectedProduct}
          setShowPrivacy={setShowPrivacy}
        />
      )}

      {view === "admin" && (
        <AdminPanel
          adminAuthed={adminAuthed}
          adminEmail={adminEmail}
          setAdminEmail={setAdminEmail}
          adminEmailConfigured={Boolean(ADMIN_EMAIL)}
          adminPassword={adminPassword}
          setAdminPassword={setAdminPassword}
          handleAdminLogin={handleAdminLogin}
          adminSigningIn={adminSigningIn}
          adminError={adminError}
          adminTab={adminTab}
          setAdminTab={setAdminTab}
          setEditingProduct={setEditingProduct}
          products={products}
          startEdit={startEdit}
          handleDeleteProduct={handleDeleteProduct}
          handleReorderProducts={handleReorderProducts}
          savingProductOrder={savingProductOrder}
          passwordForm={passwordForm}
          setPasswordForm={setPasswordForm}
          handleChangePassword={handleChangePassword}
          changingPassword={changingPassword}
          form={form}
          setForm={setForm}
          handleAddProduct={handleAddProduct}
          resetForm={resetForm}
          savingProduct={savingProduct}
          editingProduct={editingProduct}
          handleEditProduct={handleEditProduct}
        />
      )}
    </div>
  );
}
