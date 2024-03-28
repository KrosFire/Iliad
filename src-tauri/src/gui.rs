use std::sync::Mutex;

use tauri::{App, Manager};

use crate::{commands::state::{consts::{GlobalState, WindowState, WorkspaceState}, get_state::{read_saved_state, Store}}, errors};

pub fn handle_gui(app: &mut App) -> Result<(), errors::Error> {
  let handle = app.handle();

  let mut global_state = GlobalState::default();

  if let Ok(Store::Global(saved_global_state)) = read_saved_state("global", "") {
    global_state = saved_global_state;

    handle.manage(Mutex::new(global_state.clone()));
  }

  if let Ok(Store::Settings(settings_state)) = read_saved_state("settings", "") {
    handle.manage(Mutex::new(settings_state));
  }

  handle.manage(Mutex::new(WindowState {
      state: global_state.lastWorkspacePaths
          .iter()
          .map(|path| {
            let mut workspace_state = WorkspaceState::default();

            if let Ok(Store::Workspace(saved_workspace_state)) = read_saved_state("workspace", path) {
                workspace_state = saved_workspace_state
            }

            tauri::WindowBuilder::new(
                &handle,
                path.clone(), /* the unique window label */
                tauri::WindowUrl::App("index.html".into()),
            )
                .title(path.clone().split('/').last().unwrap())
                .build()
                .unwrap();

            (path.clone(), workspace_state)
          })
          .collect()
  }));

  Ok(())
}
