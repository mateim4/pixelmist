// Pixelmist desktop shell. The entire UI is the web build (@pixelmist/web)
// rendered by the OS webview; this binary creates the window and exposes a
// small IPC surface the frontend can call via @tauri-apps/api `invoke`.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {name}! — from the Pixelmist desktop shell (Tauri v2).")
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running pixelmist desktop app");
}
