import { supabase } from "./supabaseClient";

/* ============================================================================
   Data layer — talks to Supabase so your data lives in the cloud and syncs
   across devices. Each function returns the fresh rows so the UI can update.

   Column name notes (a few app fields differ from SQL because some words are
   reserved in Postgres):
     transaction.desc  <-> column "descr"
     class.end         <-> column "end"    (quoted)
     budget.limit      <-> column "limit"   (quoted)
   Daily logs (habits ticked per date) are stored as JSON on the profile row.
   ========================================================================== */

// ---- load everything for the current user ---------------------------------
export async function loadAll() {
  const [
    assignments, timetable, transactions, savingsGoals, budgets, nonNeg, quotes, profile,
  ] = await Promise.all([
    supabase.from("assignments").select("*").order("id"),
    supabase.from("timetable").select("*").order("id"),
    supabase.from("transactions").select("*").order("id"),
    supabase.from("savings_goals").select("*").order("id"),
    supabase.from("budgets").select("*").order("id"),
    supabase.from("non_negotiables").select("*").order("id"),
    supabase.from("quotes").select("*").order("id"),
    supabase.from("profiles").select("*").maybeSingle(),
  ]);

  return {
    assignments: (assignments.data || []).map((a) => ({
      id: a.id, title: a.title, subject: a.subject, type: a.type,
      due: a.due, priority: a.priority, done: a.done,
    })),
    timetable: (timetable.data || []).map((c) => ({
      id: c.id, day: c.day, start: c.start, end: c.end, course: c.course, location: c.location,
    })),
    transactions: (transactions.data || []).map((t) => ({
      id: t.id, desc: t.descr, category: t.category, amount: Number(t.amount),
      type: t.type, date: t.date,
    })),
    savingsGoals: (savingsGoals.data || []).map((g) => ({
      id: g.id, name: g.name, target: Number(g.target), current: Number(g.current),
    })),
    budgets: (budgets.data || []).map((b) => ({ category: b.category, limit: Number(b.limit) })),
    nonNegotiables: (nonNeg.data || []).map((n) => ({ id: n.id, text: n.text })),
    quotes: (quotes.data || []).map((q) => ({ id: q.id, text: q.text, source: q.source })),
    unallocated: profile.data ? Number(profile.data.unallocated || 0) : 0,
    dailyQuoteId: profile.data ? profile.data.daily_quote_id : null,
    dailyLogs: profile.data && profile.data.data ? profile.data.data : {},
  };
}

// Make sure a profile row exists for this user (first login).
export async function ensureProfile(userId) {
  await supabase.from("profiles").upsert({ user_id: userId }, { onConflict: "user_id" });
}

// ---- profile (single-value state: unallocated, daily quote, daily logs) ----
export async function saveProfile(userId, { unallocated, dailyQuoteId, dailyLogs }) {
  const patch = { user_id: userId, updated_at: new Date().toISOString() };
  if (unallocated !== undefined) patch.unallocated = unallocated;
  if (dailyQuoteId !== undefined) patch.daily_quote_id = dailyQuoteId;
  if (dailyLogs !== undefined) patch.data = dailyLogs;
  await supabase.from("profiles").upsert(patch, { onConflict: "user_id" });
}

// ---- assignments ----
export async function addAssignment(row) {
  const { data } = await supabase.from("assignments").insert({
    title: row.title, subject: row.subject, type: row.type,
    due: row.due, priority: row.priority, done: row.done,
  }).select().single();
  return { id: data.id, title: data.title, subject: data.subject, type: data.type, due: data.due, priority: data.priority, done: data.done };
}
export async function updateAssignment(id, patch) {
  await supabase.from("assignments").update(patch).eq("id", id);
}
export async function deleteAssignment(id) {
  await supabase.from("assignments").delete().eq("id", id);
}

// ---- timetable ----
export async function addClass(row) {
  const { data } = await supabase.from("timetable").insert({
    day: row.day, start: row.start, end: row.end, course: row.course, location: row.location,
  }).select().single();
  return { id: data.id, day: data.day, start: data.start, end: data.end, course: data.course, location: data.location };
}
export async function deleteClass(id) {
  await supabase.from("timetable").delete().eq("id", id);
}

// ---- transactions ----
export async function addTransaction(row) {
  const { data } = await supabase.from("transactions").insert({
    descr: row.desc, category: row.category, amount: row.amount, type: row.type, date: row.date,
  }).select().single();
  return { id: data.id, desc: data.descr, category: data.category, amount: Number(data.amount), type: data.type, date: data.date };
}
export async function deleteTransaction(id) {
  await supabase.from("transactions").delete().eq("id", id);
}

// ---- savings goals ----
export async function addSavingsGoal(row) {
  const { data } = await supabase.from("savings_goals").insert({
    name: row.name, target: row.target, current: row.current,
  }).select().single();
  return { id: data.id, name: data.name, target: Number(data.target), current: Number(data.current) };
}
export async function updateSavingsGoal(id, patch) {
  await supabase.from("savings_goals").update(patch).eq("id", id);
}
export async function deleteSavingsGoal(id) {
  await supabase.from("savings_goals").delete().eq("id", id);
}

// ---- budgets (keyed by category; upsert-style) ----
export async function upsertBudget(category, limit) {
  // delete any existing same-category row for this user, then insert fresh
  await supabase.from("budgets").delete().eq("category", category);
  await supabase.from("budgets").insert({ category, limit });
}

// ---- non-negotiables ----
export async function addNonNeg(text) {
  const { data } = await supabase.from("non_negotiables").insert({ text }).select().single();
  return { id: data.id, text: data.text };
}
export async function deleteNonNeg(id) {
  await supabase.from("non_negotiables").delete().eq("id", id);
}

// ---- quotes ----
export async function addQuote(text, source) {
  const { data } = await supabase.from("quotes").insert({ text, source }).select().single();
  return { id: data.id, text: data.text, source: data.source };
}
export async function deleteQuote(id) {
  await supabase.from("quotes").delete().eq("id", id);
}
