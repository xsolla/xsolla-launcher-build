# Launcher Start page


## Requirements


- Download and install node.js and npm(https://nodejs.org/en/download/).


-After installing use this command in project folder:
  

npm i
  


## Commands for building PromoPage:
  
  

#### Start nodeJs instance
npm start
  
  

#### build files in /build folder
  
npm run build
  
  

#### start node.js server for testing build files
  
npm run server-start
  
  

#### build and start server
  
npm run build-server
  
  

#### archive files in 7z on windows (generate 7-zip archive with PromoPage build in project folder. The name of archive is build.7z)
  
npm run build-archive-win
  
  

#### archive files in 7z on linux or mac (generate 7-zip archive with PromoPage build in project folder. The name of archive is build.7z)
  
npm run build-archive-linux
  


## Embedding page into Launcher
- Build page using commands above
- Upload archive with PromoPage on CDN

- Add next value in launcher/config.json:
   
"enable_home_page": true, (must be true for connecting homePage)
   
"home_page_res_link": "<link to your uploaded page on CDN>",
   
"home_page_debug_port": <port for page debugging (optional)>

- Last built PromoPage you can find here: https://s3.amazonaws.com/launcher-stuff/PromoPage/build_1_6_27_290.7z