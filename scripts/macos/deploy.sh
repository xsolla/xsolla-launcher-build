#!/bin/bash

apppath=""
username=""
password=""

signature=""
teamid=""
bundleid="com.template.launcher"


_appfolder=`basename -a $apppath`
_appbasefoldername="$(cut -d'.' -f1 <<<$apppath)"
_appname="$(cut -d'.' -f1 <<<$_appfolder)"
_scriptabspath=$(cd "$(dirname "$0")"; pwd)
_dmgpath=$_appbasefoldername.dmg
_7zpath=$_appbasefoldername.7z

rm "$_dmgpath"
rm "$_7zpath"
xattr -rc "$apppath"
find "$apppath" -exec xattr -d com.apple.quarantine {} \;
find "$apppath" -name *.cstemp -print0 | xargs -I $ -0 rm $

_signopt="-o runtime --timestamp"

find "$apppath" -name "*.dylib*" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s "$signature" $
find "$apppath" -name "Qt*" -type f | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$apppath" -name "*.qml" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$apppath" -name "*.qmltypes" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$apppath" -name "*.js" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$apppath" -name "*qmldir" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$apppath" -name "*.png" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$apppath" -name "*.ttf" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$apppath" -name "*.metainfo" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$apppath" -name "*.icns" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$apppath" -name "*.xml" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$apppath" -name "*.txt" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$apppath" -name "*.json" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$apppath" -name "*.jpg" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$apppath" -name "*.ico" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$apppath" -name "*.svg" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$apppath" -name "*.sh" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $
find "$apppath" -name "*.qm" | xargs -I $ codesign --preserve-metadata=identifier,entitlements --verify --verbose --force $_signopt -s  "$signature" $

codesign --preserve-metadata=identifier,entitlements --verify --verbose --force -s "$signature" "${apppath}/Contents/MacOS/7zr" $_signopt
codesign --preserve-metadata=identifier,entitlements --verify --verbose --force -s "$signature" "${apppath}/Contents/MacOS/launcher" $_signopt
codesign --preserve-metadata=identifier,entitlements --verify --verbose --force -s "$signature" "$apppath" $_signopt

codesign -dv -r- "$apppath"

sh -x $_scriptabspath/create-dmg/create-dmg \
    --volname "$_appname" \
    --volicon "$apppath/Contents/Resources/launcher.icns" \
    --window-pos 200 120 \
    --window-size 800 400 \
    --icon-size 100 \
    --icon "$_appname.app" 200 190 \
    --hide-extension "$_appname.app" \
    --app-drop-link 600 185 \
    --hdiutil-quiet \
    "$_dmgpath" \
    "$apppath"

codesign --preserve-metadata=identifier,entitlements --verify --verbose --force -s "$signature" "$_dmgpath" $_signopt

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
    echo "## uploading $filepath for notarization"

    requestUUID=$(xcrun altool --notarize-app \
                               --primary-bundle-id "$identifier" \
                               --username $username \
                               --password $password \
                               --asc-provider "$teamid" \
                               --file "$filepath" 2>&1 \
                  | awk '/RequestUUID/ { print $NF; }')

    echo "Notarization RequestUUID: $requestUUID"

    if [[ $requestUUID == "" ]]; then
        echo "could not upload for notarization"
        exit 1
    fi

    # wait for status to be not "in progress" any more
    request_status="in progress"
    while [[ "$request_status" == "in progress" ]]; do
        echo -n "waiting... "
        sleep 10
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
notarizefile "$_dmgpath" "$bundleid"
spctl -a -t open --context context:primary-signature -vv "$_dmgpath"
xcrun stapler staple "$_dmgpath"


hdiutil attach "$_dmgpath"
"$apppath/Contents/MacOS/7zr" a -t7z "$_7zpath" "$apppath/Contents/." -mx=9 -m0=lzma
hdiutil detach "/Volumes/$_appname"
