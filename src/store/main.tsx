import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// --- Types Definition ---

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export interface TaskItem {
  task_id: number;
  title: string;
  description: string | null;
  due_date: string | null; // "YYYY-MM-DD"
  due_time: string | null; // "HH:MM"
  planned_completion_date: string | null; // "YYYY-MM-DD"
  estimated_finish_time: number | null; // in hours
  status: 'pending' | 'in_progress' | 'completed';
  created_at: string; // ISO 8601 format
  updated_at: string; // ISO 8601 format
}

// Exporting helper types and constants
export type { TaskItem, TaskStatus, SortBy, SortOrder, ModalVisibility, ActiveModalData, Notification, TaskState };
