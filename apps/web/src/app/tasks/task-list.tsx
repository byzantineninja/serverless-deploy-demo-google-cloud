'use client';

import { useEffect, useState } from 'react';
import { TaskForm } from './task-form';
import type { Task, TaskStatus } from '@repo/types';

const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: '待辦',
  in_progress: '進行中',
  done: '完成',
};

const NEXT_STATUS: Record<TaskStatus, TaskStatus> = {
  todo: 'in_progress',
  in_progress: 'done',
  done: 'todo',
};

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  async function fetchTasks() {
    const res = await fetch('/api/tasks');
    if (res.ok) setTasks(await res.json());
  }

  useEffect(() => { fetchTasks(); }, []);

  async function updateStatus(task: Task) {
    await fetch(`/api/tasks/${task._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: NEXT_STATUS[task.status] }),
    });
    fetchTasks();
  }

  async function deleteTask(id: string) {
    await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    fetchTasks();
  }

  return (
    <div>
      <TaskForm onCreated={fetchTasks} />
      {tasks.length === 0 && <p style={{ color: '#666' }}>尚無任務。建立第一個任務吧！</p>}
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {tasks.map((task) => (
          <li key={task._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
            <button onClick={() => updateStatus(task)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}>
              {STATUS_LABELS[task.status]}
            </button>
            <span style={{ flex: 1, textDecoration: task.status === 'done' ? 'line-through' : 'none' }}>
              {task.title}
            </span>
            <button onClick={() => deleteTask(task._id)} style={{ padding: '0.25rem 0.5rem', fontSize: '0.8rem', color: 'red' }}>
              刪除
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
