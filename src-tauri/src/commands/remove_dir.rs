use std::fs;

#[tauri::command]
pub async fn remove_dir<R: Runtime>(path: &str, recursive: bool) -> Result<(), String> {
  if recursive {
    fs::remove_dir_all(path).map_err(|e| e.to_string())
  } else {
    fs::remove_dir(path).map_err(|e| e.to_string())
  }
}