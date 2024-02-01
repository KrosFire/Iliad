use std::fs;

#[tauri::command]
pub async fn mkdir(path: &str) -> Result<(), String> {
  fs::create_dir(path)
    .map_err(|e| e.to_string())
    .map(|_| ())
}