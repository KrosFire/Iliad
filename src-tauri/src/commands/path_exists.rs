#[tauri::command]
pub async fn path_exists(path: &str) -> Result<bool, ()> {
  Ok(std::path::Path::new(path).exists())
}
