use std::fs;

use crate::errors::Error;

#[tauri::command]
pub async fn read_link(path: &str) -> Result<String, Error> {
  fs::read_link(path)
    .map_err(Into::into)
    .map(|p| p.to_string_lossy().to_string())
}
