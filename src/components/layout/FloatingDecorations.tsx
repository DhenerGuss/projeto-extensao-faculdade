type FloatingDecorationsProps = {
  items: string[];
};

export function FloatingDecorations({ items }: FloatingDecorationsProps) {
  return (
    <>
      {Array.from({ length: 6 }).map((_, i) => (
        <span key={i} className="float-deco" style={{ left: `${10 + i * 16}%`, bottom: `${-20 + i * 5}px`, animationDelay: `${i * 1.1}s`, animationDuration: `${5 + i * 0.8}s` }}>
          {items[i]}
        </span>
      ))}
    </>
  );
}
