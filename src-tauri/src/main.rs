// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::collections::HashMap;

use cli::handle_cli;
use gui::handle_gui;

mod cli;
mod commands;
mod errors;
mod gui;
mod menu;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            assert_required_programs_exists().unwrap();
            install_required_programs().unwrap();

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
    let mut programs_status = HashMap::from([("npm", false)]);

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
            return Err(errors::Error::GeneralError(format!(
                "Required program {} not found in PATH",
                program
            )));
        }
    }

    Ok(())
}

fn install_required_programs() -> Result<(), errors::Error> {
    // TS LSP

    let node_version = std::process::Command::new("node")
        .arg("--version")
        .output()
        .expect("Failed to get node version")
        .stdout;

    let main_node_version = String::from_utf8(node_version)
        .unwrap()
        .trim()
        .split(".")
        .collect::<Vec<&str>>()[1..][0]
        .parse::<u8>()
        .unwrap();

    let lsp_version: &str;

    if main_node_version >= 18 {
        lsp_version = "4.3.3";
    } else if main_node_version >= 14 {
        lsp_version = "3.3.2";
    } else {
        return Err(errors::Error::GeneralError(
            "Minimum Node version 14 is required".to_string(),
        ));
    }

    let output = std::process::Command::new("npm")
        .args(&[
            "install",
            "--global",
            &format!("typescript-language-server@{}", lsp_version).to_string(),
            "typescript",
        ])
        .output()
        .expect("Failed to install typescript-language-server");

    if !output.status.success() {
        return Err(errors::Error::GeneralError(
            "Failed to install typescript-language-server".to_string(),
        ));
    } else {
        println!("typescript-language-server installed successfully");
    }

    Ok(())
}
