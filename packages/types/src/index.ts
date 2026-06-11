export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTaskDto = Pick<Task, 'title' | 'description'>;
export type UpdateTaskDto = Partial<Pick<Task, 'title' | 'description' | 'status'>>;
