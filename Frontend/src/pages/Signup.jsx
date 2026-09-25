import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { assets } from "../assets/assets";

const Signup = () => {
  const { login, backendUrl } = useAuth();
  const navigate = useNavigate();

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) { setError("Passwords do not match!"); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters"); return; }

    setLoading(true);
    try {
      const res = await axios.post(`${backendUrl}/api/auth/register`, { name, email, password });
      login(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#121212",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      fontFamily: "'Circular', Arial, sans-serif", padding: "20px",
    }}>
      {/* Logo */}
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <img src={assets.spotify_logo} alt="Spotify" style={{ width: "50px", marginBottom: "10px" }} />
        <h1 style={{ color: "#fff", fontSize: "28px", fontWeight: "700", margin: 0 }}>Sign up for free</h1>
        <p style={{ color: "#b3b3b3", fontSize: "14px", marginTop: "6px" }}>Create your Spotify Clone account</p>
      </div>

      {/* Card */}
      <div style={{
        background: "#282828", borderRadius: "12px",
        padding: "40px", width: "100%", maxWidth: "420px",
      }}>
        {error && (
          <div style={{
            background: "#3d1a1a", border: "1px solid #e53e3e",
            color: "#fc8181", padding: "12px 16px", borderRadius: "8px",
            marginBottom: "20px", fontSize: "14px",
          }}>
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Name */}
          <div>
            <label style={{ display: "block", color: "#fff", fontWeight: "600", fontSize: "14px", marginBottom: "8px" }}>
              What's your name?
            </label>
            <input
              type="text" value={name} required
              onChange={e => setName(e.target.value)}
              placeholder="Enter your name"
              style={{
                width: "100%", background: "#3e3e3e", border: "1px solid #535353",
                borderRadius: "6px", padding: "14px", color: "#fff",
                fontSize: "15px", outline: "none", boxSizing: "border-box",
              }}
              onFocus={e => e.target.style.borderColor = "#1DB954"}
              onBlur={e => e.target.style.borderColor = "#535353"}
            />
          </div>

          {/* Email */}
          <div>
            <label style={{ display: "block", color: "#fff", fontWeight: "600", fontSize: "14px", marginBottom: "8px" }}>
              Email address
            </label>
            <input
              type="email" value={email} required
              onChange={e => setEmail(e.target.value)}
              placeholder="name@domain.com"
              style={{
                width: "100%", background: "#3e3e3e", border: "1px solid #535353",
                borderRadius: "6px", padding: "14px", color: "#fff",
                fontSize: "15px", outline: "none", boxSizing: "border-box",
              }}
              onFocus={e => e.target.style.borderColor = "#1DB954"}
              onBlur={e => e.target.style.borderColor = "#535353"}
            />
          </div>

          {/* Password */}
          <div>
            <label style={{ display: "block", color: "#fff", fontWeight: "600", fontSize: "14px", marginBottom: "8px" }}>
              Create password
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"} value={password} required
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                style={{
                  width: "100%", background: "#3e3e3e", border: "1px solid #535353",
                  borderRadius: "6px", padding: "14px 48px 14px 14px",
                  color: "#fff", fontSize: "15px", outline: "none", boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = "#1DB954"}
                onBlur={e => e.target.style.borderColor = "#535353"}
              />
              <button type="button" onClick={() => setShowPass(!showPass)} style={{
                position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", color: "#b3b3b3", cursor: "pointer", fontSize: "14px",
              }}>
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>
            {/* Strength indicator */}
            {password && (
              <div style={{ marginTop: "8px", display: "flex", gap: "4px" }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    height: "3px", flex: 1, borderRadius: "2px",
                    background: password.length >= i * 3
                      ? (password.length >= 8 ? "#1DB954" : "#f6a623")
                      : "#535353",
                    transition: "background 0.3s",
                  }} />
                ))}
                <span style={{
                  fontSize: "11px", color: password.length >= 8 ? "#1DB954" : "#f6a623", marginLeft: "6px",
                }}>
                  {password.length >= 8 ? "Strong" : "Weak"}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label style={{ display: "block", color: "#fff", fontWeight: "600", fontSize: "14px", marginBottom: "8px" }}>
              Confirm password
            </label>
            <input
              type={showPass ? "text" : "password"} value={confirm} required
              onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              style={{
                width: "100%", background: "#3e3e3e",
                border: `1px solid ${confirm && confirm !== password ? "#e53e3e" : "#535353"}`,
                borderRadius: "6px", padding: "14px", color: "#fff",
                fontSize: "15px", outline: "none", boxSizing: "border-box",
              }}
              onFocus={e => e.target.style.borderColor = confirm !== password ? "#e53e3e" : "#1DB954"}
              onBlur={e => e.target.style.borderColor = confirm && confirm !== password ? "#e53e3e" : "#535353"}
            />
            {confirm && confirm !== password && (
              <p style={{ color: "#fc8181", fontSize: "12px", marginTop: "4px" }}>Passwords don't match</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            style={{
              width: "100%", padding: "16px",
              background: loading ? "#158a3e" : "#1DB954",
              color: "#000", border: "none", borderRadius: "50px",
              fontSize: "16px", fontWeight: "700",
              cursor: loading ? "not-allowed" : "pointer",
              marginTop: "8px", transition: "all 0.2s",
            }}
            onMouseEnter={e => { if (!loading) e.target.style.transform = "scale(1.02)"; }}
            onMouseLeave={e => { e.target.style.transform = "scale(1)"; }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", margin: "24px 0" }}>
          <div style={{ flex: 1, height: "1px", background: "#535353" }} />
          <span style={{ color: "#b3b3b3", fontSize: "13px" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "#535353" }} />
        </div>

        <p style={{ textAlign: "center", color: "#b3b3b3", fontSize: "14px" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#fff", fontWeight: "700", textDecoration: "underline" }}>
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
