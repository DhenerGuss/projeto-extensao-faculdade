import { useEffect, useRef, useState, type PointerEvent, type UIEvent } from "react";
import type { Product } from "@/types/product";
import { getProductCover, getSafeImages } from "@/utils/productMappers";

type ProductImageCarouselProps = {
  product: Product;
  variant?: "card" | "modal" | "admin";
};

export function ProductImageCarousel({ product, variant="modal" }: ProductImageCarouselProps) {
  const [activeImage, setActiveImage] = useState({ productId: product.id, index: 0 });
  const [isMobileSwipeEnabled, setIsMobileSwipeEnabled] = useState(false);
  const images = getSafeImages(product);
  const slides = images.length > 0 ? images : [getProductCover(product)];
  const hasMultipleImages = slides.length > 1;
  const imageHeight = variant === "modal" ? 360 : undefined;
  const trackRef = useRef<HTMLDivElement | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  const activeIndex = activeImage.productId === product.id ? activeImage.index : 0;
  const setActiveIndex = (index: number) => setActiveImage({ productId: product.id, index });

  useEffect(() => {
    if (variant !== "card" || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(max-width: 640px), (hover: none) and (pointer: coarse)");
    const updateMobileSwipe = () => setIsMobileSwipeEnabled(mediaQuery.matches);
    updateMobileSwipe();
    mediaQuery.addEventListener("change", updateMobileSwipe);

    return () => mediaQuery.removeEventListener("change", updateMobileSwipe);
  }, [variant]);

  const goToImage = (nextIndex: number) => {
    const normalizedIndex = (nextIndex + slides.length) % slides.length;
    setActiveIndex(normalizedIndex);
    trackRef.current?.scrollTo({ left: normalizedIndex * trackRef.current.clientWidth, behavior: "smooth" });
  };

  const handleTrackScroll = (event: UIEvent<HTMLDivElement>) => {
    const width = event.currentTarget.clientWidth || 1;
    setActiveIndex(Math.round(event.currentTarget.scrollLeft / width));
  };

  const stopCardPointerStart = (event: PointerEvent<HTMLDivElement>) => {
    if (variant !== "card" || !hasMultipleImages) return;
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
  };

  const stopCardPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (variant !== "card" || !pointerStartRef.current) return;

    const deltaX = Math.abs(event.clientX - pointerStartRef.current.x);
    const deltaY = Math.abs(event.clientY - pointerStartRef.current.y);
    if (deltaX > 10 && deltaX > deltaY) event.stopPropagation();
  };

  const handleCardPointerEnd = (event: PointerEvent<HTMLDivElement>) => {
    if (variant === "card" && pointerStartRef.current) {
      const deltaX = Math.abs(event.clientX - pointerStartRef.current.x);
      const deltaY = Math.abs(event.clientY - pointerStartRef.current.y);
      if (deltaX > 10 && deltaX > deltaY) event.stopPropagation();
    }

    pointerStartRef.current = null;
  };

  if (variant === "card") {
    if (!isMobileSwipeEnabled) {
      return (
        <div style={{ position:"relative" }}>
          <img
            src={getProductCover(product)}
            alt={product.name}
            onError={event => { event.currentTarget.src=`https://placehold.co/400x400/fce7f3/ec4899?text=${encodeURIComponent(product.emoji||"🧸")}`; }}
            style={{ width:"100%", aspectRatio:"1/1", objectFit:product.imageFit||"cover", objectPosition:product.imagePosition||"center center", background:"#fff", display:"block" }}
          />
          {hasMultipleImages && <span style={{ position:"absolute", bottom:10, right:10, background:"rgba(255,255,255,0.95)", color:"#be185d", borderRadius:50, padding:"5px 10px", fontFamily:"'Nunito',sans-serif", fontSize:11, fontWeight:900, boxShadow:"0 4px 12px rgba(0,0,0,0.12)", pointerEvents:"none" }}>📷 {slides.length}</span>}
        </div>
      );
    }

    return (
      <div
        data-product-images="true"
        style={{ position:"relative", touchAction:"pan-y" }}
        onPointerDown={stopCardPointerStart}
        onPointerMove={stopCardPointerMove}
        onPointerUp={handleCardPointerEnd}
        onPointerCancel={() => { pointerStartRef.current = null; }}
      >
        <div
          ref={trackRef}
          className="carousel-track"
          onScroll={handleTrackScroll}
          style={{ display:"flex", overflowX:hasMultipleImages ? "auto" : "hidden", scrollSnapType:"x mandatory", scrollBehavior:"smooth" }}
        >
          {slides.map((image, index) => (
            <div key={`${image}-${index}`} style={{ minWidth:"100%", scrollSnapAlign:"center" }}>
              <img
                src={image}
                alt={`${product.name} - foto ${index + 1}`}
                onError={event => { event.currentTarget.src=`https://placehold.co/400x400/fce7f3/ec4899?text=${encodeURIComponent(product.emoji||"🧸")}`; }}
                style={{ width:"100%", aspectRatio:"1/1", objectFit:product.imageFit||"cover", objectPosition:product.imagePosition||"center center", background:"#fff", display:"block" }}
              />
            </div>
          ))}
        </div>
        {hasMultipleImages && (
          <>
            <span style={{ position:"absolute", bottom:10, right:10, background:"rgba(255,255,255,0.95)", color:"#be185d", borderRadius:50, padding:"5px 10px", fontFamily:"'Nunito',sans-serif", fontSize:11, fontWeight:900, boxShadow:"0 4px 12px rgba(0,0,0,0.12)", pointerEvents:"none" }}>📷 {slides.length}</span>
            <div style={{ position:"absolute", left:0, right:0, bottom:10, display:"flex", justifyContent:"center", gap:5, pointerEvents:"none" }}>
              {slides.map((_, index) => (
                <span key={index} style={{ width:index===activeIndex?16:7, height:7, borderRadius:50, background:index===activeIndex?"#ec4899":"#f9a8d4", transition:"all 0.2s" }} />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  if (variant === "admin") {
    return (
      <div style={{ position:"relative", width:78, height:78, flexShrink:0 }}>
        <img
          src={getProductCover(product)}
          alt={product.name}
          onError={event => { event.currentTarget.src=`https://placehold.co/80x80/fce7f3/ec4899?text=${encodeURIComponent(product.emoji||"🧸")}`; }}
          style={{ width:78, height:78, borderRadius:16, objectFit:product.imageFit||"cover", objectPosition:product.imagePosition||"center center", border:"2px solid #fad4e8", background:"#fff" }}
        />
        {hasMultipleImages && <span style={{ position:"absolute", right:-6, bottom:-6, background:"#ec4899", color:"#fff", fontSize:10, fontWeight:900, borderRadius:50, padding:"3px 7px", border:"2px solid #fff", fontFamily:"'Nunito',sans-serif" }}>{slides.length}</span>}
      </div>
    );
  }

  return (
    <div data-product-images="true" className="product-carousel" style={{ position:"relative", borderRadius:20, overflow:"hidden", border:"2px solid #fad4e8", background:"#fff" }}>
      <div ref={trackRef} className="carousel-track" onScroll={handleTrackScroll} style={{ display:"flex", overflowX:"auto", scrollSnapType:"x mandatory", scrollBehavior:"smooth" }}>
        {slides.map((image, index) => (
          <div key={`${image}-${index}`} style={{ minWidth:"100%", scrollSnapAlign:"center" }}>
            <img
              src={image}
              alt={`${product.name} - foto ${index + 1}`}
              onError={event => { event.currentTarget.src=`https://placehold.co/400x400/fce7f3/ec4899?text=${encodeURIComponent(product.emoji||"🧸")}`; }}
              style={{ width:"100%", height:imageHeight, maxHeight:360, objectFit:"contain", objectPosition:product.imagePosition||"center center", background:"#fff", display:"block" }}
            />
          </div>
        ))}
      </div>
      {hasMultipleImages && (
        <>
          <button type="button" className="carousel-arrow carousel-arrow-left" onClick={() => goToImage(activeIndex - 1)} aria-label="Foto anterior">‹</button>
          <button type="button" className="carousel-arrow carousel-arrow-right" onClick={() => goToImage(activeIndex + 1)} aria-label="Próxima foto">›</button>
          <div style={{ position:"absolute", left:0, right:0, bottom:10, display:"flex", justifyContent:"center", gap:6 }}>
            {slides.map((_, index) => (
              <button key={index} type="button" onClick={() => goToImage(index)} aria-label={`Ir para foto ${index + 1}`} style={{ width:index===activeIndex?18:8, height:8, borderRadius:50, border:"none", background:index===activeIndex?"#ec4899":"#f9a8d4", cursor:"pointer", transition:"all 0.2s" }} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
