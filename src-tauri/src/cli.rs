use std::{collections::HashMap, fs, path::PathBuf, sync::Mutex};

use serde_json::Value;
use tauri::{App, AppHandle, Manager};

use crate::{commands::state::{consts::{WindowState, WorkspaceState}, get_state::{read_saved_state, Store}, update_state::save_state}, errors};

pub fn handle_cli(app: &App) -> Result<(), errors::Error> {
  let handle = app.handle();

  match app.get_cli_matches() {
    Ok(matches) => {
      if let Some(arg_data) = matches.args.get("open") {
        match &arg_data.value {
          Value::String(path) => {
            open(&handle, path)?;
          },
          _ => {
            panic!("argument of 'open' should be a path to project.");
          }
        }
      } else if let Some(arg_data) = matches.args.get("help") {
        let unescaped_str = arg_data.value.to_string()
          .replace("\\n", "\n")
          .replace("\\t", "\t");
        
        println!("{}", unescaped_str);
        handle.exit(0)
      }
    }
    Err(_) => {}
  }

  Ok(())
}

fn open(handle: &AppHandle, path: &str) -> Result<(), errors::Error> {
  let parsed_path = PathBuf::from(path);

  if !parsed_path.exists() {
    panic!("Path does not exist");
  }

  if !parsed_path.is_dir() {
    panic!("Path is not a directory");
  }

  let path = &parsed_path.canonicalize()
    .unwrap()
    .to_str()
    .unwrap()
    .to_string();

  let local_state = serde_json::from_str::<WorkspaceState>(
      &fs::read_to_string(
          parsed_path
                  .join(".illiade")
                  .join("workspace_config.json")
          )
          .unwrap_or(String::new())
      )
      .unwrap_or(WorkspaceState::default());
  
  let mut state = HashMap::new();

  state.insert(path.clone(), local_state);

  handle.manage(Mutex::new(WindowState {
      state,
  }));

  if let Ok(Store::Settings(settings_state)) = read_saved_state("settings", path) {
    handle.manage(Mutex::new(settings_state));
  }

  let store = read_saved_state("global", path)?;

  if let Store::Global(global_state) = store {
    let mut global_state = global_state.clone();
    global_state.lastWorkspacePaths = vec![path.clone()];

    save_state(
        "global",
        &serde_json::to_string(&global_state)?,
        &path
    )?;

    handle.manage(Mutex::new(global_state));
  } else {
    return Err(errors::Error::GeneralError("Could not read saved global state".to_string()))
  }

  tauri::WindowBuilder::new(
      handle,
      path.clone(), /* the unique window label */
      tauri::WindowUrl::App("index.html".into()),
  )
      .title(path.clone().split('/').last().unwrap())
      .build()
      .unwrap();

  return Ok(())
}
