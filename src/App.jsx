import React, { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Login from "./Login.jsx";
import StudentTracker from "./StudentTracker.jsx";

export default function App() {
  const [session, setSession] = useState(undefined); // undefined = still checking

  useEffect(() => {
    // Check if already signed in (session is remembered between visits).
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    // React to sign-in / sign-out.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  if (session === undefined) {
    return (
      <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center",
        background: "#DAF1DE", color: "#051F20", fontFamily: '"Barlow", system-ui, sans-serif' }}>
        Loading…
      </div>
    );
  }
  if (!session) return <Login />;
  return <StudentTracker session={session} />;
}
