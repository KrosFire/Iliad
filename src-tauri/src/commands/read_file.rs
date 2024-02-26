use std::fs;

use crate::errors::Error;

#[tauri::command]
pub async fn read_file(path: &str, encoding: &str) -> Result<String, Error> {
  let buffer = fs::read(path)?;

  let string = match encoding {
    "utf8" => String::from_utf8_lossy(&buffer).to_string(),
    // "utf16" => String::from_utf16_lossy(&buffer).to_string(),
    _ => String::from_utf8_lossy(&buffer).to_string(),
  };
  Ok(string)
}
