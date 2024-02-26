use std::fs;

use serde::{Deserialize, Serialize};

use crate::errors::Error;

#[derive(Serialize, Deserialize)]
pub struct ReadDirItem {
  pub path: String,
  pub name: String,
  pub is_dir: bool,
  pub is_file: bool,
  pub is_symlink: bool,
}

#[tauri::command]
pub async fn read_dir(path: &str) -> Result<Vec<ReadDirItem>, Error> {
  fs::read_dir(path)
    ?.map(|entry| {
      let entry = entry?;
      let path = entry.path();
      let name = entry.file_name();
      let name = name.to_string_lossy().to_string();
      let is_dir = entry.file_type().map(|t| t.is_dir()).unwrap_or(false);
      let is_file = entry.file_type().map(|t| t.is_file()).unwrap_or(false);
      let is_symlink = entry.file_type().map(|t| t.is_symlink()).unwrap_or(false);
      Ok(ReadDirItem {
        path: path.to_string_lossy().to_string(),
        name,
        is_dir,
        is_file,
        is_symlink,
      })
    })
    .collect::<Result<_, Error>>()
}
