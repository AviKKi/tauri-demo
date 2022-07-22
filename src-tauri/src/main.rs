#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use std::sync::Mutex;

#[tauri::command]
fn get_count(state: tauri::State<AppState>) -> i64 {
    state.count.lock().unwrap().clone()
}


#[tauri::command]
fn update_count(update: i64, state: tauri::State<AppState>) -> i64 {
    let mut cnt = state.count.lock().unwrap();
    *cnt += update;
    cnt.clone()
}

struct AppState {
    count: Mutex<i64>,
}

fn main() {
    let mut state = AppState { count: Default::default() };
    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![get_count, update_count])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
