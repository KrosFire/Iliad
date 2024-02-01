use std::fs;

#[tauri::command]
pub async fn remove_file(path: &str) -> Result<(), String> {
  fs::remove_file(path).map_err(|e| e.to_string())
}