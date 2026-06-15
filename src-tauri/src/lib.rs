mod commands;
mod storage;

use std::fs::OpenOptions;
use std::io::Write;
use tauri::{
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    menu::{MenuBuilder, MenuItemBuilder},
    Emitter, Manager,
};
use tauri_plugin_global_shortcut::GlobalShortcutExt;

fn log_to_file(msg: &str) {
    if let Ok(mut f) = OpenOptions::new()
        .create(true)
        .append(true)
        .open("C:\\Users\\wx\\AppData\\Local\\Temp\\floattodo.log")
    {
        let _ = writeln!(f, "{}", msg);
    }
}

fn toggle_window(app: &tauri::AppHandle) {
    log_to_file("toggle_window called");
    if let Some(window) = app.get_webview_window("main") {
        if window.is_visible().ok().unwrap_or(false) {
            log_to_file("hiding window");
            window.hide().ok();
        } else {
            log_to_file("showing window");
            window.show().ok();
            window.set_focus().ok();
        }
    }
}

fn run() {
    log_to_file("=== FloatTodo START ===");
    tauri::Builder::default()
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(|app, shortcut, event| {
                    log_to_file(&format!("global shortcut fired: {:?}", shortcut));
                    toggle_window(app);
                })
                .build(),
        )
        .setup(|app| {
            log_to_file("Setup started");

            let show_item = MenuItemBuilder::with_id("show", "显示/隐藏").build(app)?;
            let focus_item = MenuItemBuilder::with_id("focus", "专注模式").build(app)?;
            let quit_item = MenuItemBuilder::with_id("quit", "退出").build(app)?;

            let menu = MenuBuilder::new(app)
                .item(&show_item)
                .item(&focus_item)
                .separator()
                .item(&quit_item)
                .build()?;

            log_to_file("Creating tray icon");
            let _tray = TrayIconBuilder::new()
                .icon(tauri::include_image!("icons/32x32.png"))
                .menu(&menu)
                .on_menu_event(move |app, event| {
                    log_to_file(&format!("menu event: {}", event.id.as_ref()));
                    match event.id.as_ref() {
                        "show" => toggle_window(app),
                        "focus" => {
                            if let Some(window) = app.get_webview_window("main") {
                                window.emit("toggle-focus", ()).ok();
                            }
                        }
                        "quit" => {
                            log_to_file("quit called");
                            app.exit(0);
                        }
                        _ => {}
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    log_to_file(&format!("tray event: {:?}", event));
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        toggle_window(tray.app_handle());
                    }
                })
                .build(app)?;

            log_to_file("Tray icon created");

            log_to_file("Registering global shortcut");
            app.global_shortcut().register("Ctrl+Shift+T")?;
            log_to_file("Shortcut registered");

            log_to_file("Configuring window");
            if let Some(window) = app.get_webview_window("main") {
                log_to_file("Window found, applying config");
                window.show().ok();
                window.set_focus().ok();
                window.set_size(tauri::LogicalSize::new(300.0, 400.0))?;
                window.set_position(tauri::LogicalPosition::new(100.0, 100.0))?;
                log_to_file("Window configured");
            } else {
                log_to_file("ERROR: window not found!");
            }

            log_to_file("Setup complete");
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::save_todos,
            commands::load_todos,
            commands::set_window_position,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[cfg(target_os = "windows")]
pub fn main() {
    run();
}

#[cfg(not(target_os = "windows"))]
pub fn main() {
    run();
}
