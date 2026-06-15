use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use tauri::Manager;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Todo {
    pub id: String,
    pub text: String,
    pub done: bool,
    pub priority: String,
    pub created_at: u64,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TodoData {
    pub todos: Vec<Todo>,
    pub dark_mode: bool,
}

fn data_path(app: &tauri::AppHandle) -> PathBuf {
    let path = app
        .path()
        .app_data_dir()
        .expect("failed to get app data dir");
    fs::create_dir_all(&path).ok();
    path.join("todos.json")
}

pub fn load(app: &tauri::AppHandle) -> TodoData {
    let path = data_path(app);
    if !path.exists() {
        return TodoData {
            todos: vec![],
            dark_mode: true,
        };
    }
    fs::read_to_string(&path)
        .ok()
        .and_then(|s| serde_json::from_str(&s).ok())
        .unwrap_or(TodoData {
            todos: vec![],
            dark_mode: true,
        })
}

pub fn save(app: &tauri::AppHandle, data: &TodoData) -> Result<(), String> {
    let path = data_path(app);
    let json = serde_json::to_string_pretty(data).map_err(|e| e.to_string())?;
    fs::write(&path, json).map_err(|e| e.to_string())?;
    Ok(())
}
