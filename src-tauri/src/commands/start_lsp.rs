use std::{
    io::{BufRead, BufReader, Read, Write}, os::unix::process, process::{ChildStdout, Stdio}, sync::{Arc, Mutex}, vec
};

use crate::errors;

#[tauri::command]
pub async fn start_lsp(window: tauri::Window, language_id: &str) -> Result<(), errors::Error> {
    println!("Starting LSP for: {}", language_id);

    match language_id {
        "typescript" => {
            launch_lsp(
                "typescript-language-server",
                vec!["--stdio"],
                window,
                language_id.to_string(),
            )?;
        }
        "javascript" => {
            launch_lsp(
                "typescript-language-server",
                vec!["--stdio"],
                window,
                language_id.to_string(),
            )?;
        }
        _ => return Err(errors::Error::LspNotSupported),
    }

    Ok(())
}

#[derive(serde::Deserialize, serde::Serialize, Debug)]
#[serde(untagged)]
enum RequestId {
    Number(u64),
    String(String),
}

#[derive(serde::Deserialize, serde::Serialize, Debug)]
struct RequestMessage {
  id: RequestId,
  method: String,
  params: Option<serde_json::Value>,
}

#[derive(serde::Deserialize, serde::Serialize, Debug)]
struct NotificationMessage {
  method: String,
  params: Option<serde_json::Value>,
}

#[derive(serde::Deserialize, serde::Serialize, Debug)]
#[serde(untagged)]
enum Message {
  Request(RequestMessage),
  Notification(NotificationMessage)
}

#[derive(serde::Deserialize, Debug)]
#[allow(non_snake_case)]
struct LspMessageSend {
    languageId: String,
    message: Message,
}

#[derive(serde::Deserialize, serde::Serialize, Clone, Debug)]
#[allow(non_snake_case)]
struct LspServerStartedMsg {
  languageId: String,
  parentProcessId: u32
}

fn launch_lsp(
    command: &str,
    args: Vec<&str>,
    window: tauri::Window,
    language_id: String,
) -> Result<(), errors::Error> {
    let command = command.to_string();
    let args = args.iter().map(|s| s.to_string()).collect::<Vec<String>>();

    std::thread::spawn(move || {
        let mut child = std::process::Command::new(command.clone())
            .args(args)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .spawn()
            .unwrap();

        println!("Started process: {}", child.id());

        let stdin = child.stdin.take().expect("Failed to open stdin");
        let stdout = child.stdout.take().expect("Failed to open stdout");

        let stdout = Arc::new(Mutex::new(stdout));
        let stdin = Arc::new(Mutex::new(stdin));

        let language_id_1 = language_id.clone();

        let window_ = window.clone();
        window.listen("lsp_msg_send", move |event| {
          let language_id = language_id_1.clone();

          let payload = serde_json::from_str::<LspMessageSend>(event.payload().unwrap()).unwrap();
          
          if payload.languageId != language_id {
              return;
          }
      
          let mut stdin = stdin.lock().unwrap();
      
          let msg = serde_json::to_string(&payload.message).unwrap();
          let msg = msg.as_bytes();
      
          if let Err(_) = stdin.write_all(format!("Content-Length: {}\r\n\r\n", msg.len()).as_bytes()) {
            println!("Error writing to stdin");
            window_.unlisten(event.id());
            window_.emit("lsp_server_dead", language_id).unwrap();
            return;
          }
          stdin.write_all(msg).unwrap();
        });

        let payload = LspServerStartedMsg {
          parentProcessId: process::parent_id(),
          languageId: language_id,
        };

        window.emit("lsp_server_started", payload).unwrap();

        handle_server_response(window, stdout);
    });

    Ok(())
}

fn handle_server_response(window: tauri::Window, stdout: Arc<Mutex<ChildStdout>>) {
  std::thread::spawn(move || {
    loop {
      let mut stdout = stdout.lock().unwrap();
      let stdout = stdout.by_ref();

      let mut reader = BufReader::new(stdout);

      let mut content_length = String::new();

      match reader.read_line(&mut content_length) {
          Ok(0) => {
              println!("EOF");
              break;
          }
          Ok(_) => {}
          Err(_) => {
              println!("Error reading line");
              break;
          }
      }

      loop {
        let mut line = String::new();

        match reader.read_line(&mut line) {
            Ok(0) => {
                println!("EOF");
                return;
            }
            Ok(_) => {
                if line == "\r\n" {
                  break;
                }
            }
            Err(_) => {
                println!("Error reading line");
                return;
            }
        }
      }


      let content_length = content_length.trim()[16..].parse::<usize>().unwrap();
      let mut content = vec![0; content_length];

      reader.read_exact(&mut content).unwrap();

      let line = String::from_utf8_lossy(&content).to_string();

      window.emit("lsp_msg_received", serde_json::from_str::<serde_json::Value>(&line).unwrap()).unwrap();
  }
  });
}
