use std::{fs, time::SystemTime};

use serde::{Deserialize, Serialize};

use crate::errors::Error;

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
pub async fn file_info(path: &str) -> Result<FileInfo, Error> {
  fs::metadata(path)
    .map_err(Into::into)
    .map(|metadata| {

      FileInfo {
        path: path.to_string(),
        name: path.split('/').last().unwrap().to_string(),
        is_dir: metadata.is_dir(),
        is_file: metadata.is_file(),
        is_symlink: metadata.file_type().is_symlink(),
        size: metadata.len(),
        accessed: metadata.accessed().unwrap_or(SystemTime::now()).elapsed().unwrap().as_secs(),
        modified: metadata.modified().unwrap_or(SystemTime::now()).elapsed().unwrap().as_secs(),
        created: metadata.created().unwrap_or(SystemTime::now()).elapsed().unwrap().as_secs(),
      }
    })
}
