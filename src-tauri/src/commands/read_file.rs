use std::fs;

#[tauri::command]
pub async fn read_file(path: &str, encoding: &str) -> Result<String, String> {
  let buffer = fs::read(path)
    .map_err(|e| e.to_string());

  match buffer {
    Ok(buffer) => {
      let string = match encoding {
        "utf8" => String::from_utf8_lossy(&buffer).unwrap(),
        "utf16" => String::from_utf16_lossy(&buffer).to_string(),
        _ => String::from_utf8_lossy(&buffer).to_string(),
      };
      Ok(string)
    },
    Err(e) => Err(e),
  }
}
