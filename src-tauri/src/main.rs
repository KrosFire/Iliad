// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashMap;

use cli::handle_cli;
use gui::handle_gui;

mod commands;
mod errors;
mod menu;
mod cli;
mod gui;

fn main() {    
    tauri::Builder::default()
        .setup(|app| {
            assert_required_programs_exists().unwrap();
            
            if std::env::args_os().count() > 1 {
                handle_cli(app)?;
            } else {
                handle_gui(app)?;
            }

            Ok(())
        })
        .plugin(tauri_plugin_fs_watch::init())
        .plugin(tauri_plugin_context_menu::init())
        .menu(menu::init())
        .on_menu_event(menu::menu_event_handler)
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
            commands::start_lsp::start_lsp,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn assert_required_programs_exists() -> Result<(), errors::Error> {
    let mut programs_status = HashMap::from([
        ("typescript-language-server", false),
        ("tsserver", false),
    ]);

    if let Ok(path) = std::env::var("PATH") {
        for p in path.split(":") {
            for program in programs_status.clone().keys() {
                let p_str = format!("{}/{}", p, program);
                if std::fs::metadata(p_str.clone()).is_ok() {
                    programs_status.insert(program, true);
                }
            }
        }
    }

    for (program, status) in programs_status {
        if !status {
            return Err(errors::Error::GeneralError(format!("Required program {} not found in PATH", program)));
        }
    }

    Ok(())
}
