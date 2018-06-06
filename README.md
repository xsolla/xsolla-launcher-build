# Launcher
## Repository Structure

Launcher updates are delivered via this repository that has the following folders:
* **launcher/win** — Launcher;
* **portables/win** — 7zip archiver and a utility that creates the installer (Nullsoft Scriptable Install System);
* **scripts/win** — scripts to generate the archive and installer.

The **scripts/win/deploy.bat** script generates:
* a Launcher installer that you can send to new users,
* an archive including the Launcher build used to deliver updates to users.

## Setting up Launcher

1. Clone the Launcher from this repository.
2. In **config.json**, specify:
* `launcher_project_id`: Launcher ID from the Publisher Account;
* `login_project_id`: Login Widget ID from the Publisher Account;
* `game_local_info`: ID of game project you want to be delivered via Launcher, game name and path to the game’s image file.

Read the [documentation](https://developers.xsolla.com/doc/launcher/) for full Launcher integration.

## Updating Launcher

To get Launcher updates:
1. Download updates from the remote repository.
2. Customize the updated Launcher part if needed.
3. Increment the build version by one in **config.json > build_number**.
4. Launch **deploy.bat** by
  * double-clicking the script file - this will place the build in the cloned project folder > **target** subfolder,
  * from the command line prompt, using an additional `--out <directory> key`, where `directory` is your desired build installation path.
  
  **Example:** call deploy.bat --out C:/Target
  
5. Upload the Launcher build archive to your Publisher Account so that updates are automatically delivered to users.
