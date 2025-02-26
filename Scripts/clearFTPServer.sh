#!/bin/bash

# get all files and directories from ftp server
ncftpls -u $FTP_USER -p $FTP_PASS $FTP_SERVER_FULL_PATH > removeFiles.txt
# exclude index.html, matomo, Simplipfy
sed -i '/index\.html/d' removeFiles.txt
sed -i '/simplipfy\/\.\./d' removeFiles.txt
sed -i '/simplipfy\/\./d' removeFiles.txt
#cat removeFiles.txt

# making commands to clear ftp server
while IFS= read -r line; do
  modified_content+="rm -r $line"$'\n'
done < removeFiles.txt

rm removeFiles.txt
#echo $modified_content

# execute commands to clear ftp server
ncftp -u $FTP_USER -p $FTP_PASS $FTP_SERVER $FTP_FOLDER <<< $modified_content