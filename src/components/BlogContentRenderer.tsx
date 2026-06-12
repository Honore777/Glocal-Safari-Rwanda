function renderInline(text: string) {
  const parts = text.split(/(==[^=]+==|\*\*[^*]+\*\*|\*[^*]+\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("==") && part.endsWith("==")) {
      return (
        <mark key={index} className="rounded-md bg-sunset-glow/45 px-1.5 py-0.5 text-charcoal">
          {part.slice(2, -2)}
        </mark>
      );
    }

    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-safari-green">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (part.startsWith("*") && part.endsWith("*")) {
      return (
        <em key={index} className="text-golden-dark">
          {part.slice(1, -1)}
        </em>
      );
    }

    return part;
  });
}

export default function BlogContentRenderer({ content }: { content: string }) {
  const lines = content.split("\n");

  return (
    <div className="font-sans text-charcoal/85 leading-8 space-y-5">
      {lines.map((line, index) => {
        if (!line.trim()) return <div key={index} className="h-2" />;

        if (line.startsWith("## ")) {
          return (
            <h2 key={index} className="font-serif text-3xl text-safari-green pt-4">
              {renderInline(line.slice(3))}
            </h2>
          );
        }

        if (line.startsWith("# ")) {
          return (
            <h2 key={index} className="font-serif text-4xl text-safari-green pt-4">
              {renderInline(line.slice(2))}
            </h2>
          );
        }

        if (line.startsWith("- ")) {
          return (
            <p key={index} className="pl-5 relative before:absolute before:left-0 before:text-golden-dark before:content-['•']">
              {renderInline(line.slice(2))}
            </p>
          );
        }

        if (line.startsWith("> ")) {
          return (
            <blockquote key={index} className="border-l-4 border-golden-mid bg-golden-light/20 px-5 py-3 italic text-charcoal/75 rounded-r-xl">
              {renderInline(line.slice(2))}
            </blockquote>
          );
        }

        return <p key={index}>{renderInline(line)}</p>;
      })}
    </div>
  );
}
