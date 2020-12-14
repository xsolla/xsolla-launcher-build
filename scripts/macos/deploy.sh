#!/bin/bash

#Named params
while [ $# -gt 0 ]; do
   if [[ $1 == *"--"* ]]; then
        param="${1/--/}"
        declare $param="$2"
   fi
  shift
done

apppath=${apppath:-../../launcher/macos}
username=${username?:"need a Apple Dev Username"}
password=${password?:"need a Apple Dev Password"}
appname=${appname:-launcher}
signature=${signature?:"need a Signature"}
teamid=${teamid?:"need a TeamId"}
bundleid=${teamid:-com.template.launcher}
outpath=${outpath:-$apppath/../../target/macos}

_appfile="$appname.app"
_apppath="$apppath/$_appfile"
_outpath="$outpath"
_scriptabspath=$(cd "$(dirname "$0")"; pwd)
_dmgfile="$appname.dmg"
_dmgpath="$_outpath/$_dmgfile"
_7zfile="$appname.7z"
_7zpath="$_outpath/$_7zfile"

requeststatus() { # $1: requestUUID
    requestUUID=${1?:"need a request UUID"}
    req_status=$(xcrun altool --notarization-info "$requestUUID" \
                              --username $username \
                              --password $password 2>&1 \
                 | awk -F ': ' '/Status:/ { print $2; }' )
    echo "$req_status"
}

notarizefile() { # $1: path to file to notarize, $2: identifier
    filepath=${1:?"need a filepath"}
    identifier=${2:?"need an identifier"}

    # upload file
    echo "> uploading $filepath for notarization"

    result=$(xcrun --verbose --log altool \
                   --notarize-app \
                   --primary-bundle-id "$identifier" \
                   --username $username \
                   --password $password \
                   --asc-provider "$teamid" \
                   --file "$filepath" 2>&1)

    echo $result

    requestUUID=$(echo $result | awk '/RequestUUID/ { print $NF; }')

    echo "Notarization RequestUUID: $requestUUID"

    if [[ $requestUUID == "" ]]; then
        echo "could not upload for notarization"
        exit 1
    fi

    # wait for status to be not "in progress" any more
    request_status="in progress"
    while [[ "$request_status" == "in progress" ]]; do
        echo -n "waiting... "
        sleep 60
        request_status=$(requeststatus "$requestUUID")
        echo "$request_status"
    done

    # print status information
    xcrun altool --notarization-info "$requestUUID" \
                 --username $username \
                 --password $password
    echo

    if [[ $request_status != "success" ]]; then
        echo "## could not notarize $filepath"
        exit 1
    fi

}

echo "> Cleanup"
rm -r "$_outpath"
rm "$_dmgpath"
rm "$_7zpath"

echo "> Make outpath"
mkdir -p $_outpath

echo "> Copy App bundle to target folder"
cp -a $_apppath $_outpath
_apppath="$_outpath/$_appfile"

echo "> Increase build number"
./../../portables/macos/buildIncreaser//BuildIncreaser -config_json $_apppath/Contents/MacOS/config.json -log

if [ "$?" != "0" ]; then exit 1; fi

echo "> Remove unnecessary attributes from files"
xattr -rc "$_apppath"
xattr -dr com.apple.quarantine "$_apppath"
find "$_apppath" -name *.cstemp -print0 | xargs -I $ -0 rm $

echo "> Codesign"
_signopt="-o runtime --timestamp=http://timestamp.apple.com/ts01"

find "$_apppath" -name "*.dylib*" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s "$signature" $
find "$_apppath" -name "Qt*" -type f | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$_apppath" -name "*.qml" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$_apppath" -name "*.qmltypes" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$_apppath" -name "*.js" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$_apppath" -name "*qmldir" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$_apppath" -name "*.png" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$_apppath" -name "*.ttf" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$_apppath" -name "*.metainfo" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$_apppath" -name "*.icns" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$_apppath" -name "*.xml" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$_apppath" -name "*.txt" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$_apppath" -name "*.json" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$_apppath" -name "*.jpg" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$_apppath" -name "*.ico" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$_apppath" -name "*.svg" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$_apppath" -name "*.sh" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$_apppath" -name "*.qm" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $

codesign --force --verify --verbose --sign "$signature" --entitlements QtWebEngineProcess.entitlements --options runtime "${_apppath}/Contents/Frameworks/QtWebEngineCore.framework/Versions/5/Helpers/QtWebEngineProcess.app/Contents/MacOS/QtWebEngineProcess"
codesign --preserve-metadata=identifier,entitlements --verify --verbose --force -s "$signature" "${_apppath}/Contents/MacOS/crashpad_handler" $_signopt
codesign --preserve-metadata=identifier,entitlements --verify --verbose --force -s "$signature" "${_apppath}/Contents/MacOS/7zr" $_signopt
codesign --preserve-metadata=identifier,entitlements --verify --verbose --force -s "$signature" --entitlements launcher.entitlements "${_apppath}/Contents/MacOS/launcher" $_signopt
codesign --preserve-metadata=identifier,entitlements --verify --verbose --force -s "$signature" "$_apppath" $_signopt

codesign -dv -r- "$_apppath"



echo "> Create Disk Image (DMG)"
cd $_outpath
sh -x $_scriptabspath/create-dmg/create-dmg \
    --volname "$appname" \
    --window-pos 200 120 \
    --window-size 800 400 \
    --icon-size 100 \
    --icon "$_appfile" 200 190 \
    --hide-extension "$_appfile" \
    --app-drop-link 600 190 \
    --hdiutil-quiet \
    "$_dmgfile" \
    "$_apppath"

echo "> Codesign Disk Image"
codesign --preserve-metadata=identifier,entitlements --verify --verbose --force -s "$signature" "$_dmgpath" $_signopt

echo "> Notarization"

# notarize disk image
notarizefile "$_dmgpath" "$bundleid"
spctl -a -t open --context context:primary-signature -vv "$_dmgpath"
xcrun stapler staple "$_dmgpath"

echo "> Create Launcher Archive"

hdiutil attach "$_dmgpath" -quiet
"$_apppath/Contents/MacOS/7zr" a -t7z "$_7zpath" "$_apppath/Contents/." -mx=9 -m0=lzma 
hdiutil detach "/Volumes/$appname" -quiet
