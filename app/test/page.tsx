"use client";

import React, { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Test() {
  const tasks = useQuery(api.tasks.get);
  const addTask = useMutation(api.tasks.add);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    setSaving(true);
    try {
      // call the Convex mutation to insert
      await addTask({ text: trimmed });
      setText("");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>Convex test</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: 16 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="New task"
          style={{ padding: 8, minWidth: 240 }}
        />
        <button type="submit" disabled={saving} style={{ marginLeft: 8 }}>
          {saving ? "Saving..." : "Save"}
        </button>
      </form>

      <h2>Saved tasks</h2>
      {tasks ? (
        <ul>
          {(tasks as any[]).map((t: any) => (
            <li key={t._id ? String(t._id) : JSON.stringify(t)}>
              {t.text ?? JSON.stringify(t)}
            </li>
          ))}
        </ul>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}