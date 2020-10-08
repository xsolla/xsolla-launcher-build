!define PRODUCT_NAME "Xsolla_launcher" ;Launcher name in the Start menu. The value must be duplicated in the "product_name" parameter in the launcher/win/config.json file. 
!define PRODUCT_PUBLISHER "Xsolla"
!define PRODUCT_VERSION "" ;Version shown in the Launcher installer window. 
!define PRODUCT_WEB_SITE "xsolla.com" ;Game URL opened from the shortcut in the Start menu. 
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\${PRODUCT_NAME}"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"
!define LAUNCHER_REGKEY "${PRODUCT_NAME}_XsollaLauncher"

!define EXE_FILE_NAME "Xsolla_Launcher.exe" ; Name of temporary downloaded file. 
!define BIG_LAUNCHER_URL "PUT URL HERE"
;--------------------------------
; General Attributes
Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "bin\Xsolla_Launcher_web_installer.exe" ; Launcher installer name.
InstallDir "$LOCALAPPDATA\${PRODUCT_NAME}" ; Default directory for Launcher installation.
InstallDirRegKey HKLM "${PRODUCT_DIR_REGKEY}" ""
ShowInstDetails show
ShowUnInstDetails show
RequestExecutionLevel admin
SpaceTexts none ; We dont know how much disk space big installer requires. Otherwise, 0.0 KB will be displayed on directory page.

!include LogicLib.nsh ; Ability to use simple if
;--------------------------------
; MUI Settings
; Macrs for putting image into header
!macro BIMAGE IMAGE PARMS
	Push $0
	GetTempFileName $0
	File /oname=$0 "${IMAGE}"
	SetBrandingImage ${PARMS} $0
	Delete $0
	Pop $0
!macroend

AddBrandingImage top 200 50
!include "MUI2.nsh"
!define MUI_ABORTWARNING
!define MUI_ICON "launcherIcon.ico"
!define MUI_UNICON "${NSISDIR}\Contrib\Graphics\Icons\modern-uninstall.ico"

; Note: all images has to be in installer_images folder. installer_images folder is right next to this file. All images has to be saved as .bmp.
; !define MUI_HEADERIMAGE ; Uncomment this lane if you want to customize header images on Directory and InstallFiles pages. 
; Also, you need to uncomment following functions in order to change default images: DirectoryPageShow and InstPageShow
; !define MUI_WELCOMEFINISHPAGE_BITMAP "finish_image.bmp" ; Uncomment this line if you want to customize image on finish page. Unlike Directoty and Install pages, Finish page don't need additional function. Image has to be 164x314 px to fit without resize.
!define MUI_LANGDLL_REGISTRY_ROOT "${PRODUCT_UNINST_ROOT_KEY}"
!define MUI_LANGDLL_REGISTRY_KEY "${PRODUCT_UNINST_KEY}"
!define MUI_LANGDLL_REGISTRY_VALUENAME "NSIS:Language"

; Directory page
!define MUI_PAGE_CUSTOMFUNCTION_SHOW DirectoryPageShow
!define MUI_PAGE_CUSTOMFUNCTION_LEAVE "DirectoryLeave"
!insertmacro MUI_PAGE_DIRECTORY
; Instfiles page
!define MUI_PAGE_CUSTOMFUNCTION_SHOW InstPageShow
!insertmacro MUI_PAGE_INSTFILES
; Finish page
!define MUI_FINISHPAGE_RUN "$INSTDIR\launcher.exe"
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_LANGUAGE "English"

