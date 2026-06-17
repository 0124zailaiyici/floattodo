import { create } from "zustand";
import { type Todo, type Priority, type TodoData } from "../types/todo";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { LogicalSize } from "@tauri-apps/api/dpi";

const appWindow = getCurrentWebviewWindow();

const PRIORITY_ORDER: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

function sortTodos(todos: Todo[]): Todo[] {
  return [...todos].sort((a, b) => {
    const pa = PRIORITY_ORDER[a.priority];
    const pb = PRIORITY_ORDER[b.priority];
    if (pa !== pb) return pa - pb;
    return a.createdAt - b.createdAt;
  });
}

interface TodoStore {
  todos: Todo[];
  collapsed: boolean;
  darkMode: boolean;
  loaded: boolean;
  groups: string[];
  expandedId: string | null;

  addTodo: (text: string, priority: Priority, group: string) => void;
  toggleTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
  deleteTodo: (id: string) => void;
  clearDone: () => void;
  setCollapsed: (v: boolean) => void;
  toggleCollapsed: () => void;
  setDarkMode: (v: boolean) => void;
  loadFromDisk: (data: TodoData) => void;
  saveToDisk: () => void;
  addGroup: (name: string) => void;
  deleteGroup: (name: string) => void;
  moveTodo: (id: string, group: string) => void;
  setExpandedId: (id: string | null) => void;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export const useTodoStore = create<TodoStore>((set, get) => ({
  todos: [],
  collapsed: true,
  darkMode: true,
  loaded: false,
  groups: ["默认"],
  expandedId: null,

  addTodo: (text, priority, group) => {
    const todo: Todo = {
      id: generateId(),
      text,
      done: false,
      priority,
      createdAt: Date.now(),
      group: group || "默认",
    };
    set((s) => ({ todos: sortTodos([todo, ...s.todos]) }));
    get().saveToDisk();
  },

  toggleTodo: (id) => {
    set((s) => ({
      todos: s.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));
    get().saveToDisk();
  },

  editTodo: (id, text) => {
    set((s) => ({
      todos: s.todos.map((t) => (t.id === id ? { ...t, text } : t)),
    }));
    get().saveToDisk();
  },

  deleteTodo: (id) => {
    set((s) => ({ todos: s.todos.filter((t) => t.id !== id) }));
    get().saveToDisk();
  },

  clearDone: () => {
    set((s) => ({ todos: s.todos.filter((t) => !t.done) }));
    get().saveToDisk();
  },

  setCollapsed: (v) => {
    set({ collapsed: v });
    appWindow.setSize(new LogicalSize(300, v ? 34 : 420)).catch(() => {});
  },
  toggleCollapsed: () => {
    const next = !get().collapsed;
    get().setCollapsed(next);
  },
  setDarkMode: (v) => {
    set({ darkMode: v });
    get().saveToDisk();
  },

  loadFromDisk: (data) => {
    set({
      todos: sortTodos(data.todos),
      darkMode: data.darkMode,
      groups: data.groups?.length ? data.groups : ["默认"],
      loaded: true,
    });
  },

  saveToDisk: () => {
    const { todos, darkMode, groups } = get();
    try {
      const invoke = (window as any).__TAURI_INTERNALS__?.invoke;
      if (invoke) {
        invoke("save_todos", { todos, darkMode, groups });
      }
    } catch {}
  },

  addGroup: (name) => {
    set((s) => {
      if (s.groups.includes(name)) return s;
      return { groups: [...s.groups, name] };
    });
    get().saveToDisk();
  },

  deleteGroup: (name) => {
    set((s) => {
      const remaining = s.groups.filter((g) => g !== name);
      if (remaining.length === 0) return s;
      const fallback = remaining[0];
      return {
        groups: remaining,
        todos: s.todos.map((t) => (t.group === name ? { ...t, group: fallback } : t)),
      };
    });
    get().saveToDisk();
  },

  moveTodo: (id, group) => {
    set((s) => ({
      todos: s.todos.map((t) => (t.id === id ? { ...t, group } : t)),
    }));
    get().saveToDisk();
  },

  setExpandedId: (id) => set({ expandedId: id }),
}));
