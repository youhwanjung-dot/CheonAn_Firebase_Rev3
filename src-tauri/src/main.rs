#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::{self, copy};
use std::path::PathBuf;
use tauri::Manager;

fn main() {
    /*  // Original main function
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    */

    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle();
            let app_data_dir = handle
                .path_resolver()
                .app_data_dir()
                .expect("Failed to get app data directory. This is a critical error.");

            let target_dir = app_data_dir.join("CheonanInventory");
            let target_db_path = target_dir.join("database.json");

            if !target_dir.exists() {
                fs::create_dir_all(&target_dir)
                    .expect("Failed to create target data directory.");
            }

            if !target_db_path.exists() {
                let resource_path_option = handle
                    .path_resolver()
                    .resolve_resource("../public/database.json") // Adjusted path to be relative to src-tauri
                    .expect("Failed to resolve resource. Check if '../public/database.json' is in tauri.conf.json resources.");
                
                if let Some(path) = resource_path_option {
                     copy(&path, &target_db_path)
                        .expect(&format!("Failed to copy database from {:?} to {:?}", path, target_db_path));
                } else {
                    panic!("Resource '../public/database.json' not found in the bundle.");
                }
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
