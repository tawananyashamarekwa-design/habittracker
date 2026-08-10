import React, { useState } from "react";
import { supabase } from "./supabaseClient";

const CSS = `
.login-stage{min-height:100vh;min-height:100dvh;display:grid;place-items:center;padding:24px;
  background:#DAF1DE;color:#051F20;font-family:"Barlow",system-ui,sans-serif;}
.login-card{width:min(380px,100%);border:1px solid #8EB69B;background:#DAF1DE;padding:28px;border-radius:7px;
  box-shadow:0 12px 32px color-mix(in srgb,#051F20 14%,transparent);}
.login-brand{font-family:"Barlow Condensed",system-ui,sans-serif;font-weight:600;font-size:26px;margin:0 0 4px;}
.login-sub{font-size:13px;color:color-mix(in srgb,#051F20 55%,transparent);margin:0 0 22px;}
.login-field{margin-bottom:14px;}
.login-field label{display:block;font-size:12px;margin-bottom:5px;color:color-mix(in srgb,#051F20 70%,transparent);}
.login-input{width:100%;min-height:40px;padding:8px 11px;font:inherit;font-size:14px;color:#051F20;
  background:#c7e6cd;border:1px solid color-mix(in srgb,#051F20 35%,transparent);border-radius:4px;box-sizing:border-box;}
.login-input:focus-visible{outline:2px solid #235347;outline-offset:0;border-color:#235347;}
.login-btn{width:100%;min-height:42px;margin-top:6px;cursor:pointer;
  font-family:"Barlow Condensed",system-ui,sans-serif;font-weight:600;font-size:15px;
  background:#235347;color:#DAF1DE;border:1px solid #235347;border-radius:4px;transition:background .18s ease;}
.login-btn:hover{background:#1c453a;} .login-btn:disabled{opacity:.5;cursor:not-allowed;}
.login-toggle{margin-top:16px;font-size:13px;text-align:center;color:color-mix(in srgb,#051F20 65%,transparent);}
.login-toggle button{background:none;border:none;color:#235347;cursor:pointer;font:inherit;font-weight:600;padding:0;text-decoration:underline;}
.login-msg{margin-top:14px;font-size:13px;padding:9px 11px;border-radius:4px;}
.login-msg.err{background:#f6d9d9;color:#7a1f1f;}
.login-msg.ok{background:#c7e6cd;color:#0B2B26;}
`;

export default function Login() {
  const [mode, setMode] = useState("signin"); // 'signin' | 'signup'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null); // { type: 'err'|'ok', text }

  const submit = async () => {
    setMsg(null);
    if (!email || !password) { setMsg({ type: "err", text: "Enter an email and password." }); return; }
    if (password.length < 6) { setMsg({ type: "err", text: "Password must be at least 6 characters." }); return; }
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // With email confirmation off, sign the user in right away.
        const { error: e2 } = await supabase.auth.signInWithPassword({ email, password });
        if (e2) { setMsg({ type: "ok", text: "Account created. You can now sign in." }); setMode("signin"); }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      // On success, the auth listener in App.jsx swaps to the tracker automatically.
    } catch (err) {
      setMsg({ type: "err", text: err.message || "Something went wrong." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-stage">
      <style>{CSS}</style>
      <div className="login-card">
        <h1 className="login-brand">StudyBoard</h1>
        <p className="login-sub">{mode === "signin" ? "Sign in to reach your tracker on any device." : "Create an account to sync across your devices."}</p>

        <div className="login-field">
          <label>Email</label>
          <input className="login-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="you@example.com" autoComplete="email" />
        </div>
        <div className="login-field">
          <label>Password</label>
          <input className="login-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="At least 6 characters"
            autoComplete={mode === "signup" ? "new-password" : "current-password"} />
        </div>

        <button className="login-btn" onClick={submit} disabled={busy}>
          {busy ? "Working…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>

        {msg && <div className={`login-msg ${msg.type}`}>{msg.text}</div>}

        <div className="login-toggle">
          {mode === "signin" ? (
            <>New here? <button onClick={() => { setMode("signup"); setMsg(null); }}>Create an account</button></>
          ) : (
            <>Already have an account? <button onClick={() => { setMode("signin"); setMsg(null); }}>Sign in</button></>
          )}
        </div>
      </div>
    </div>
  );
}
