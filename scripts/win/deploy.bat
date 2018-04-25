@echo OFF
SETLOCAL EnableDelayedExpansion

SET BUILD_PATH="..\..\launcher\win"
SET ARCHIVER_PATH="..\..\portables\win\7zip"
SET NSIS_PATH="..\..\portables\win\NSIS"
SET SCRIPTS_PATH="..\win\Install_scripts"

SET NEED_OUT=""

FOR %%i IN (%*) DO (
IF !NEED_OUT!==true (
SET TARGET_PATH=%%i
mkdir %TARGET_PATH%
SET NEED_OUT=0
)
IF %%i==--out (
SET NEED_OUT=true
)
)

IF "%TARGET_PATH%"=="" (
SET TARGET_PATH="..\..\target"
mkdir %TARGET_PATH%
)

ECHO.
ECHO.
ECHO.
XCOPY "%BUILD_PATH%" "%TARGET_PATH%" /E /R

ECHO * Create deploy archive
    "%ARCHIVER_PATH%\7za.exe" a -t7z "%target_path%\bin\XsollaLauncher.7z" "%target_path%\." -mx=9 -m0=lzma

	ECHO * Copying installer's stuff
	
	copy %build_path%\img\app_icon.ico "%TARGET_PATH%"
	copy %scripts_path%\XSollaInstaller.nsi "%TARGET_PATH%"
	
	pushd %NSIS_PATH%
	SET NSIS_PATH=%CD%
	popd
	
	ECHO * Creating installer
	CD "%TARGET_PATH%"
	"%nsis_path%\makensis.exe" XSollaInstaller.nsi

For /F "tokens=*" %%F In ('Dir %CD% /A:-D /B') Do (
If /I Not "%%F"=="bin" (Del /F /Q "%CD%\%%F")
)
For /F "tokens=*" %%D In ('Dir %CD% /A:D /B') Do (
If /I Not "%%D"=="bin" (RD /S /Q "%CD%\%%D")
)
popd