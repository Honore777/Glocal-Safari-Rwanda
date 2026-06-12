"use client";

import { useRef, useState } from "react";
import { Bold, Heading2, Highlighter, Italic, List, Quote } from "lucide-react";

type BlogContentEditorProps = {
  defaultValue?: string;
};

export default function BlogContentEditor({ defaultValue = "" }: BlogContentEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [content, setContent] = useState(defaultValue);

  function wrapSelection(prefix: string, suffix = prefix) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end) || "your text";
    const nextContent = `${content.slice(0, start)}${prefix}${selected}${suffix}${content.slice(end)}`;

    setContent(nextContent);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    });
  }

  function prefixLine(prefix: string) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const lineStart = content.lastIndexOf("\n", start - 1) + 1;
    const nextContent = `${content.slice(0, lineStart)}${prefix}${content.slice(lineStart)}`;

    setContent(nextContent);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    });
  }

  return (
    <div>
      <label htmlFor="content" className="block font-sans text-sm font-medium text-charcoal/80 mb-2">
        Content
      </label>
      <div className="rounded-xl border border-golden-mid/30 bg-cream overflow-hidden">
        <div className="flex flex-wrap gap-2 border-b border-golden-mid/20 bg-golden-light/20 p-3">
          <button type="button" onClick={() => prefixLine("## ")} className="inline-flex items-center gap-2 rounded-lg bg-cream px-3 py-2 text-sm text-charcoal hover:bg-golden-light/40 transition-colors">
            <Heading2 className="w-4 h-4" /> Title
          </button>
          <button type="button" onClick={() => wrapSelection("**")} className="inline-flex items-center gap-2 rounded-lg bg-cream px-3 py-2 text-sm text-charcoal hover:bg-golden-light/40 transition-colors">
            <Bold className="w-4 h-4" /> Bold
          </button>
          <button type="button" onClick={() => wrapSelection("*")} className="inline-flex items-center gap-2 rounded-lg bg-cream px-3 py-2 text-sm text-charcoal hover:bg-golden-light/40 transition-colors">
            <Italic className="w-4 h-4" /> Italic
          </button>
          <button type="button" onClick={() => wrapSelection("==", "==")} className="inline-flex items-center gap-2 rounded-lg bg-cream px-3 py-2 text-sm text-charcoal hover:bg-golden-light/40 transition-colors">
            <Highlighter className="w-4 h-4" /> Keyword
          </button>
          <button type="button" onClick={() => prefixLine("- ")} className="inline-flex items-center gap-2 rounded-lg bg-cream px-3 py-2 text-sm text-charcoal hover:bg-golden-light/40 transition-colors">
            <List className="w-4 h-4" /> List
          </button>
          <button type="button" onClick={() => prefixLine("> ")} className="inline-flex items-center gap-2 rounded-lg bg-cream px-3 py-2 text-sm text-charcoal hover:bg-golden-light/40 transition-colors">
            <Quote className="w-4 h-4" /> Quote
          </button>
        </div>
        <textarea
          ref={textareaRef}
          id="content"
          name="content"
          required
          rows={14}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="w-full px-4 py-3 bg-cream text-charcoal focus:ring-2 focus:ring-golden-mid focus:border-transparent transition-all resize-y outline-none"
          placeholder="Write your blog content here. Use the toolbar to style titles, keywords, lists, quotes, bold and italic text."
        />
      </div>
      <p className="text-xs text-charcoal/50 mt-2">
        Tip: use Title for sections, Keyword to highlight important safari words, and Bold for emphasis.
      </p>
    </div>
  );
}
