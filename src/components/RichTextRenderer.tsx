type RichTextRendererProps = {
  html: string;
  className?: string;
};

export default function RichTextRenderer({ html, className = "" }: RichTextRendererProps) {
  return (
    <div
      className={`rich-text-content font-sans text-charcoal/85 leading-8 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
