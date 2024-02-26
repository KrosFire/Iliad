use std::collections::HashMap;

use serde::{Deserialize, Serialize};
use tauri::api::path::home_dir;

pub type Nullable<T> = Option<T>;

#[derive(Debug, Deserialize, Serialize, Clone)]
#[allow(non_snake_case)]
pub struct GlobalState {
  pub lastWorkspacePaths: Vec<String>,
}

impl Default for GlobalState {
  fn default() -> Self {
    Self {
      lastWorkspacePaths: vec![home_dir().unwrap().to_str().unwrap().to_string()],
    }
  }
}

#[derive(Debug, Deserialize, Serialize, Clone)]
#[allow(non_snake_case)]
pub struct File {
  pub id: String,
  pub path: String,
  pub title: String,
  pub dir: String,
  pub lang: Nullable<String>,
  pub encoding: String,
  pub editorContent: String,
  pub removed: bool,
  pub saved: bool,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
#[allow(non_snake_case)]
pub struct FileSystem {
  pub path: String,
  pub name: String,
  pub parent: String,
  pub open: bool,
  pub openedChildren: Vec<FileSystem>
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub enum FileSystemType {
  FileSystemFile,
  FileSystemDirectory
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct SelectedFsNode {
  __typename: FileSystemType,
  path: String,
  mass: Nullable<bool>
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub enum TabsWindowType {
  TabsWindow
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub enum ContainerWindowType {
  ContainerWindow
}

#[derive(Debug, Deserialize, Serialize, Clone)]
#[allow(non_camel_case_types)]
pub enum Direction {
  vertical,
  horizontal,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct ContainerWindow {
  __typename: ContainerWindowType,
  id: String,
  children: Vec<String>,
  parent: Nullable<String>,
  direction: Direction
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub enum TabType {
  FileTab,
  PageTab,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct Tab {
  __typename: TabType,
  id: String,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct TabsWindow {
  __typename: TabsWindowType,
  id: String,
  tabs: Vec<Tab>,
  parent: Nullable<String>,
  active: u32,
}

#[derive(Debug, Deserialize, Serialize, Clone)]
#[serde(untagged)]
pub enum Window {
  ContainerWindow(ContainerWindow),
  TabsWindow(TabsWindow),
}

#[derive(Debug, Deserialize, Serialize, Clone)]
#[allow(non_snake_case)]
pub struct LocalState {
  pub workspace: Nullable<String>,
  pub files: HashMap<String, File>,
  pub windows: HashMap<String, Window>,
  pub active: Nullable<String>,
  pub fileSystem: Nullable<FileSystem>,
  pub selectedFsNodes: Vec<SelectedFsNode>,
  pub lastSelectedFsNode: Nullable<String>,
}

impl Default for LocalState {
  fn default() -> Self {
    Self {
      workspace: None,
      files: HashMap::new(),
      windows: HashMap::new(),
      active: None,
      fileSystem: None,
      selectedFsNodes: vec![],
      lastSelectedFsNode: None,
    }
  }
}

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct WindowState {
  pub state: HashMap<String, LocalState>,
}
