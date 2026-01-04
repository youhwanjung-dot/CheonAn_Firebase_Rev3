#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::{self, copy};
use tauri::Manager;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle();
            let app_data_dir = handle
                .path_resolver()
                .app_data_dir()
                .expect("Failed to get app data directory. This is a critical error.");

            let roaming_dir = app_data_dir.parent().expect("Failed to get parent of app_data_dir.");
            
            let target_dir = roaming_dir.join("CheonanInventory");
            let target_db_path = target_dir.join("database.json");

            if !target_dir.exists() {
                fs::create_dir_all(&target_dir)
                    .expect("Failed to create target data directory.");
            }

            if !target_db_path.exists() {
                // Correctly reference the resource with its simplified name after packaging.
                if let Some(resource_path) = handle.path_resolver().resolve_resource("database.json") {
                    copy(&resource_path, &target_db_path)
                        .expect(&format!("Failed to copy database from {:?} to {:?}", resource_path, target_db_path));
                } else {
                    // Provide a more informative panic message.
                    panic!("Resource 'database.json' not found. Check `tauri.conf.json` `resources` field and ensure the file is in the `public` directory.");
                }
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
