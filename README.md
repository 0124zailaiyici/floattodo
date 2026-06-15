# FloatTodo

全局悬浮待办清单。始终置顶在屏幕之上，`Ctrl+Shift+T` 快捷唤出，适合随时记录不忘记。

## 功能

- 全局置顶 — 浮动在所有窗口之上
- 快捷键 `Ctrl+Shift+T` — 显示/隐藏
- 系统托盘 — 右键菜单，左键切换
- 添加/勾选/删除待办 — 支持优先级（高/中/低）
- 数据持久化 — JSON 存本地，关机不丢
- 拖拽移动 — 拖标题栏任意位置
- 折叠/展开 — 折叠只显示 3 条
- 专注模式 — 半透明只看不操作
- 深色/浅色主题切换

## 技术栈

| 层 | 选型 |
|---|------|
| 壳 | Tauri v2 (Rust) |
| 前端 | React + TypeScript + Tailwind CSS |
| 状态 | Zustand |
| 存储 | JSON 文件 (AppData) |
| 快捷键 | tauri-plugin-global-shortcut |
| 打包 | MSI / NSIS 安装包 |

## 开发

```bash
npm install
npm run tauri dev
```

## 构建

```bash
npm run tauri build
```

产物在 `src-tauri/target/release/bundle/` 目录下。

## 使用

- **启动** — 双击 `floattodo.exe` 或安装 MSI/NSIS
- **唤出** — `Ctrl+Shift+T`
- **拖动** — 拖标题栏移动
- **退出** — 托盘右键 → 退出
- **数据位置** — `%APPDATA%\com.floattodo.desktop\todos.json`
