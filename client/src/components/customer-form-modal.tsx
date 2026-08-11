import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/contexts/ThemeContext";

interface CustomerFormModalProps {
  onClose: () => void;
  onSubmit: (name: string, phone: string) => Promise<void>;
}

export default function CustomerFormModal({ onClose, onSubmit }: CustomerFormModalProps) {
  const { isDark } = useTheme();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e: { name?: string; phone?: string } = {};
    if (!name.trim()) e.name = "Name is required";
    if (!/^[0-9]{10}$/.test(phone)) e.phone = "Enter a valid 10-digit phone number";
    return e;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setSubmitting(true);
    try {
      await onSubmit(name.trim(), phone.trim());
    } finally {
      setSubmitting(false);
    }
  }

  const inputStyle = {
    background: isDark ? "#1a1a1a" : "#fff",
    border: "1.5px solid var(--bb-border)",
    color: "var(--bb-text)",
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.55)" }}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="relative w-full max-w-xs mx-4 rounded-2xl p-6 shadow-2xl"
        style={{ background: isDark ? "#111" : "#FDFAF4", border: "1.5px solid var(--bb-border)" }}
      >
        {/* Title */}
        <img
          src="/welcome-custom-logo.png"
          alt="Bung-le"
          className="mx-auto mb-3 h-16 w-40 object-contain"
        />
        <h2
          className="text-lg font-bold uppercase tracking-wider mb-1 text-center"
          style={{ color: "var(--bb-gold)", fontFamily: "'DM Sans', sans-serif" }}
        >
          Welcome!
        </h2>
        <p
          className="text-xs text-center mb-5"
          style={{ color: "var(--bb-text-dim)" }}
        >
          Please share your details before exploring the menu
        </p>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--bb-text-dim)" }}>
              Name <span style={{ color: "var(--bb-gold)" }}>*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: undefined })); }}
              placeholder="Your name"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={inputStyle}
              autoFocus
            />
            {errors.name && (
              <p className="text-xs" style={{ color: "#ef4444" }}>{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--bb-text-dim)" }}>
              Phone Number <span style={{ color: "var(--bb-gold)" }}>*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={e => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setErrors(prev => ({ ...prev, phone: undefined })); }}
              placeholder="10-digit mobile number"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={inputStyle}
            />
            {errors.phone && (
              <p className="text-xs" style={{ color: "#ef4444" }}>{errors.phone}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl font-bold uppercase tracking-wider text-sm transition-opacity disabled:opacity-60 mt-2"
            style={{ background: "var(--bb-gold)", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}
          >
            {submitting ? "Please wait…" : "Let's Go →"}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
