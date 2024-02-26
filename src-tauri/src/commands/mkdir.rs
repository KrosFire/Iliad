use std::fs;

use crate::errors::Error;

#[tauri::command]
pub async fn mkdir(path: &str) -> Result<(), Error> {
  fs::create_dir(path)
    .map_err(Into::into)
    .map(|_| ())
}