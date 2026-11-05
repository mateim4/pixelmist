// Pixelmist desktop shell. The entire UI is the web build (@pixelmist/web)
// rendered by the OS webview; this binary only creates the window.
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running pixelmist desktop app");
}
