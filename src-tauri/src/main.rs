// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{fs, path::PathBuf, sync::Mutex};

use commands::state::consts::{GlobalState, LocalState, WindowState};
use tauri::{api::path::home_dir, Manager};

mod commands;
mod errors;

fn main() {    
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle();

            let global_state_saved = fs::read_to_string(
                home_dir()
                        .unwrap()
                        .join(".illiade")
                        .join("global_config.json")
                    )
                    .unwrap_or(String::new());

            handle.manage(Mutex::new(serde_json::from_str::<GlobalState>(&global_state_saved)
                .unwrap_or_default()));
        
            let global_state = serde_json::from_str::<GlobalState>(&global_state_saved)
                .unwrap_or_default();

            handle.manage(Mutex::new(WindowState {
                state: global_state.lastWorkspacePaths
                    .iter()
                    .map(|path| {
                        let local_state = serde_json::from_str::<LocalState>(
                            &fs::read_to_string(
                                PathBuf::from(path)
                                        .join(".illiade")
                                        .join("workspace_config.json")
                                )
                                .unwrap_or(String::new())
                            )
                            .unwrap_or(LocalState::default());

                        (path.clone(), local_state)
                    })
                    .collect()
            }));

            global_state.lastWorkspacePaths
                .iter()
                .for_each(|path| {
                    tauri::WindowBuilder::new(
                        &handle,
                        path.clone(), /* the unique window label */
                        tauri::WindowUrl::App("index.html".into()),
                    )
                    .title(path.clone().split('/').last().unwrap())
                    .build()
                    .unwrap();
                });

            Ok(())
        })
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
            commands::create_window::create_window,
            commands::close_window::close_window,
            commands::state::get_state::get_state,
            commands::state::update_state::update_state,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
