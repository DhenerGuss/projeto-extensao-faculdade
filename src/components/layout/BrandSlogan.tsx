type BrandSloganProps = {
  variant?: "header" | "footer";
};

export function BrandSlogan({ variant = "header" }: BrandSloganProps) {
  const isFooter = variant === "footer";

  return (
    <span
      style={{
        fontFamily:"'Nunito',sans-serif",
        fontSize:isFooter ? "clamp(13px,3vw,16px)" : "clamp(9px,2vw,11px)",
        color:isFooter ? "#fde8f4" : "#be185d",
        letterSpacing:isFooter ? 0.4 : 1,
        fontWeight:900,
        lineHeight:1.35,
        whiteSpace:"normal",
      }}
    >
      Aqui a <span style={{ color:"#f472b6" }}>gente</span> é{" "}
      <span style={{ color:isFooter ? "#fde8f4" : "#a0306a" }}>Neurodiver</span>
      <span style={{ color:"#f472b6" }}>Arte</span>
    </span>
  );
}
