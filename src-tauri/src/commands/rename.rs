use std::fs;

use crate::errors::Error;

#[tauri::command]
pub async fn rename(path: &str, new_name: &str) -> Result<(), Error> {
  fs::rename(path, new_name)
    .map_err(Into::into)
    .map(|_| ())
}
