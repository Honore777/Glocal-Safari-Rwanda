"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { uploadImage } from "@/app/actions/upload";
import { UploadCloud, Loader2, X, ImageIcon } from "lucide-react";

interface ImageUploadProps {
  name: string;
  defaultValue?: string;
  label?: string;
  required?: boolean;
  aspect?: string;
  onChange?: (url: string) => void;
  onUploadingChange?: (uploading: boolean) => void;
}

export default function ImageUpload({
  name,
  defaultValue = "",
  label,
  required = false,
  aspect = "aspect-video",
  onChange,
  onUploadingChange,
}: ImageUploadProps) {
  const [url, setUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function updateUrl(next: string) {
    setUrl(next);
    onChange?.(next);
  }

  function setUploadingState(next: boolean) {
    setUploading(next);
    onUploadingChange?.(next);
  }

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploadingState(true);
    setError("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await uploadImage(fd);
    if ("url" in res) {
      updateUrl(res.url);
    } else {
      setError(res.error);
    }
    setUploadingState(false);
  }

  return (
    <div>
      {label && (
        <label className="block font-sans text-sm font-medium text-charcoal/80 mb-2">
          {label} {required && <span className="text-golden-dark">*</span>}
        </label>
      )}

      {/* Hidden field that actually submits with the form */}
      <input type="hidden" name={name} value={url} required={required} />

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`relative ${aspect} w-full cursor-pointer rounded-xl border-2 border-dashed border-golden-mid/40 bg-golden-light/10 hover:bg-golden-light/20 transition-all overflow-hidden group`}
      >
        {url ? (
          <>
            <Image src={url} alt="Preview" fill className="object-cover" />
            <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-all flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 text-cream font-sans text-sm flex items-center gap-2 transition-opacity">
                <UploadCloud className="w-5 h-5" />
                Replace photo
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                updateUrl("");
              }}
              className="absolute top-2 right-2 bg-charcoal/80 text-cream rounded-full p-1.5 hover:bg-red-600 transition-colors z-10"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-golden-dark gap-2 px-4 text-center">
            {uploading ? (
              <>
                <Loader2 className="w-8 h-8 animate-spin" />
                <span className="font-sans text-sm">Uploading...</span>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-golden-gradient flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-charcoal" />
                </div>
                <span className="font-sans text-sm font-medium">
                  Click or drag a photo here
                </span>
                <span className="font-sans text-xs text-charcoal/50">
                  JPG, PNG, WEBP up to 8MB
                </span>
              </>
            )}
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
      </div>

      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </div>
  );
}
