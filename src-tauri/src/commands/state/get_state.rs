use std::sync::Mutex;

use tauri::{State, Window};

use crate::errors::Error;

use super::consts::{GlobalState, SettingsState, WindowState, WorkspaceState};

#[derive(Debug, serde::Deserialize, serde::Serialize, Clone)]
#[serde(untagged)]
pub enum StoreType {
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
) -> Result<StoreType, Error> {
  match store_type {
    "workspace" => {
      let window_state = window_state_mutex.lock()?;

      let workspace_state = window_state.state.get(window.label())
        .ok_or_else(|| "window not found")?;

      Ok(StoreType::Workspace(workspace_state.clone()))
    }
    "settings" => {
      let settings_state = settings_state_mutex.lock()?;

      Ok(StoreType::Settings(settings_state.clone()))
    }
    _ => {
      let global_state = global_state_mutex.lock()?;

      Ok(StoreType::Global(global_state.clone()))
    }
  }
}
