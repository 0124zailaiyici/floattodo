use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Todo {
    pub id: String,
    pub text: String,
    pub done: bool,
    pub priority: String,
    pub created_at: u64,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct TodoData {
    pub todos: Vec<Todo>,
    pub dark_mode: bool,
}

fn data_path() -> PathBuf {
    let exe = std::env::current_exe().unwrap_or_else(|_| PathBuf::from("."));
    let dir = exe.parent().unwrap_or(std::path::Path::new("."));
    dir.join("floattodo-data.json")
}

pub fn load() -> TodoData {
    let path = data_path();
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

pub fn save(data: &TodoData) -> Result<(), String> {
    let path = data_path();
    let json = serde_json::to_string_pretty(data).map_err(|e| e.to_string())?;
    fs::write(&path, json).map_err(|e| e.to_string())?;
    Ok(())
}
