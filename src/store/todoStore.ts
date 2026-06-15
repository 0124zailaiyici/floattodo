import { create } from "zustand";
import { type Todo, type Priority, type TodoData } from "../types/todo";

interface TodoStore {
  todos: Todo[];
  expanded: boolean;
  darkMode: boolean;
  focusMode: boolean;
  loaded: boolean;

  addTodo: (text: string, priority: Priority) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  reorderTodos: (todos: Todo[]) => void;
  clearDone: () => void;
  setExpanded: (v: boolean) => void;
  toggleExpanded: () => void;
  setDarkMode: (v: boolean) => void;
  setFocusMode: (v: boolean) => void;
  loadFromDisk: (data: TodoData) => void;
  saveToDisk: () => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  expanded: false,
  darkMode: true,
  focusMode: false,
  loaded: false,

  addTodo: (text, priority) => {
    const todo: Todo = {
      id: generateId(),
      text,
      done: false,
      priority,
      createdAt: Date.now(),
    };
    set((s) => ({ todos: [todo, ...s.todos] }));
    get().saveToDisk();
  },

  toggleTodo: (id) => {
    set((s) => ({
      todos: s.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));
    get().saveToDisk();
  },

  deleteTodo: (id) => {
    set((s) => ({ todos: s.todos.filter((t) => t.id !== id) }));
    get().saveToDisk();
  },

  reorderTodos: (todos) => {
    set({ todos });
    get().saveToDisk();
  },

  clearDone: () => {
    set((s) => ({ todos: s.todos.filter((t) => !t.done) }));
    get().saveToDisk();
  },

  setExpanded: (v) => set({ expanded: v }),
  toggleExpanded: () => set((s) => ({ expanded: !s.expanded })),
  setDarkMode: (v) => {
    set({ darkMode: v });
    get().saveToDisk();
  },
  setFocusMode: (v) => set({ focusMode: v }),

  loadFromDisk: (data) => {
    set({ todos: data.todos, darkMode: data.darkMode, loaded: true });
  },

  saveToDisk: () => {
    const { todos, darkMode } = get();
    try {
      const invoke = (window as any).__TAURI_INTERNALS__?.invoke;
      if (invoke) {
        invoke("save_todos", { todos, darkMode });
      }
    } catch {}
  },
}));
