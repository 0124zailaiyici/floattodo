use crate::storage;
use tauri::Manager;

#[tauri::command]
pub fn save_todos(
    app: tauri::AppHandle,
    todos: Vec<storage::Todo>,
    dark_mode: bool,
) -> Result<(), String> {
    let data = storage::TodoData { todos, dark_mode };
    storage::save(&app, &data)
}

#[tauri::command]
pub fn load_todos(app: tauri::AppHandle) -> Result<storage::TodoData, String> {
    Ok(storage::load(&app))
}

#[tauri::command]
pub fn set_window_position(app: tauri::AppHandle, x: i32, y: i32) -> Result<(), String> {
    app.get_webview_window("main")
        .ok_or("window not found")?
        .set_position(tauri::PhysicalPosition::new(x, y))
        .map_err(|e| e.to_string())
}
