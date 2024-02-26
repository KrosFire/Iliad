use std::{fs, sync::Mutex};

use tauri::{api::path::home_dir, State, Window};

use crate::errors::Error;

use super::state::consts::GlobalState;

#[tauri::command]
pub async fn close_window(
  global_state_mutex: State<'_, Mutex<GlobalState>>,
  window: Window
) -> Result<(), Error> {
  let mut global_state = global_state_mutex.lock()?;

  if global_state.lastWorkspacePaths.len() == 1 {
    window.close()?;

    return Ok(());
  }

  let path = window.label();
  global_state.lastWorkspacePaths.retain(|x| x != path);

  fs::write(
    home_dir()
      .unwrap()
      .join(".illiade")
      .join("global_config.json"),
    serde_json::to_string(&global_state.clone())?
  )?;

  window.close()?;

  Ok(())
}
