use std::sync::PoisonError;

#[derive(Debug, thiserror::Error)]
pub enum Error {
  #[error(transparent)]
  Io(#[from] std::io::Error),

  #[error("the mutex was poisoned")]
  PoisonError(String),

  #[error("json error: {0}")]
  JsonError(serde_json::Error),

  #[error("general error: {0}")]
  GeneralError(String),

  #[error("lsp not supported")]
  LspNotSupported,
}

impl serde::Serialize for Error {
  fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
  where
    S: serde::ser::Serializer,
  {
    serializer.serialize_str(self.to_string().as_ref())
  }
}

impl<T> From<PoisonError<T>> for Error {
  fn from(err: PoisonError<T>) -> Self {
    // We "just" convert the error to a string here
    Error::PoisonError(err.to_string())
  }
}

impl From<&str> for Error {
  fn from(err: &str) -> Self {
    Error::GeneralError(err.to_string())
  }
}

impl From<serde_json::Error> for Error {
  fn from(err: serde_json::Error) -> Self {
    Error::JsonError(err)
  }
}

impl From<tauri::Error> for Error {
  fn from(err: tauri::Error) -> Self {
    Error::GeneralError(err.to_string())
  }
}
