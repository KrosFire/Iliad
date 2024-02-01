use std::fs;

#[tauri::command]
pub async fn write_file(path: &str, contents: &str, encoding: &str) -> Result<(), String> {
  let buffer = match encoding {
    "utf8" => contents.as_bytes().to_vec(),
    "utf16" => contents.encode_utf16().collect(),
    _ => contents.as_bytes().to_vec(),
  };

  fs::write
    (path, buffer)
    .map_err(|e| e.to_string())
    .map(|_| ())
}
