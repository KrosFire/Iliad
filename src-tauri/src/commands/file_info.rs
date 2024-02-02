use std::fs;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct FileInfo {
  pub path: String,
  pub name: String,
  pub is_dir: bool,
  pub is_file: bool,
  pub is_symlink: bool,
  pub size: u64,
  pub accessed: u64,
  pub modified: u64,
  pub created: u64,
}

#[tauri::command]
pub async fn file_info(path: &str) -> Result<FileInfo, String> {
  fs::metadata(path)
    .map_err(|e| e.to_string())
    .map(|metadata| FileInfo {
      path: path.to_string(),
      name: path.split('/').last().unwrap().to_string(),
      is_dir: metadata.is_dir(),
      is_file: metadata.is_file(),
      is_symlink: metadata.file_type().is_symlink(),
      size: metadata.len(),
      accessed: metadata.accessed().unwrap().elapsed().unwrap().as_secs(),
      modified: metadata.modified().unwrap().elapsed().unwrap().as_secs(),
      created: metadata.created().unwrap().elapsed().unwrap().as_secs(),
    })
}
