export function ProseText({ text, className }: { text: string; className?: string }) {
  const paragraphs = text.split(/\n\n+/).filter(Boolean);
  return (
    <div className={className}>
      {paragraphs.map((p, i) => (
        <p key={i} className="mb-4 leading-relaxed text-muted-foreground last:mb-0">
          {p}
        </p>
      ))}
    </div>
  );
}
