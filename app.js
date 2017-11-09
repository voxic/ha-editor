'use strict';

//load modules
let express = require('express');
let app = express();
let fs = require('fs');
let bodyParser = require('body-parser');

//The root folder for homeassistant config files.
let baseDir = "configFolder"


//Function to load a file from disk and return it
function getFile(fileName, fn){
    fs.readFile(baseDir + "/"+fileName, 'utf8', function(err, data) {  
        if (err) throw err;
        return fn(data);
    }); 
}

//Function to list files in a directory and return it as an array
function getDir(fn){
    fs.readdir(baseDir, function(err,data){
        let temp = [];
        data.forEach(function(element) {
            if(element.includes(".yaml")){
                temp.push(element);
            } 
        }, this);
        return fn(temp);
    });
}

//Function to save the file to disk.
function saveFile(fileName, data, fn){
    fs.writeFile(baseDir + "/" + fileName, data, (err) => {
        if (err) throw err;
        return fn('The file has been saved!');
      });
}

//set view engine to ejs
app.set('view engine', 'ejs');

//set upp public directorys to serve static files
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

app.get('/file/:fileName', (req, res) => {
    getFile(req.params.fileName, (results)=>{
        res.send(results);
    });
});

app.get('/fileList', (req, res) => {
    getDir((results)=>{
        res.send(results);
    });
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