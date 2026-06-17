export type Priority = "high" | "medium" | "low";

export interface Todo {
  id: string;
  text: string;
  done: boolean;
  priority: Priority;
  createdAt: number;
  group: string;
}

export interface TodoData {
  todos: Todo[];
  darkMode: boolean;
  groups: string[];
}
