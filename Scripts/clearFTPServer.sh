#!/bin/bash

FTP_SERVER="ftp://w0182f79.kasserver.com/simplipfy"
FTP_USER="f017019e"
FTP_PASS="EuVumvJ4TyqztDz7Qgwq"

# get all files and directories from ftp server
ncftpls -u $FTP_USER -p $FTP_PASS $FTP_SERVER > removeFiles.txt
# exclude index.html and matomo
sed -i '/index\.html/d' removeFiles.txt
sed -i '/matomo/d' removeFiles.txt

# making commands to clear ftp server
while IFS= read -r line; do
  modified_content+="rm -r $line"$'\n'
done < removeFiles.txt

rm removeFiles.txt

# execute commands to clear ftp server
ncftp -u $FTP_USER -p $FTP_PASS $FTP_SERVER <<EOF
      $modified_content
EOF