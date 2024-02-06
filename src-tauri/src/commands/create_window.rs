#[tauri::command]
pub async fn create_window(handle: tauri::AppHandle, path: String) {
  tauri::WindowBuilder::new(
    &handle,
    path.clone(), /* the unique window label */
    tauri::WindowUrl::App("index.html".into()),
  )
  .title(path.clone().split('/').last().unwrap())
  .build()
  .unwrap();
}
