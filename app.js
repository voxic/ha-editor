'use strict';

//load modules
let express = require('express');
let app = express();
let fs = require('fs');
let bodyParser = require('body-parser');

//The root folder for homeassistant config files.
let baseDir = "configFolder"


//Function to load a file from disk and return it
function getFile(filePath, fn){
    fs.readFile(filePath, 'utf8', function(err, data) {  
        if (err) throw err;
        return fn(data);
    }); 
}

//Function to list files in a directory and return it as an array
function getDir(dirPath, fn){
    fs.readdir(dirPath, function(err,data){
        let tempFiles = [];
        let tempFolders = []
        if(data != null){
            data.forEach(function(element) {
                //Check file type and only include known file types
                if(element.includes(".yaml")){
                    tempFiles.push(element);
                }
                else if(element.includes(".py")){
                    tempFiles.push(element);
                }
                else if(!element.includes(".")){
                    tempFolders.push(element);
                } 
            }, this);
        }       
        let filesDirs = {'folders': tempFolders, 'files': tempFiles, 'currentFolder' : dirPath };
        return fn(filesDirs);
    });
}

//Function to save the file to disk.
function saveFile(filePath, data, fn){
    fs.writeFile(filePath, data, (err) => {
        if (err) throw err;
        return fn('The file has been saved!');
      });
}

//set view engine to ejs
app.set('view engine', 'ejs');

//set upp public directory to serve static files
app.use(express.static('public'));
app.use('/public', express.static(__dirname + '/public'));
app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/monaco', express.static(__dirname + '/node_modules/monaco-editor/min/vs'));

//Initiate bodyParser to parse request body
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//Routes
app.get('/', (req, res) => {
    res.render('index');
});

app.post('/file', (req, res) => {
    getFile(req.body.path, (results)=>{
        res.send(results);
    });
});

app.post('/fileList', (req, res) => {
    if(req.body.path == "home"){
        getDir(baseDir, (results)=>{
            res.send(results);
        });
    }
    else {
        getDir(req.body.path, (results)=>{
            res.send(results);
        });
    }

});

app.post('/saveFile', (req, res) => {
    saveFile(req.body.fileName, req.body.data, (results)=>{
        res.sendStatus(200);
    });
});

// Run server
console.log("Server is listening...")
app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'));