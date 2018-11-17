@echo OFF
SETLOCAL EnableDelayedExpansion

SET BUILD_PATH=..\..\launcher\win
SET ARCHIVER_PATH=..\..\portables\win\7zip
SET NSIS_PATH=..\..\portables\win\NSIS
SET SCRIPTS_PATH=..\win\Install_scripts

SET NEED_OUT=""

rem increase build number

echo Start increase build number

SET BUILD_INCREASER_PATH=..\..\portables\win\buildIncreaser\BuildIncreaser.exe
set CONFIG_PATH=%BUILD_PATH%\config.json

start /wait "" %BUILD_INCREASER_PATH% -config_json %CONFIG_PATH% -log

if %errorlevel% == 1 (
	echo %CONFIG_PATH% does not exist. 
	echo Check %CONFIG_PATH%.
	call :question
	goto deploy
)

if %errorlevel% == 2 (
	echo %CONFIG_PATH% is empty. 
	echo Check %CONFIG_PATH%.
	call :question
	goto deploy
)

if %errorlevel% == 3 (
	echo %CONFIG_PATH% parse error. 
	echo Check %CONFIG_PATH%.
	call :question
	goto deploy
)

if %errorlevel% == 4 (
	echo There is no launcher_project_id in %CONFIG_PATH%. 
	echo Check %CONFIG_PATH%.
	call :question
	goto deploy
)

if %errorlevel% == 5 (
	echo Something happened with your internet connection. 
	echo Check your internet connection.
	call :question
	goto deploy
)

if %errorlevel% == 6 (
	echo Unable to update build number in %CONFIG_PATH%. 
	echo Check if %CONFIG_PATH% isn't busy by another process.
	call :question
	goto deploy
)

if %errorlevel% == 7 (
	echo Error while parsin update response. 
	call :question
	goto deploy
)

if %errorlevel% == 8 (
	echo Unknown error. 
	call :question
	goto deploy
)

if %errorlevel% == 10 (
	echo There is not build number in update answer, maybe it's your first build? 
)

echo Increase build number success

:deploy
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
COPY %BUILD_PATH%\qwebchannel.js "%TARGET_PATH%"
	
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

exit 0

:question
echo What to do? 
set confirm=1
set /P confirm=0 - terminate script, anything else - ignore problem (in this case you need to edit config.json manualy):
if %confirm% == 0 (
	goto terminate
)
EXIT /B 0

:terminate
echo Terminated
exit 0
