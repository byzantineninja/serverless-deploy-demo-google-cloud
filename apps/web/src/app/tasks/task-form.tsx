'use client';

import { useState } from 'react';

export function TaskForm({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    setTitle('');
    setLoading(false);
    onCreated();
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="新任務標題..."
        style={{ flex: 1, padding: '0.5rem' }}
      />
      <button type="submit" disabled={loading} style={{ padding: '0.5rem 1rem' }}>
        {loading ? '建立中...' : '建立'}
      </button>
    </form>
  );
}
