use std::fs;

#[tauri::command]
pub async fn write_file(path: &str, contents: &str, encoding: &str) -> Result<(), String> {
  match encoding {
    "utf8" => {
      let buffer = contents.as_bytes().to_vec();

      fs::write
        (path, buffer)
        .map_err(|e| e.to_string())
        .map(|_| ())
    },
    _ => {
      let buffer = contents.as_bytes().to_vec();

      fs::write
        (path, buffer)
        .map_err(|e| e.to_string())
        .map(|_| ())
    }
  }
}
