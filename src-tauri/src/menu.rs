use tauri::{
    api, AboutMetadata, CustomMenuItem, Manager, Menu, MenuItem, Submenu, WindowMenuEvent,
};

pub fn init() -> Menu {
    let metadata = AboutMetadata::new()
        .authors(vec!["Hubert Jabłoński".to_string()])
        .license("MIT")
        .version("0.1.0");

    Menu::new()
        .add_submenu(Submenu::new(
            "Illiade",
            Menu::new()
                .add_native_item(MenuItem::About("Illiade".to_string(), metadata))
                .add_item(CustomMenuItem::new("settings", "Settings..."))
                .add_native_item(MenuItem::Separator)
                .add_item(CustomMenuItem::new("restart", "Restart"))
                .add_native_item(MenuItem::Quit),
        ))
        .add_submenu(Submenu::new(
            "File",
            Menu::new()
                .add_item(CustomMenuItem::new("new_file", "New File"))
                .add_native_item(MenuItem::Separator)
                .add_item(CustomMenuItem::new("open_file", "Open File"))
                .add_item(CustomMenuItem::new("open_folder", "Open Folder"))
                .add_item(CustomMenuItem::new("save_file", "Save File"))
                .add_native_item(MenuItem::Separator)
                .add_item(CustomMenuItem::new("close_tab", "Close Tab"))
                .add_item(CustomMenuItem::new("close_window", "Close Window")),
        ))
        .add_submenu(Submenu::new(
            "Edit",
            Menu::new()
                .add_native_item(MenuItem::Undo)
                .add_native_item(MenuItem::Cut)
                .add_native_item(MenuItem::Copy)
                .add_native_item(MenuItem::Paste)
                .add_native_item(MenuItem::SelectAll),
        ))
        .add_submenu(Submenu::new(
            "View",
            Menu::new()
                .add_item(CustomMenuItem::new("zoom_in", "Zoom In"))
                .add_item(CustomMenuItem::new("zoom_out", "Zoom Out"))
                .add_item(CustomMenuItem::new("reset_zoom", "Reset Zoom"))
                .add_native_item(MenuItem::Minimize),
        ))
        .add_submenu(Submenu::new(
            "Help",
            Menu::new()
                .add_item(CustomMenuItem::new("docs", "Documentation"))
                .add_item(CustomMenuItem::new("report_issue", "Report Issue")),
        ))
}

pub fn menu_event_handler(event: WindowMenuEvent) {
    match event.menu_item_id() {
        "docs" => {
            api::shell::open(&event.window().shell_scope(), "https://example.com", None)
                .expect("failed to open the link");
        }
        "report_issue" => {
            api::shell::open(
                &event.window().shell_scope(),
                "https://github.com/KrosFire/Illiade/issues",
                None,
            )
            .expect("failed to open the link");
        }
        "restart" => {
            api::process::restart(&event.window().env())
        }
        _ => {}
    }
}
