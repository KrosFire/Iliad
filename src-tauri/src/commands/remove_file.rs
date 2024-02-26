use std::fs;

use crate::errors::Error;

#[tauri::command]
pub async fn remove_file(path: &str) -> Result<(), Error> {
  fs::remove_file(path).map_err(Into::into)
}