;--------------------------------
;Installer Sections
Section ; InstallSection
  ; Disale detail log to clear space for download progressbar
  ; Downoad big launcher 
  ; /resume allows an user to restart the download if it was interrupted
  DetailPrint "Download launcher files..."
  SetDetailsView hide
  inetc::get /resume "" /caption "Download launcher files..." "${BIG_LAUNCHER_URL}" "$TEMP\${EXE_FILE_NAME}" /end 
  ; Get download status
  Pop $0 # "OK" means OK
  SetDetailsView show
  SetDetailsPrint both
  DetailPrint "Launcher files download completed"

  ;MessageBox MB_OK "Download Status: $0" ; test
  ${If} $0 == "Cancelled" ; User did cancel setup
    DetailPrint "Install is cancelled."
    goto fail
  ${EndIf}
  ${If} $0 != "OK" ; If download error happened
    DetailPrint "Install error: download finished with an error: $0"
    goto fail
  ${Else} ; No error, good to go
    DetailPrint "Unpacking launcher files..."
    ${If} ${FileExists} "$TEMP\${EXE_FILE_NAME}" ; Even if we dont have a download error make sure the file exists
        ExecDos::exec /detailed "$TEMP\${EXE_FILE_NAME} /S /D=$INSTDIR" ; Exec a big installer and get its stdout to our details field. But I didn't find a way to make the big installer write details to stdout instead details field. And now I'm making out my own messages. Maybe sometime we will solve this issue.
        ; /S - silence mode
        ; /D - default install directory. The user cannot to change it because installer runs in silence mode. 
        Pop $0 # The big installer's exit code.
        ${If} $0 != 0
            ${If} $0 = 2 ; Code 2 is easy, it means user doesn't have enough disk space.
                DetailPrint "Install error. Please, check if you have enough free space on your disk. "
            ${Else} 
                DetailPrint "Install error: could not to unpack launcher files, error code: $0"
            ${EndIf}
            goto fail
        ${EndIf}
    ${Else}
        DetailPrint "Install error: could not to find launcher archive." 
    ${EndIf}
  ${EndIf}

  SetOutPath "$INSTDIR" ; We have to set OutPath to instdir or launcher will crash on start from finish page
  goto success
  fail:
    Call CleanTempExe
    Abort
  success:
    Call CleanTempExe
SectionEnd

;--------------------------------
; Installer Functions

Function .onInit
  !insertmacro MUI_LANGDLL_DISPLAY
FunctionEnd

;--------------------------------
; Page  Functions

Function DirectoryPageShow
; !ifdef MUI_HEADERIMAGE
;     !insertmacro BIMAGE "directory_page_header.bmp" "" ; The image must be 57 pixels high. The image width can be different. The page header has default text, and if you want to display it, the image must be 150 pixels wide or less. If you want to hide the default text behind the image, its width must be exactly 497 pixels.
; !endif
FunctionEnd

Function InstPageShow
; !ifdef MUI_HEADERIMAGE
;     !insertmacro BIMAGE "install_page_header.bmp" "" ; Same rules as on Directory page. If you use custom header image in Directory page, you have to uncomment this function too. Otherwise, old header image wont repaint and will be oberlaped by text from Install page. It's ungly (example: https://prnt.sc/uut8xp).
; !endif
FunctionEnd

;--------------------------------
; User  Functions

; If we use big installer in silent mode, it doesn't check if INSTDIR is empty. We need to do it here.  
Function isEmptyDir
  Exch $0
  Push $1
  FindFirst $0 $1 "$0\*.*"
  strcmp $1 "." 0 _notempty
    FindNext $0 $1
    strcmp $1 ".." 0 _notempty
      ClearErrors
      FindNext $0 $1
      IfErrors 0 _notempty
        FindClose $0
        Pop $1
        StrCpy $0 1
        Exch $0
        goto _end
     _notempty:
       FindClose $0
       ClearErrors
       Pop $1
       StrCpy $0 0
       Exch $0
  _end:
FunctionEnd

Function DirectoryLeave
  ${If} ${FileExists} "$InstDir\launcher.exe"
    Return
  ${EndIf}
  
  Push $InstDir
	Call isEmptyDir
  Pop $0
  
  ${If} $0 == 1
    Return
  ${Else}
      ${If} ${FileExists} "$InstDir"
        MessageBox MB_OK `"$InstDir" is not empty. Choose another directory`
        Abort
      ${EndIf}
  ${EndIf}
FunctionEnd

Function CleanTempExe
    ${If} ${FileExists} "$TEMP\${EXE_FILE_NAME}"
      SetDetailsPrint none ; Don't scarry the user with a delete file message 
      Delete "$TEMP\${EXE_FILE_NAME}"
    ${EndIf}
FunctionEnd