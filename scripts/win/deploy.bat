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
	SET NEED_OUT=false
)
IF %%i==--out (
	SET NEED_OUT=true
)
)

IF "%TARGET_PATH%"=="" (
	mkdir "..\..\target"
	SET TARGET_PATH="..\..\target"
)

For /F "tokens=*" %%F In ('Dir %TARGET_PATH% /A:-D /B') Do (
	Del /F /Q "%TARGET_PATH%\%%F"
)
For /F "tokens=*" %%D In ('Dir %TARGET_PATH% /A:D /B') Do (
	RD /S /Q "%TARGET_PATH%\%%D"
)

ECHO.
XCOPY "%BUILD_PATH%" "%TARGET_PATH%" /E /R

ECHO * Create deploy archive
"%ARCHIVER_PATH%\7za.exe" a -t7z "%TARGET_PATH%\bin\XsollaLauncher.7z" "%TARGET_PATH%\." -mx=9 -m0=lzma

ECHO * Copying installer's stuff
	
COPY %BUILD_PATH%\img\launcherIcon.ico "%TARGET_PATH%"
COPY %SCRIPTS_PATH%\XSollaInstaller.nsi "%TARGET_PATH%"
	
pushd %NSIS_PATH%
SET NSIS_PATH=%CD%
popd
	
ECHO * Creating installer
CD "%TARGET_PATH%"
"%NSIS_PATH%\makensis.exe" XSollaInstaller.nsi

For /F "tokens=*" %%F In ('Dir %CD% /A:-D /B') Do (
	If /I Not "%%F"=="bin" (Del /F /Q "%CD%\%%F")
)
For /F "tokens=*" %%D In ('Dir %CD% /A:D /B') Do (
	If /I Not "%%D"=="bin" (RD /S /Q "%CD%\%%D")
)
popd