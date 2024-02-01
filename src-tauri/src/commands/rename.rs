use std::fs;

#[tauri::command]
pub async fn rename(path: &str, new_name: &str) -> Result<(), String> {
  fs::rename(path, new_name)
    .map_err(|e| e.to_string())
    .map(|_| ())
}
