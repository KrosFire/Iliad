// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod commands;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs_watch::init())
        .invoke_handler(tauri::generate_handler![
            commands::read_dir::read_dir,
            commands::read_file::read_file,
            commands::read_link::read_link,
            commands::create_file::create_file,
            commands::mkdir::mkdir,
            commands::file_info::file_info,
            commands::remove_file::remove_file,
            commands::remove_dir::remove_dir,
            commands::write_file::write_file,
            commands::rename::rename,
            commands::path_exists::path_exists,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
