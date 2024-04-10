use std::{fs, path, sync::Mutex};

use tauri::{api::path::home_dir, State};

use crate::errors::Error;

use super::state::consts::{GlobalState, WindowState};

#[tauri::command]
pub async fn create_window(
    global_state_mutex: State<'_, Mutex<GlobalState>>,
    window_state_mutex: State<'_, Mutex<WindowState>>,
    handle: tauri::AppHandle,
    path: String,
) -> Result<(), Error> {
    let mut global_state = global_state_mutex.lock()?;

    global_state.lastWorkspacePaths.push(path.clone());

    fs::write(
        home_dir()
            .unwrap()
            .join(".iliad")
            .join("global_config.json"),
        serde_json::to_string(&global_state.clone())?,
    )?;

    let mut local_state = window_state_mutex.lock()?;

    if let None = local_state.state.get(&path) {
        local_state.state.insert(path.clone(), Default::default());

        let config_path = path::Path::new(&path).join(".iliad");

        if !config_path.exists() {
            fs::create_dir_all(config_path.clone())?;
        }

        fs::write(
            config_path.join("workspace_config.json"),
            serde_json::to_string(&local_state.state.get(&path).unwrap())?,
        )?;
    }

    tauri::WindowBuilder::new(
        &handle,
        path.clone(), /* the unique window label */
        tauri::WindowUrl::App("index.html".into()),
    )
    .title(path.clone().split('/').last().unwrap())
    .build()?;

    Ok(())
}
