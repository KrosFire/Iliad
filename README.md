# Iliad

<img src="./public/logo.png" alt="Iliad logo" width="250px" />

An IDE build on [Tauri](https://tauri.app/) with [Rust](https://www.rust-lang.org/) and [Vue](https://vuejs.org/). Powered by [Ace Editor](https://ace.c9.io/).

## Install

### Prerequisites

* [Node](https://nodejs.org/en) installed
* [Typescript LSP](https://github.com/typescript-language-server/typescript-language-server) installed

### Installing Iliad

Download latest [release](https://github.com/KrosFire/Iliad/releases) avaliable for:

* MacOS
* Windows

Iliad comes with a basic CLI for easy navigation. To use it add alias to your command line for executable.

MacOS:

```sh
echo "alias ill=\"[path to Iliad program]\"" >> [path to terminal config file]
```

Windows:

1. Create a `.bat` or `.cmd` file:
```bat
@echo off

DOSKEY ill="[Path to Iliad executable]"
```
2. Run regedit and go to (Win 10/11) `HKEY_LOCAL_MACHINE\SOFTWARE\Microsoft\Command Processor`
3. Add String Value entry with the name AutoRun and the full path of your .bat/.cmd file.

## Features

* Syntax highlighting for 164 languages
* Search file
* Drag And Drop folders and files
* Rearrange tabs
* Resizable customizable windows system
* CLI
* Files synchronization
* Persistent state
* File system manipulation (rename, delete files and folders)
* LSP for TypeScript
