use crate::storage;
use tauri::Manager;

#[tauri::command]
pub fn save_todos(
    todos: Vec<storage::Todo>,
    dark_mode: bool,
    groups: Vec<String>,
) -> Result<(), String> {
    let data = storage::TodoData { todos, dark_mode, groups };
    storage::save(&data)
}

#[tauri::command]
pub fn load_todos() -> Result<storage::TodoData, String> {
    Ok(storage::load())
}

#[tauri::command]
pub fn set_window_position(app: tauri::AppHandle, x: i32, y: i32) -> Result<(), String> {
    app.get_webview_window("main")
        .ok_or("window not found")?
        .set_position(tauri::PhysicalPosition::new(x, y))
        .map_err(|e| e.to_string())
}
