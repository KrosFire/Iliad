#[tauri::command]
pub async fn path_exists(path: &str) -> bool {
  std::path::Path::new(path).exists()
}