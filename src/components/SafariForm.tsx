"use client";

import { useState } from "react";
import { createSafari, updateSafari } from "@/app/actions/safaris";
import ImageUpload from "@/components/ImageUpload";

interface SafariFormProps {
  safari?: {
    id: string;
    title: string;
    slug: string;
    description: string;
    duration: number;
    price: number;
    imageUrl: string;
    featured: boolean;
    itineraries: Array<{
      day: number;
      title: string;
      content: string;
      imageUrl?: string | null;
    }>;
  };
}

export default function SafariForm({ safari }: SafariFormProps) {
  const [duration, setDuration] = useState(safari?.duration || 3);
  const [mainImage, setMainImage] = useState(safari?.imageUrl || "");
  const [uploadingCount, setUploadingCount] = useState(0);
  const isEdit = !!safari;

  const handleUploadingChange = (uploading: boolean) =>
    setUploadingCount((c) => Math.max(0, c + (uploading ? 1 : -1)));

  const canSubmit = !!mainImage && uploadingCount === 0;

  const inputClass =
    "w-full px-4 py-3 rounded-lg border border-golden-mid/30 bg-cream focus:ring-2 focus:ring-golden-mid focus:border-transparent transition-all text-charcoal";
  const labelClass = "block font-sans text-sm font-medium text-charcoal/80 mb-2";

  return (
    <form
      action={isEdit ? updateSafari : createSafari}
      className="bg-cream/80 backdrop-blur-md border border-golden-mid/30 rounded-2xl p-8 max-w-4xl shadow-gold"
    >
      {isEdit && <input type="hidden" name="id" value={safari.id} />}

      <div className="space-y-6">
        <div>
          <label htmlFor="title" className={labelClass}>
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            defaultValue={safari?.title}
            className={inputClass}
            placeholder="Mountain Gorilla Trekking"
          />
        </div>

        <div>
          <label htmlFor="slug" className={labelClass}>
            Slug (URL-friendly)
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            required
            defaultValue={safari?.slug}
            className={inputClass}
            placeholder="mountain-gorilla-trekking"
          />
          <p className="text-xs text-charcoal/50 mt-1">Use lowercase, hyphens instead of spaces</p>
        </div>

        <div>
          <label htmlFor="description" className={labelClass}>
            Description
          </label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            defaultValue={safari?.description}
            className={`${inputClass} resize-none`}
            placeholder="Describe the safari experience..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="duration" className={labelClass}>
              Duration (days)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              required
              min="1"
              max="30"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value) || 1)}
              className={inputClass}
              placeholder="3"
            />
          </div>
          <div>
            <label htmlFor="price" className={labelClass}>
              Price (USD)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              required
              min="0"
              step="0.01"
              defaultValue={safari?.price}
              className={inputClass}
              placeholder="3000"
            />
          </div>
        </div>

        <ImageUpload
          name="imageUrl"
          label="Main Safari Photo"
          required
          defaultValue={safari?.imageUrl}
          onChange={setMainImage}
          onUploadingChange={handleUploadingChange}
        />

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="featured"
            name="featured"
            defaultChecked={safari?.featured}
            className="w-5 h-5 rounded border-golden-mid/40 text-golden-dark focus:ring-golden-mid"
          />
          <label htmlFor="featured" className="font-sans text-sm text-charcoal/80">
            Featured Safari
          </label>
        </div>

        <div className="border-t border-golden-mid/30 pt-6">
          <h2 className="font-serif text-2xl text-safari-green mb-1">Daily Itinerary</h2>
          <p className="text-sm text-charcoal/60 mb-4">
            Add a title, description and an optional photo for each day of the safari
          </p>

          {Array.from({ length: duration }, (_, i) => i + 1).map((day) => {
            const existingItinerary = safari?.itineraries.find((it) => it.day === day);
            return (
              <div
                key={day}
                className="mb-6 p-5 bg-golden-light/10 rounded-xl border border-golden-mid/20"
              >
                <h3 className="font-serif text-xl mb-4 text-golden-dark flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-golden-gradient text-charcoal text-sm font-bold">
                    {day}
                  </span>
                  Day {day}
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label htmlFor={`day${day}_title`} className={labelClass}>
                        Day Title
                      </label>
                      <input
                        type="text"
                        id={`day${day}_title`}
                        name={`day${day}_title`}
                        required
                        defaultValue={existingItinerary?.title}
                        className={inputClass}
                        placeholder="Arrival at Lodge"
                      />
                    </div>

                    <div>
                      <label htmlFor={`day${day}_content`} className={labelClass}>
                        Activities Description
                      </label>
                      <textarea
                        id={`day${day}_content`}
                        name={`day${day}_content`}
                        required
                        rows={4}
                        defaultValue={existingItinerary?.content}
                        className={`${inputClass} resize-none`}
                        placeholder="Transfer to lodge, check-in, dinner..."
                      />
                    </div>
                  </div>

                  <ImageUpload
                    name={`day${day}_imageUrl`}
                    label="Day Photo (optional)"
                    defaultValue={existingItinerary?.imageUrl || ""}
                    aspect="aspect-[4/3]"
                    onUploadingChange={handleUploadingChange}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {!mainImage && (
          <p className="text-sm text-golden-dark">
            Please upload a <strong>Main Safari Photo</strong> before saving.
          </p>
        )}
        {uploadingCount > 0 && (
          <p className="text-sm text-charcoal/60">Waiting for photo upload to finish...</p>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex-1 bg-golden-gradient text-charcoal py-3 rounded-lg font-sans font-semibold hover:shadow-gold hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
          >
            {isEdit ? "Update Safari" : "Create Safari"}
          </button>
          <a
            href="/admin/safaris"
            className="flex-1 bg-charcoal/10 text-charcoal py-3 rounded-lg font-sans font-medium hover:bg-charcoal/20 transition-all duration-300 text-center"
          >
            Cancel
          </a>
        </div>
      </div>
    </form>
  );
}
