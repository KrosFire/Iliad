use std::fs;

use crate::errors::Error;

#[tauri::command]
pub async fn create_file(path: &str) -> Result<(), Error> {
  fs::File::create(path)
    .map(|_| ())
    .map_err(Into::into)
}
