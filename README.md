[Documentation](https://developers.xsolla.com/doc/launcher) is for full Launcher integration.
[Wiki](https://github.com/xsolla/xsolla-launcher-build/wiki) is for getting details about Launcher releases.

## Repository Structure

Launcher updates are delivered via this repository that has the following folders:
* **launcher/win** — Launcher for Windows;
* **launcher/PromoPage** — Launcher start page;
* **portables/win** — 7zip archiver and a utility that creates the installer (Nullsoft Scriptable Install System);
* **scripts/win** — scripts to generate the archive and installer.

The **scripts/win/deploy.bat** script generates:
* a Launcher installer that you can send to new users,
* an archive including the Launcher build used to deliver updates to users.

## Steps to Integrate Launcher

1. Register an [Xsolla Publisher Account](https://publisher.xsolla.com) and create a project.
2. Set up Launcher in Publisher Account.
3. Clone this repository and specify values for required objects in **config.json**.
4. [Customize](https://developers.xsolla.com/doc/launcher/#guides_launcher_ui_customization) Launcher UI.
5. [Generate](https://developers.xsolla.com/doc/launcher/#guides_launcher_generate_archive_installation_file) a Launcher installation file and build archive.
6. [Upload](https://developers.xsolla.com/doc/launcher/#guides_launcher_builds_upload) the game build to the Xsolla update server.
7. Send the Launcher installation file to new users.

## Steps to Update Launcher

1. Download updates from this repository.
2. [Customize](https://developers.xsolla.com/doc/launcher/#guides_launcher_ui_customization) the updated Launcher part if needed.
3. Launch the **scripts/win/deploy.bat** script.
4. Upload the Launcher build archive to your Publisher Account so that updates are automatically delivered to users.

## Files to Be Customized

### config.json
Parameters required for Launcher configuration are represented as JSON objects in **launcher/win/config.json**.

**Object**               | **Description**                             
:------------------------|:-------------------------------------------------------------------
 launcher_project_id     | Launcher ID from Publisher Account. **Required.**
 login_project_id        | Login ID from Publisher Account. **Required.**  
 build_number            | Launcher build number. **Required.**  
 callback_url            | **Callback URL** from Login settings in Publisher Account. This URL is used to redirect the user after successful authentication via a social network.        
 product_name            | Launcher name in the **Start** menu. Duplicate the name in the **scripts/win/Install_scripts/XsollaInstaller.nsi** file of the repository in the **PRODUCT_NAME** parameter.        
 link_support            | Link to the game’s technical support website.        
 link_community          | Link to the game’s community.     
 default_p2p_enabled     | Whether a P2P network is used for game and update delivery. Can be ‘true’ and ‘false’. Default is ‘true’. A user can change this setting in the Launcher UI.
 game_autoupdate         | Whether the game is updated automatically. Can be ‘true’ and ‘false’. Default is ‘false’. A user can change this setting in the Launcher UI.     
 hide_peer_seed_info     | Whether a number of peers and seeds is displayed in Launcher during games and updates download. Can be ‘true’ and ‘false’. Default is ‘false’.
 hide_email              | Whether the user email is hidden in Launcher. Can be ‘true’ and ‘false’. Default is ‘false’. A user can change this setting in the Launcher UI.                                                            
 
 **Example**
 
 ```
{
  "launcher_project_id": "8c91ecf3-e7b0-46a8-aaf7-4c419ef8ef4b",
  "login_project_id": "bd2e1104-5494-48f9-ac50-98f230062df1", 
  "callback_url": "https://callback_url.com",
  "product_name": "Launcher",
  "link_support": "https://support_example.com",
  "link_community": "https://community_example.com",
  "default_p2p_enabled": true,
  "game_autoupdate": false,
  "hide_peer_seed_info": false,
  "hide_email": false,
  "build_number": 1
}
```

 ### UIStyle.json
All parameters required for Launcher UI customization are represented as JSON objects in **launcher/win/UIStyle.json**. An object may contain window element styles and/or nested objects.
 
 **Object**                                    | **Description**                             
:----------------------------------------------|:-------------------------------------------------------------------
 app_icon                                      | Launcher icon.
 main_window                                   | Main Launcher window.                       
 launcher_update_window                        | Launcher update window.                     
 redemption_window                             | Game key activation window.     
 settings_screen                               | Launcher settings window.                   
 settings_screen: license_window               | Section in the Launcher settings window, containing information about the license of the used libraries and tools.                                                                   
 change_username_window                        | Change username window.            
 disconnect_account_window                     | Window to disconnect a social account, used for authentication, from Launcher.                                                                   
 login_window                                  | Login Widget window.                      
 login_window: regions_combo_box               | Block to select a region for the game.               
 steam_login_window                            | Authorization window for game launch from Steam.                
 error_window                                  | Error window for non-critical errors such as wrong username/password.  
 error_report_window                           | Error window for criticial errors such as cannot load social links.      
 default_game_install_window                   | Game installation window with configuration parameters such as the installation folder, required disk space, etc.
 game_install_window                           | Game installation window with configuration parameters such as the installation folder, required disk space, etc. The object can be customized for each game using its project ID.              
 friends_window                                | Friends list window.                    
 friends_window: search_friend_window          | Search block in the Friends list window.     
 friends_window: search_text_field             | Text field to search friends by nickname or email.      
 connect_social_network_window                 | Window with the list of connected social profiles.     
 world_loading_window                          | Game world loading window.                       
 social_links_window                           | Window with links to social networks.               
 default_game_page                             | **Game** section.                 
 default_game_page: controll_button            | Button to install/update/launch the game.         
 game_page                                     | **Game** section. The object can be customized for each game using its project ID. See an example below.                         
 game_page: controll_button                    | Button to install/update/launch the game. The object can be customized for each game using its project ID. See an example below.                                                                 
 chars_window                                  | Window to select the character before the first launch.                     
 news_screen                                   | **News** section.                       
 store_screen                                  | **Store** section.                      
 store_window                                  | Game key purchase window.       
 banner_component                              | Banners section.                  
 ui_components: combobox                       | Combobox.                       
 ui_components: info_panel                     | Field with the banner title.
 ui_components: scrollbar                      | Scrollbar.                     
 ui_components: progressbar                    | Progress bar.                    
 ui_components: text_label                     | Text caption.                     
 ui_components: transparent_button             | Button with transparent background.            
 ui_components: transparent_textfield          | Text input field.          
 ui_components: window_buttons_bar             | System buttons.             
 ui_components: placeholder_image              | Background image to replace the main one, e.g., when loading an element.  
 ui_components: notification_window            | Notification window.         
 ui_components: shadow_window_background_image | Background image shadow.
 uninstall_window                              | Game uninstallation window.       
 fonts                                         | Fonts.    

 **Example**
 
 ```
"error_window": {
  "bg_color": "#313131",
  "text_color": "white",
  "bottom_line_color": "white"
},
"error_report_window": {
  "bg_color": "#313131",
  "header_text_color": "white",
  "error_text_color": "white",
  "send_error_text_color": "#80FFFFFF",
  "bottom_line_color": "white"
},
"game_page": [
  {
    "game_id": 4,
    "bg_game_image": "img/Backgrounds/game_screen_bg.jpg",
    "version_text_color": "#7FFFFFFF",
    "social_text_color": "#7FFFFFFF"
  },
  {
    "game_id": 6,
    "bg_game_image": "img/Backgrounds/div_background.jpg",
    "version_text_color": "#7FFFFFFF",
    "social_text_color": "#7FFFFFFF"
  }
]
```
**Note:** The code is self-describing, with object names directly referring to their purpose. For example, "version_text_color" refers to the color of the text indicating Launcher version.
