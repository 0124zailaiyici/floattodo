mod commands;
mod storage;

use tauri::{
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    menu::{MenuBuilder, MenuItemBuilder},
    Manager,
};
use tauri_plugin_global_shortcut::GlobalShortcutExt;

use std::sync::atomic::{AtomicU64, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};

fn toggle_window(app: &tauri::AppHandle) {
    static LAST: AtomicU64 = AtomicU64::new(0);
    let now = SystemTime::now().duration_since(UNIX_EPOCH).unwrap_or_default().as_millis() as u64;
    let last = LAST.load(Ordering::Relaxed);
    if now.wrapping_sub(last) < 300 {
        return;
    }
    LAST.store(now, Ordering::Relaxed);

    if let Some(window) = app.get_webview_window("main") {
        if window.is_visible().ok().unwrap_or(false) {
            window.hide().ok();
        } else {
            window.unminimize().ok();
            window.show().ok();
            window.set_focus().ok();
        }
    }
}

fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_global_shortcut::Builder::new()
                .with_handler(|app, _shortcut, _event| toggle_window(app))
                .build(),
        )
        .setup(|app| {
            let show_item = MenuItemBuilder::with_id("show", "显示/隐藏").build(app)?;
            let quit_item = MenuItemBuilder::with_id("quit", "退出").build(app)?;

            let menu = MenuBuilder::new(app)
                .item(&show_item)
                .separator()
                .item(&quit_item)
                .build()?;

            TrayIconBuilder::new()
                .icon(tauri::include_image!("icons/32x32.png"))
                .menu(&menu)
                .on_menu_event(move |app, event| match event.id.as_ref() {
                    "show" => toggle_window(app),
                    "quit" => app.exit(0),
                    _ => {}
                })
                .on_tray_icon_event(|tray, event| {
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

            app.global_shortcut().register("Alt+X")?;

            if let Some(window) = app.get_webview_window("main") {
                window.show().ok();
                window.set_focus().ok();
                window.set_size(tauri::LogicalSize::new(300.0, 400.0))?;
                window.set_position(tauri::LogicalPosition::new(100.0, 100.0))?;
            }

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

pub fn main() {
    run();
}
