:: author milkmidi
:: update 2016 05 10
set FILE_ZILLA="C:\Program Files\FileZilla FTP Client\filezilla.exe"
set IP=220.128.166.83
set USER_ID=milkmidi
set PWD=xxxxxx
set REMOTE_PATH="/push.medialand.tw"
%FILE_ZILLA% "ftp://%USER_ID%:%PWD%@%IP%%REMOTE_PATH%" --local="%cd%\dist"
close

