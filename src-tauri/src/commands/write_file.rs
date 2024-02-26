use std::fs;

use crate::errors::Error;

#[tauri::command]
pub async fn write_file(path: &str, contents: &str, encoding: &str) -> Result<(), Error> {
  match encoding {
    "utf8" => {
      let buffer = contents.as_bytes().to_vec();

      fs::write
        (path, buffer)
        .map_err(Into::into)
        .map(|_| ())
    },
    _ => {
      let buffer = contents.as_bytes().to_vec();

      fs::write
        (path, buffer)
        .map_err(Into::into)
        .map(|_| ())
    }
  }
}
