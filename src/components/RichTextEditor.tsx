"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { Bold, Heading2, Highlighter, Italic, List, ListOrdered, Quote, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, Palette } from "lucide-react";
import { useState } from "react";

type RichTextEditorProps = {
  name: string;
  label: string;
  defaultValue?: string;
  required?: boolean;
  minHeight?: string;
};

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function convertLegacyContent(value: string) {
  if (!value) return "";
  if (value.trim().startsWith("<")) return value;

  return value
    .split(/\n{2,}/)
    .map((block) => {
      const trimmed = block.trim();
      const convertInline = (text: string) =>
        escapeHtml(text)
          .replace(/==(.+?)==/g, "<mark>$1</mark>")
          .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
          .replace(/\*(.+?)\*/g, "<em>$1</em>");

      if (trimmed.startsWith("## ")) return `<h2>${convertInline(trimmed.slice(3))}</h2>`;
      if (trimmed.startsWith("# ")) return `<h2>${convertInline(trimmed.slice(2))}</h2>`;
      if (trimmed.startsWith("> ")) return `<blockquote>${convertInline(trimmed.slice(2))}</blockquote>`;
      if (trimmed.split("\n").every((line) => line.trim().startsWith("- "))) {
        return `<ul>${trimmed
          .split("\n")
          .map((line) => `<li>${convertInline(line.trim().slice(2))}</li>`)
          .join("")}</ul>`;
      }
      return `<p>${convertInline(trimmed).replace(/\n/g, "<br />")}</p>`;
    })
    .join("");
}

export default function RichTextEditor({ name, label, defaultValue = "", required, minHeight = "min-h-[260px]" }: RichTextEditorProps) {
  const initialContent = convertLegacyContent(defaultValue);
  const [content, setContent] = useState(initialContent);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
    content: initialContent,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: `${minHeight} px-4 py-3 bg-cream text-charcoal outline-none font-sans leading-7`,
      },
    },
    onUpdate: ({ editor }) => setContent(editor.getHTML()),
  });

  function setLink() {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter the link URL", previousUrl || "https://");

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  const buttonClass = "inline-flex items-center gap-2 rounded-lg bg-cream px-3 py-2 text-sm text-charcoal hover:bg-golden-light/40 transition-colors";
  const activeClass = "bg-golden-mid/30 text-golden-deep";
  const colorButtonClass = "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white hover:opacity-90 transition-opacity";

  return (
    <div>
      <label className="block font-sans text-sm font-medium text-charcoal/80 mb-2">
        {label}
      </label>
      <input type="hidden" name={name} value={content} required={required} />
      <div className="rounded-xl border border-golden-mid/30 bg-cream overflow-hidden">
        <div className="flex flex-wrap gap-2 border-b border-golden-mid/20 bg-golden-light/20 p-3">
          <button type="button" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()} className={`${buttonClass} ${editor?.isActive("heading", { level: 2 }) ? activeClass : ""}`}>
            <Heading2 className="w-4 h-4" /> Title
          </button>
          <button type="button" onClick={() => editor?.chain().focus().toggleBold().run()} className={`${buttonClass} ${editor?.isActive("bold") ? activeClass : ""}`}>
            <Bold className="w-4 h-4" /> Bold
          </button>
          <button type="button" onClick={() => editor?.chain().focus().toggleItalic().run()} className={`${buttonClass} ${editor?.isActive("italic") ? activeClass : ""}`}>
            <Italic className="w-4 h-4" /> Italic
          </button>
          <button type="button" onClick={() => editor?.chain().focus().toggleHighlight().run()} className={`${buttonClass} ${editor?.isActive("highlight") ? activeClass : ""}`}>
            <Highlighter className="w-4 h-4" /> Highlight
          </button>
          <button type="button" onClick={() => editor?.chain().focus().setColor("#1F382B").run()} className={`${colorButtonClass} bg-safari-green`}>
            <Palette className="w-4 h-4" /> Green
          </button>
          <button type="button" onClick={() => editor?.chain().focus().setColor("#B8730F").run()} className={`${colorButtonClass} bg-golden-dark`}>
            Gold
          </button>
          <button type="button" onClick={() => editor?.chain().focus().setColor("#E8821E").run()} className={`${colorButtonClass} bg-sunset-orange`}>
            Orange
          </button>
          <button type="button" onClick={() => editor?.chain().focus().unsetColor().run()} className={buttonClass}>
            Auto Color
          </button>
          <button type="button" onClick={() => editor?.chain().focus().toggleBulletList().run()} className={`${buttonClass} ${editor?.isActive("bulletList") ? activeClass : ""}`}>
            <List className="w-4 h-4" /> List
          </button>
          <button type="button" onClick={() => editor?.chain().focus().toggleOrderedList().run()} className={`${buttonClass} ${editor?.isActive("orderedList") ? activeClass : ""}`}>
            <ListOrdered className="w-4 h-4" /> Numbers
          </button>
          <button type="button" onClick={() => editor?.chain().focus().toggleBlockquote().run()} className={`${buttonClass} ${editor?.isActive("blockquote") ? activeClass : ""}`}>
            <Quote className="w-4 h-4" /> Quote
          </button>
          <button type="button" onClick={setLink} className={`${buttonClass} ${editor?.isActive("link") ? activeClass : ""}`}>
            <LinkIcon className="w-4 h-4" /> Link
          </button>
          <button type="button" onClick={() => editor?.chain().focus().setTextAlign("left").run()} className={buttonClass}>
            <AlignLeft className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => editor?.chain().focus().setTextAlign("center").run()} className={buttonClass}>
            <AlignCenter className="w-4 h-4" />
          </button>
          <button type="button" onClick={() => editor?.chain().focus().setTextAlign("right").run()} className={buttonClass}>
            <AlignRight className="w-4 h-4" />
          </button>
        </div>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
