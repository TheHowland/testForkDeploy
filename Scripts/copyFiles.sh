    ls -a
    echo "remove files from directory"
    find . -mindepth 1 -not -path "./.git*" -delete
    cd ..
    echo "copy files"
    echo -e ".git/\n.idea/\nCircuits.zip\nScripts/\nConfigurations\nGzipSimplePythonHttpServer.py" > exclude-list.txt
    rsync -av --exclude-from='exclude-list.txt' Pyodide/ temp/
    rm exclude-list.txt
    cd temp
    zip -r Circuits Circuits && rm -r Circuits/