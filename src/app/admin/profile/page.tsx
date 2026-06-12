"use client";

import { useState, useEffect } from "react";
import { User, Mail, Lock, Save } from "lucide-react";

export default function AdminProfilePage() {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch("/api/admin/profile");
        if (res.ok) {
          const data = await res.json();
          setEmail(data.email);
        }
      } catch {
        setMessage("Failed to load profile");
      } finally {
        setFetchLoading(false);
      }
    }
    fetchProfile();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (newPassword && newPassword !== confirmPassword) {
      setMessage("New passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword && newPassword.length < 8) {
      setMessage("New password must be at least 8 characters");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email !== undefined ? email : undefined,
          currentPassword: newPassword ? currentPassword : undefined,
          newPassword: newPassword || undefined,
        }),
      });

      if (res.ok) {
        setMessage("Profile updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const data = await res.json();
        setMessage(data.error || "Failed to update profile");
      }
    } catch {
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="font-sans text-charcoal">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-safari-green mb-2">Profile Settings</h1>
        <p className="font-sans text-charcoal/70">Update your admin account information</p>
      </div>

      <div className="bg-white/50 backdrop-blur-md border border-golden-mid/30 rounded-2xl p-8 shadow-gold-lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="flex items-center gap-2 font-sans text-sm font-medium text-charcoal mb-2">
              <Mail className="w-4 h-4" />
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-golden-mid/30 bg-cream text-charcoal outline-none focus:ring-2 focus:ring-safari-green/50 transition-all"
              placeholder="admin@example.com"
              required
            />
          </div>

          <div className="border-t border-golden-mid/20 pt-6">
            <h3 className="font-serif text-lg text-safari-green mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Change Password
            </h3>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block font-sans text-sm font-medium text-charcoal mb-2">
                  Current Password
                </label>
                <input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-golden-mid/30 bg-cream text-charcoal outline-none focus:ring-2 focus:ring-safari-green/50 transition-all"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block font-sans text-sm font-medium text-charcoal mb-2">
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-golden-mid/30 bg-cream text-charcoal outline-none focus:ring-2 focus:ring-safari-green/50 transition-all"
                  placeholder="Enter new password (min 8 characters)"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block font-sans text-sm font-medium text-charcoal mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-golden-mid/30 bg-cream text-charcoal outline-none focus:ring-2 focus:ring-safari-green/50 transition-all"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </div>

          {message && (
            <p className={`font-sans text-sm ${message.includes("success") ? "text-safari-green" : "text-red-600"}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 w-full bg-safari-green text-white font-sans font-semibold py-3 rounded-lg hover:bg-safari-green/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
