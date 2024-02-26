use std::sync::Mutex;

use tauri::{State, Window};

use crate::errors::Error;

use super::consts::{GlobalState, LocalState, WindowState};

#[derive(Debug, serde::Deserialize, serde::Serialize, Clone)]
#[serde(untagged)]
pub enum StoreType {
  Local(LocalState),
  Global(GlobalState),
}

#[tauri::command]
pub async fn get_state(
    global_state_mutex: State<'_, Mutex<GlobalState>>,
    window_state_mutex: State<'_, Mutex<WindowState>>,
    window: Window,
    store_type: &str,
) -> Result<StoreType, Error> {
  match store_type {
    "local" => {
      let window_state = window_state_mutex.lock()?;

      let local_state = window_state.state.get(window.label())
        .ok_or_else(|| "window not found")?;

      Ok(StoreType::Local(local_state.clone()))
    }
    _ => {
      let global_state = global_state_mutex.lock()?;

      Ok(StoreType::Global(global_state.clone()))
    }
  }
}
