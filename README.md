[Documentation](https://developers.xsolla.com/doc/launcher) is for full Launcher integration.

[Wiki](https://github.com/xsolla/xsolla-launcher-build/wiki) is for getting details about Launcher releases.

## Table of Contents

1. [Repository Structure](#repository-structure)
2. [Steps to Integrate Launcher](#steps-to-integrate-launcher)
3. [Steps to Update Launcher](#steps-to-update-launcher)

## Repository Structure

Launcher updates are delivered via this repository that has the following folders:
* **launcher/win** — Launcher for Windows;
* **launcher/PromoPage** — [Launcher start page](https://docs.google.com/document/d/1YuVftxN4efURR1ZnUJCjCoxx6skazaXRzVRbz2cLIVc/edit#heading=h.t0ksoifvtzar);
* **portables/win** — 7zip archiver and a utility that creates the installer (Nullsoft Scriptable Install System);
* **scripts/win** — scripts to generate the archive and installer.

The **scripts/win/deploy.bat** script generates:
* a Launcher installer that you can send to new users,
* an archive including the Launcher build used to deliver updates to users.

## Steps to Integrate Launcher

1. Register an [Xsolla Publisher Account](https://publisher.xsolla.com) and create a project.
2. Create the Launcher instance in Publisher Account.
3. Clone this repository.
4. [Make](#making-launcher-configuration) Launcher main configuration.
5. [Customize](#customizing-launcher-ui) Launcher UI.
6. [Generate](https://developers.xsolla.com/doc/launcher/#guides_launcher_generate_archive_installation_file) a Launcher installation file and build archive.
7. [Upload](https://developers.xsolla.com/doc/launcher/#guides_launcher_builds_upload) the game build to the Xsolla update server.
8. Send the Launcher installation file to new users and upload the build archive to your Publisher Account > Launcher settings > **General settings > Customiza Launcher**.

### Making Launcher Configuration

Parameters for Launcher configuration are represented as JSON objects in **launcher/win/config.json**.

#### Required Objects

**Object**               | **Description**                             
:------------------------|:-------------------------------------------------------------------
 launcher_project_id     | Launcher ID from Publisher Account. **Required.**
 login_project_id        | ID of Login connected to your Launcher in Publisher Account. **Required.** 
 build_number	           | Launcher build number. The value is generated automatically since version 1.6.32.320. **Required.** 
 use_local_config        | Whether to use the [local_theme.json](#local_themejson-for-v170-and-higher) file to customize Launcher UI. Can be ‘true’ or ‘false’. Must be ‘true’ for Xsolla Launcher v1.7.0 and higher. 
 callback_url            | **Callback URL** from Login settings in Publisher Account. This URL is used to redirect the user after successful authentication via a social network. **Required** if there are several Callback URLs added in Login settings in Publisher Account.        
 product_name            | Launcher name in the **Start** menu. Duplicate the name in the **scripts/win/Install_scripts/XsollaInstaller.nsi** file of the repository in the **PRODUCT_NAME** parameter. The parameter is not used since version 1.7.1, please, specify the name from your Publisher Account settings in the **scripts/win/Install_scripts/XsollaInstaller.nsi** file of the repository in the **PRODUCT_NAME** parameter.         
 link_support            | Link to the game’s technical support website.        
 link_community          | Link to the game’s community.     
 game_autoupdate         | Whether the game is updated automatically. Can be ‘true’ and ‘false’. Default is ‘false’. A user can change this setting in the Launcher UI.     
 hide_peer_seed_info     | Whether a number of peers and seeds is displayed in Launcher during games and updates download. Can be ‘true’ and ‘false’. Default is ‘false’.
 hide_email              | Whether the user email is hidden in Launcher. Can be ‘true’ and ‘false’. Default is ‘false’. A user can change this setting in the Launcher UI.                                                            
 
<details><summary>Example</summary>
 
 ```
{
  "launcher_project_id": "8c91ecf3-e7b0-46a8-aaf7-4c419ef8ef4b",
  "login_project_id": "bd2e1104-5494-48f9-ac50-98f230062df1", 
  "use_local_config": true,
  "callback_url": "https://callback_url.com",
  "product_name": "Launcher",
  "link_support": "https://support_example.com",
  "link_community": "https://community_example.com",
  "game_autoupdate": false,
  "hide_peer_seed_info": false,
  "hide_email": false,
  "build_number": 1
}
```
</details>

#### Optional Objects

Optional object in **config.json** are used to perform extended Launcher settings.

**Object**               | **Description**                             
:------------------------|:-------------------------------------------------------------------
 store                   | An array of objects to customize Launcher in-game Store. 
 store:id | 	Project ID in Publisher Account.
 store:theme | Store color theme. Can be 'default' and 'dark'. Default is 'dark'.
 store:size | Element size in Store. Can be 'small', 'medium', and 'large'. Default is 'large'.
 store:view | Element location in Store (horizontal or vertical menu). Can be 'vertical_navigation' and 'horizontal_navigation'. Default is 'horizontal_navigation'.
 GA_trackingId        | Google Analytics tracking code. See the [recipe](https://developers.xsolla.com/recipes/launcher/game-analytics/).          
 steam_app_id | Steam app ID. See the [recipe](https://developers.xsolla.com/recipes/launcher/cross-authentication/#recipes_cross_authentication_steam).
 stone_app_id | Stone app ID. See the [recipe](https://developers.xsolla.com/recipes/launcher/cross-authentication/#recipes_cross_authentication_stone).
 create_account_link |	URL to redirect the user after successful registration.
restore_password_link |	URL to redirect the user to after successful password recovery.
is_username_email |	Whether to show the *Email* or the *Username* placeholder during authentication in Launcher. Can be ‘true’ (to show *Email*) and ‘false’ (to show *Username*). Default is ‘true’.
default_news_tab | Whether to show news from all the games (‘all’) or from a particular one. To show news from a particular game, specify the project ID from Publisher Account.
always_open_default_news_tab | Whether to always show news set up in the default_news_tab object. If ‘true’, the news are displayed as specified in the default_news_tab object. If ‘false’, the news are displayed as specified in "default_news_tab" object only for the first opening, and then each game shows its own news. Default is ‘false’.
cdn_try_load_count	| Number of attempts to download the game file.
cdn_network_timeout	| Wait time between the download attempts (in milliseconds). Recommended ‘30000‘. Must be used in pair with "cdn_block_size".
cdn_block_size|Bytes in swap buffer. Default ‘1048576‘. Must be used in pair with "cdn_network_timeout".
enable_locate_button | Whether to show the *Locate the game* button for game searching. Can be ‘true‘ or ‘false‘. ‘true‘ by default. 
check_update_interval | The interval for checking game updates availability in milliseconds. Default is ‘10800000’.
games_directory   | The name of the games directory folder, for example: *C:/{games_directory}/LauncherName/GameName/*. The folder will be created on the disk selected by a user and will contain files of all installed games from Launcher. Default is ‘Games‘.

<details><summary>Example</summary>
 
 ```
{
  "store": { "id" : 12345, "theme" : "default", "size" : "large", "view" : "horizontal_navigation" },
  "GA_trackingId": "UA-111111111-1",
  "steam_app_id": 123,
  "stone_app_id": 129,
  "create_account_link": "https://coolgame.com/create_account",
  "restore_password_link": "https://coolgame.com/restore_pass",
  "is_username_email": true,
  "default_news_tab": 65784,
  "always_open_default_news_tab": true,
  "cdn_try_load_count": 3,
  "cdn_network_timeout": 30000,
  "enable_locate_button": true,
  "check_update_interval": 10800000,
  "games_directory": "Games"
}
```
</details>

### Customizing Launcher UI

The **UIStyle.json** file is used to customize the UI of Xsolla Launcher v1.6.38.365 and earlier. If you updated Xsolla Launcher to v1.7.0 or higher, use the **local_theme.json** file for UI customization settings.

#### UIStyle.json for v1.6.38.365 and Earlier

All parameters required for Launcher UI customization are represented as JSON objects in **launcher/win/UIStyle.json**. An object may contain window element styles and/or nested objects.

The code is self-describing, with object names directly referring to their purpose. For example, ```version_text_color``` refers to the color of the text indicating Launcher version.

<details><summary>Objects and examples</summary>

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
 login_window                                  | Background image of the Login Widget window.                      
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
</details>

#### local_theme.json for v1.7.0 and Higher

This file is temporary. It will be used until Launcher UI setup becomes available via Xsolla Publisher Account.

>**Note:** If the **UIStyle.json** file was used previously, you need to replace settings to **local_theme.json** and adapt them as described below.

All parameters required for Launcher UI customization are represented as JSON objects and divided into general Launcher styles (```general_styles```) and game specific styles (```game_specific_styles```).

<details><summary>Objects and examples</summary>
 
 ```general_styles```

**Object**                                     | **Description**                             
:----------------------------------------------|:-------------------------------------------------------------------
start_page_bg                                 | The path to the image used as a background for the Launcher start page. Should be placed in the **launcher/win/img** folder. If the value is empty, ```primary_background_color``` is used instead. Other start page customization and content settings are performed in Publisher Account > **Launcher settings > Project setup > Project modules**.
primary_background_color                       | The color of the Launcher background. Must be in the RGBA format.
secondary_background_color                     | The color of the Launcher menu, buttons (cancellation and reset buttons) and input fields background. Must be in the RGBA format.
primary_text_color                             | The color of most of the texts in Launcher windows excluding button texts. Must be in the RGBA format.
secondary_text_color                           | The color of titles in Launcher. Must be in the RGBA format.
links_color                                    | Accent texts & links color. Must be in the RGBA format.
primary_button_bg                              | The color of the primary button background (confirmation buttons). Must be in the RGBA format.
primary_button_text                            | The color of the text on primary buttons (confirmation) buttons. Must be in the RGBA format. 
secondary_button_bg	                           | The color of the border and text on secondary buttons (cancellation and reset).

```game_specific_styles```

**Object**                                     | **Description**                             
:----------------------------------------------|:-------------------------------------------------------------------
game_id                                        | ID of the game added to Launcher. You can find it in Publisher Account > **Launcher settings > Project setup**.
game_layout_image                              | The path to the image used as the background for the game page. Should be placed in the **launcher/win/img** folder. If the value is empty, "primary_background_color" is used instead.
primary_button_bg                              | The color of the button to install/update/buy/launch the game. Must be in the RGBA format.
primary_button_text                            | The color of the text on the button to install/update/buy/launch the game. Must be in the RGBA format.
store_size                                     | Element size in Store. Can be 'small', 'medium', and 'large'. Default is 'large'.
store_view                                     | Element location in Store (horizontal or vertical menu). Can be 'vertical_navigation' and 'horizontal_navigation'. Default is 'horizontal_navigation'.
store_theme                                    |Store color theme. Can be 'default' and 'dark'. Default is 'dark’.

```
{
  "general_styles": {
    "start_page_bg": "img/BackGrounds/game1.png",
    "primary_background_color": "rgba(54, 57, 63, 1)",
    "secondary_background_color": "rgba(0, 0, 0, 0.2)",
    "primary_text_color": "rgba(255, 255, 255, 1)",
    "secondary_text_color": "rgba(255, 255, 255, 0.6)",
    "links_color": "rgba(255, 255, 255, 1)",
    "primary_button_bg": "rgba(0, 199, 126, 1)",
    "primary_button_text": "rgba(255, 255, 255, 1)",
    "secondary_button_bg": "rgba(160, 171, 184, 1)"
  },
  "game_specific_styles": [
    {
      "game_id": 29235,
      "game_layout_image": "",
      "primary_button_bg": "rgba(0, 199, 126, 1)",
      "primary_button_text": "rgba(255, 255, 255, 1)",
      "store_size": "large",
      "store_view": "horizontal_navigation",
      "store_theme": "dark"
    },
    {
      "game_id": 29236,
      "game_layout_image": "",
      "primary_button_bg": "rgba(0, 199, 126, 1)",
      "primary_button_text": "rgba(255, 255, 255, 1)",
      "store_size": "large",
      "store_view": "horizontal_navigation",
      "store_theme": "dark"
    }
  ]
}
```
After you complete settings in the **local_theme.json** file, please [generate](https://developers.xsolla.com/doc/launcher/#guides_launcher_generate_archive_installation_file) a new Xsolla Launcher installer to apply changes and test it locally.
</details>

#### Changing the Launcher Icon

The icon for Launcher and the installer is located in:

* the **img** folder for v1.6.38.365 and earlier.
* the root folder for v1.7.0 and higher

To change the icon, please replace the current image saving its name.

## Steps to Update Launcher

1. Download updates from this repository.
2. [Customize](#customizing-launcher-ui) the updated Launcher part if needed.
3. Launch the **scripts/win/deploy.bat** script.
4. Upload the Launcher build archive to your Publisher Account > Launcher settings > **General settings > Customiza Launcher** so that updates are automatically delivered to users.
