#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use reqwest::Url;
use std::error::Error;
use std::{error, string, sync::Mutex};

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

#[tauri::command]
async fn get_subreddit(sub: String) -> String {
    println!("{}", sub);
    let url = format!("https://reddit.com/r/{}.json", sub);
    let res = reqwest::get(url);
    let body = res.await;
    if body.is_err() {
        return String::from("");
    }
    let unwrapped = body.unwrap();
    let text = unwrapped.text();
    let body = text.await;
    if body.is_err() {
        return String::from("");
    }
    let return_val = body.unwrap();
    return return_val;
}

struct AppState {
    count: Mutex<i64>,
}

fn main() {
    let mut state = AppState {
        count: Default::default(),
    };
    tauri::Builder::default()
        .manage(state)
        .invoke_handler(tauri::generate_handler![
            get_count,
            update_count,
            get_subreddit
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
