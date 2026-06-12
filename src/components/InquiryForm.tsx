"use client";

import { useState } from "react";
import { submitInquiry } from "@/app/actions/inquiries";

interface InquiryFormProps {
  safariSlug: string;
  safariTitle: string;
}

export default function InquiryForm({ safariSlug, safariTitle }: InquiryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    try {
      await submitInquiry(formData);
      setSubmitted(true);
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
      alert("Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-2xl text-safari-green mb-2">Inquiry Received</h3>
        <p className="font-sans text-gray-700">
          We&apos;ll get back to you shortly about {safariTitle}.
        </p>
      </div>
    );
  }

  return (
    <form action={handleSubmit} className="bg-white/50 backdrop-blur-md border border-white/20 rounded-2xl p-8">
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block font-sans text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-safari-green focus:border-transparent transition-all"
              placeholder="First name"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block font-sans text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-safari-green focus:border-transparent transition-all"
              placeholder="Last name"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block font-sans text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-safari-green focus:border-transparent transition-all"
            placeholder="your@email.com"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="phone" className="block font-sans text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-safari-green focus:border-transparent transition-all"
              placeholder="+250 7XX XXX XXX"
            />
          </div>
          <div>
            <label htmlFor="groupSize" className="block font-sans text-sm font-medium text-gray-700 mb-2">
              Group Size
            </label>
            <input
              type="number"
              id="groupSize"
              name="groupSize"
              required
              min="1"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-safari-green focus:border-transparent transition-all"
              placeholder="Number of travelers"
            />
          </div>
        </div>
        <div>
          <label htmlFor="message" className="block font-sans text-sm font-medium text-gray-700 mb-2">
            Your Message
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-safari-green focus:border-transparent transition-all resize-none"
            placeholder="Tell us about your travel plans, group size, and any special requests..."
          />
        </div>
        <input type="hidden" name="safariSlug" value={safariSlug} />
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-safari-green text-white py-4 rounded-lg font-sans font-medium hover:bg-safari-green/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Send Inquiry"}
        </button>
      </div>
    </form>
  );
}
