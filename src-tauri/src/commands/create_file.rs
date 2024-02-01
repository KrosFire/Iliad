use std::fs;

#[tauri::command]
pub async fn create_file(path: &str) -> Result<(), String> {
  fs::File::create(path)
    .map_err(|e| e.to_string())
    .map(|_| ())
}
