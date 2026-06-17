import { useState } from "react";
import { useTodoStore } from "../store/todoStore";
import type { Priority } from "../types/todo";

interface Props {
  onAdd: (text: string, priority: Priority, group: string) => void;
}

const priorities: { key: Priority; label: string; color: string }[] = [
  { key: "high", label: "高", color: "bg-red-500" },
  { key: "medium", label: "中", color: "bg-yellow-500" },
  { key: "low", label: "低", color: "bg-gray-400 dark:bg-gray-500" },
];

export default function TodoInput({ onAdd }: Props) {
  const { groups, addGroup } = useTodoStore();
  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [group, setGroup] = useState("默认");
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroup, setNewGroup] = useState("");

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onAdd(trimmed, priority, group);
    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  const handleNewGroup = () => {
    const name = newGroup.trim();
    if (!name || groups.includes(name)) return;
    addGroup(name);
    setGroup(name);
    setNewGroup("");
    setShowNewGroup(false);
  };

  return (
    <div className="flex flex-col border-t border-gray-100 dark:border-white/10">
      <div className="flex items-center gap-2 px-3 py-1.5">
        <input
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          onKeyDown={handleKeyDown}
          placeholder="添加待办..."
          className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100
            placeholder-gray-400 dark:placeholder-gray-500 outline-none no-drag"
        />
        <div className="flex gap-1 no-drag">
          {priorities.map((p) => (
            <button
              key={p.key}
              onClick={() => setPriority(p.key)}
              className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center
                transition-all
                ${priority === p.key
                  ? `${p.color} text-white scale-110`
                  : "bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/20"
                }`}
              title={p.label}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1 px-3 pb-1.5">
        <select
          value={group}
          onChange={(e) => {
            if (e.currentTarget.value === "__new") {
              setShowNewGroup(true);
            } else {
              setGroup(e.currentTarget.value);
            }
          }}
          className="text-[10px] bg-transparent text-gray-400 dark:text-gray-500
            border border-gray-200 dark:border-white/10 rounded px-1 py-0.5
            outline-none no-drag cursor-pointer max-w-[80px]"
        >
          {groups.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
          <option value="__new">+ 新建</option>
        </select>

        {showNewGroup && (
          <div className="flex items-center gap-1">
            <input
              value={newGroup}
              onChange={(e) => setNewGroup(e.currentTarget.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleNewGroup(); }}
              placeholder="分组名"
              className="w-16 text-[10px] bg-transparent text-gray-900 dark:text-gray-100
                border border-gray-300 dark:border-white/20 rounded px-1 py-0.5
                outline-none no-drag placeholder-gray-400 dark:placeholder-gray-500"
              autoFocus
            />
            <button onClick={handleNewGroup} className="text-[10px] text-cyan-500 no-drag">确定</button>
            <button onClick={() => setShowNewGroup(false)} className="text-[10px] text-gray-400 no-drag">✕</button>
          </div>
        )}
      </div>
    </div>
  );
}
