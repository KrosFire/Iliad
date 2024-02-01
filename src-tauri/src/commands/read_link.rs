use std::fs;

#[tauri::command]
pub async fn read_link(path: &str) -> Result<String, String> {
  fs::read_link(path)
    .map_err(|e| e.to_string())
    .map(|p| p.to_string_lossy().to_string())
}
