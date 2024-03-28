use std::{fs, path::PathBuf, sync::Mutex};

use tauri::{api::path::home_dir, State, Window};

use crate::errors::Error;

use super::consts::{GlobalState, SettingsState, WindowState, WorkspaceState};

#[derive(Debug, serde::Deserialize, serde::Serialize, Clone)]
#[serde(untagged)]
pub enum Store {
  Workspace(WorkspaceState),
  Global(GlobalState),
  Settings(SettingsState)
}

#[tauri::command]
pub async fn get_state(
    global_state_mutex: State<'_, Mutex<GlobalState>>,
    window_state_mutex: State<'_, Mutex<WindowState>>,
    settings_state_mutex: State<'_, Mutex<SettingsState>>,
    window: Window,
    store_type: &str,
) -> Result<Store, Error> {
  match store_type {
    "workspace" => {
      let window_state = window_state_mutex.lock()?;

      let workspace_state = window_state.state.get(window.label())
        .ok_or_else(|| "window not found")?;

      Ok(Store::Workspace(workspace_state.clone()))
    }
    "settings" => {
      let settings_state = settings_state_mutex.lock()?;

      Ok(Store::Settings(settings_state.clone()))
    }
    _ => {
      let global_state = global_state_mutex.lock()?;

      Ok(Store::Global(global_state.clone()))
    }
  }
}

pub fn read_saved_state(store_type: &str, local_path: &str) -> Result<Store, Error> {
  let config_path: PathBuf = PathBuf::from(local_path).join(".illiade");
  let global_config_path: PathBuf = home_dir().unwrap().join(".illiade");

  match store_type {
    "workspace" => {
      let saved_state_string = fs::read_to_string(
          config_path.join("workspace_config.json"),
        ).unwrap_or(String::new());

      Ok(Store::Workspace(
        serde_json::from_str::<WorkspaceState>(&saved_state_string)
          .unwrap_or(WorkspaceState::default())
      ))
    }
    "settings" => {
      let saved_state_string = fs::read_to_string(
        global_config_path.join("settings_config.json"),
      ).unwrap_or(String::new());

      Ok(Store::Settings(
        serde_json::from_str::<SettingsState>(&saved_state_string)
          .unwrap_or(SettingsState::default())
      ))
    }
    _ => {
      let saved_state_string = fs::read_to_string(
        global_config_path.join("global_config.json"),
      ).unwrap_or(String::new());

      Ok(Store::Global(
        serde_json::from_str::<GlobalState>(&saved_state_string)
          .unwrap_or(GlobalState::default())
      ))
    }
  }
}
