#!/bin/bash

FTP_SERVER_FULL_PATH="ftp://w0182f79.kasserver.com/simplipfy"
FTP_SERVER="w0182f79.kasserver.com"
FTP_FOLDER="/simplipfy"
FTP_USER="f017019e"
FTP_PASS="EuVumvJ4TyqztDz7Qgwq"

# get all files and directories from ftp server
ncftpls -u $FTP_USER -p $FTP_PASS $FTP_SERVER_FULL_PATH > removeFiles.txt
# exclude index.html, matomo, Simplipfy
sed -i '/index\.html/d' removeFiles.txt

# making commands to clear ftp server
while IFS= read -r line; do
  modified_content+="rm -r $line"$'\n'
done < removeFiles.txt

rm removeFiles.txt

# execute commands to clear ftp server
ncftp -u $FTP_USER -p $FTP_PASS $FTP_SERVER $FTP_FOLDER <<< $modified_content