export type Task = {
  id: string;
  user_id: string;
  created_at: string;
  task: string;
  priority_score: number | null;
  notes?: string | null;
};

export type Priorities = Record<string, { score: number; explanation: string }>;

export type AddTaskState =
  | { success: true }
  | { success: false; error: string }
  | null;

export type DeleteTaskState =
  | { success: true }
  | { success: false; error: string }
  | null;
