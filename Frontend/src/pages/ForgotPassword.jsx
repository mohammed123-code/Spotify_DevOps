import React, { useState } from "react";
import { Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { assets } from "../assets/assets";

// ── EmailJS config — fill these after setting up EmailJS ──
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || "";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "";
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || "";

const ForgotPassword = () => {
  const { backendUrl } = useAuth();

  // Step 1: enter email  →  Step 2: enter OTP  →  Step 3: new password
  const [step, setStep]           = useState(1);
  const [email, setEmail]         = useState("");
  const [otp, setOtp]             = useState("");
  const [enteredOtp, setEnteredOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading]     = useState(false);
  const [message, setMessage]     = useState({ text: "", type: "" });

  // ── Step 1: Send OTP via EmailJS ─────────────────────────────────────────
  const sendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    // Check email exists in backend
    try {
      await axios.post(`${backendUrl}/api/auth/check-email`, { email });
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Email not found", type: "error" });
      setLoading(false);
      return;
    }

    // Generate 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setOtp(generatedOtp);

    try {
      // Initialize EmailJS (required before send)
      emailjs.init(EMAILJS_PUBLIC_KEY);

      // Calculate expiry time (15 min from now)
      const expiry = new Date(Date.now() + 15 * 60 * 1000);
      const timeStr = expiry.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          email:    email,
          to_name:  email.split("@")[0],
          passcode: generatedOtp,
          time:     timeStr,
        },
        EMAILJS_PUBLIC_KEY
      );
      setMessage({ text: `OTP sent to ${email}! Check your inbox.`, type: "success" });
      setStep(2);
    } catch (err) {
      console.error("EmailJS error:", err);
      const errText = err?.text || err?.message || JSON.stringify(err);
      setMessage({ text: `Email send failed: ${errText}`, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ── Step 2: Verify OTP ────────────────────────────────────────────────────
  const verifyOtp = (e) => {
    e.preventDefault();
    if (enteredOtp === otp) {
      setMessage({ text: "", type: "" });
      setStep(3);
    } else {
      setMessage({ text: "Incorrect OTP. Please try again.", type: "error" });
    }
  };

  // ── Step 3: Reset Password ────────────────────────────────────────────────
  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPass) { setMessage({ text: "Passwords don't match", type: "error" }); return; }
    if (newPassword.length < 6)     { setMessage({ text: "Password must be at least 6 characters", type: "error" }); return; }

    setLoading(true);
    try {
      await axios.post(`${backendUrl}/api/auth/reset-password`, { email, newPassword });
      setMessage({ text: "Password reset successfully! You can now log in.", type: "success" });
      setStep(4);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Reset failed", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    width: "100%", background: "#3e3e3e", border: "1px solid #535353",
    borderRadius: "6px", padding: "14px", color: "#fff",
    fontSize: "15px", outline: "none", boxSizing: "border-box",
  };
  const btnStyle = (disabled) => ({
    width: "100%", padding: "16px",
    background: disabled ? "#158a3e" : "#1DB954",
    color: "#000", border: "none", borderRadius: "50px",
    fontSize: "16px", fontWeight: "700",
    cursor: disabled ? "not-allowed" : "pointer",
    marginTop: "8px", transition: "all 0.2s",
  });

  return (
    <div style={{
      minHeight: "100vh", background: "#121212",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Circular', Arial, sans-serif", padding: "20px",
    }}>
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <img src={assets.spotify_logo} alt="Spotify" style={{ width: "50px", marginBottom: "10px" }} />
        <h1 style={{ color: "#fff", fontSize: "26px", fontWeight: "700", margin: 0 }}>
          {step === 1 && "Reset your password"}
          {step === 2 && "Enter the OTP"}
          {step === 3 && "Create new password"}
          {step === 4 && "Password reset!"}
        </h1>
        <p style={{ color: "#b3b3b3", fontSize: "14px", marginTop: "6px" }}>
          {step === 1 && "We'll send a 6-digit code to your email"}
          {step === 2 && `We sent a code to ${email}`}
          {step === 3 && "Enter your new password below"}
          {step === 4 && "You can now sign in with your new password"}
        </p>
      </div>

      <div style={{
        background: "#282828", borderRadius: "12px",
        padding: "40px", width: "100%", maxWidth: "420px",
      }}>
        {/* Step indicator */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              flex: 1, height: "4px", borderRadius: "2px",
              background: step > s ? "#1DB954" : step === s ? "#1DB954" : "#535353",
              opacity: step >= s ? 1 : 0.4,
            }} />
          ))}
        </div>

        {message.text && (
          <div style={{
            background: message.type === "success" ? "#1a3a1a" : "#3d1a1a",
            border: `1px solid ${message.type === "success" ? "#1DB954" : "#e53e3e"}`,
            color: message.type === "success" ? "#1DB954" : "#fc8181",
            padding: "12px 16px", borderRadius: "8px",
            marginBottom: "20px", fontSize: "14px",
          }}>
            {message.type === "success" ? "✅" : "❌"} {message.text}
          </div>
        )}

        {/* Step 1 — Email */}
        {step === 1 && (
          <form onSubmit={sendOtp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", color: "#fff", fontWeight: "600", fontSize: "14px", marginBottom: "8px" }}>
                Email address
              </label>
              <input type="email" value={email} required onChange={e => setEmail(e.target.value)}
                placeholder="name@domain.com" style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#1DB954"}
                onBlur={e => e.target.style.borderColor = "#535353"}
              />
            </div>
            <button type="submit" disabled={loading} style={btnStyle(loading)}>
              {loading ? "Sending OTP..." : "Send OTP to Email"}
            </button>
          </form>
        )}

        {/* Step 2 — OTP */}
        {step === 2 && (
          <form onSubmit={verifyOtp} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", color: "#fff", fontWeight: "600", fontSize: "14px", marginBottom: "8px" }}>
                6-digit OTP
              </label>
              <input
                type="text" value={enteredOtp} required maxLength={6}
                onChange={e => setEnteredOtp(e.target.value.replace(/\D/, ""))}
                placeholder="Enter 6-digit code"
                style={{ ...inputStyle, fontSize: "22px", letterSpacing: "0.4em", textAlign: "center" }}
              />
            </div>
            <button type="submit" style={btnStyle(false)}>Verify OTP</button>
            <button type="button" onClick={() => setStep(1)} style={{
              background: "none", border: "none", color: "#b3b3b3",
              cursor: "pointer", fontSize: "14px", marginTop: "-8px",
            }}>← Back to email</button>
          </form>
        )}

        {/* Step 3 — New Password */}
        {step === 3 && (
          <form onSubmit={resetPassword} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={{ display: "block", color: "#fff", fontWeight: "600", fontSize: "14px", marginBottom: "8px" }}>
                New password
              </label>
              <input type="password" value={newPassword} required
                onChange={e => setNewPassword(e.target.value)} placeholder="At least 6 characters"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = "#1DB954"}
                onBlur={e => e.target.style.borderColor = "#535353"}
              />
            </div>
            <div>
              <label style={{ display: "block", color: "#fff", fontWeight: "600", fontSize: "14px", marginBottom: "8px" }}>
                Confirm new password
              </label>
              <input type="password" value={confirmPass} required
                onChange={e => setConfirmPass(e.target.value)} placeholder="Repeat new password"
                style={{ ...inputStyle, borderColor: confirmPass && confirmPass !== newPassword ? "#e53e3e" : "#535353" }}
              />
            </div>
            <button type="submit" disabled={loading} style={btnStyle(loading)}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}

        {/* Step 4 — Done */}
        {step === 4 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "60px", marginBottom: "16px" }}>🎉</div>
            <Link to="/login" style={{
              display: "block", padding: "16px",
              background: "#1DB954", color: "#000",
              borderRadius: "50px", fontWeight: "700",
              fontSize: "16px", textDecoration: "none", textAlign: "center",
            }}>
              Go to Login
            </Link>
          </div>
        )}

        {step !== 4 && (
          <p style={{ textAlign: "center", color: "#b3b3b3", fontSize: "14px", marginTop: "24px" }}>
            Remember your password?{" "}
            <Link to="/login" style={{ color: "#fff", fontWeight: "700", textDecoration: "underline" }}>
              Log in
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
