use std::{fs, path::PathBuf, sync::Mutex};

use tauri::{api::path::home_dir, State, Window};

use crate::errors::Error;

use super::consts::{GlobalState, LocalState, WindowState};

#[tauri::command]
pub async fn update_state(
  global_state_mutex: State<'_, Mutex<GlobalState>>,
  window_state_mutex: State<'_, Mutex<WindowState>>,
  window: Window,
  store_type: &str,
  new_state: &str,
) -> Result<(), Error> {
  let config_path: PathBuf = PathBuf::from(window.label()).join(".illiade");
  let global_config_path: PathBuf = home_dir().unwrap().join(".illiade");

  if !config_path.exists() {
    fs::create_dir_all(config_path.clone())?;
  }

  if !global_config_path.exists() {
    fs::create_dir_all(global_config_path.clone())?;
  }

  match store_type {
    "local" => {
      let mut window_state = window_state_mutex.lock()?;

      let local_state = window_state.state.get_mut(window.label())
        .ok_or_else(|| "No local state found for window")?;

      *local_state = serde_json::from_str::<LocalState>(new_state)?;

      fs::write(
        config_path
          .join("workspace_config.json"),
        serde_json::to_string(&local_state)?
      )?;
    }
    _ => {
      let mut global_state = global_state_mutex.lock()?;

      *global_state = serde_json::from_str::<GlobalState>(new_state)?;

      fs::write(
        global_config_path.join("global_config.json"),
        serde_json::to_string(&global_state.clone())?
      )?;
    }
  }

  Ok(())
}
