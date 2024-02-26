use std::fs;

use crate::errors::Error;

#[tauri::command]
pub async fn remove_dir(path: &str, recursive: bool) -> Result<(), Error> {
  if recursive {
    fs::remove_dir_all(path).map_err(Into::into)
  } else {
    fs::remove_dir(path).map_err(Into::into)
  }
}