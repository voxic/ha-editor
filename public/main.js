var editor;
var currentFile;
var currentFolder = "";
let lastFolder = "";
let breadcrumb = [];


//Function to load contents from a file on the server to the editor
function loadFile(fileName){
    let data = {"path" : currentFolder + "/" + fileName}
    $("#saveStatus").text("");

    $.post( "/file", data, function() {
    })
    .done(function(data) {
        $("#editorTitle").text(fileName);
        editor.setValue(data);
        currentFile = fileName;
        const regex = /\..+/g;
        let m;
        
        while ((m = regex.exec(fileName)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            
            // The result can be accessed through the `m`-variable.
            m.forEach((match, groupIndex) => {
                if(match == ".py"){
                    monaco.editor.setModelLanguage(editor.getModel(), "python")
                    console.log("Changed to python");
                }
                else if(match == ".yaml"){
                    monaco.editor.setModelLanguage(editor.getModel(), "yaml")
                    console.log("Changed to yaml");   
                }
            });
        }
    })
    .fail(function() {
        
    })
    .always(function(data, status, xhr) {
        console.log(xhr.status);
    });
}


//Function to save the contents from the editor to the server
function saveFile(){
    var data = {"fileName": currentFolder + "/" + currentFile, data: editor.getValue()};
    $.post( "/saveFile", data, function() {
        
        })
        .done(function(data) {

            $("#saveStatus").text("Saved!");
        })
        .fail(function(data, status, xhr) {
            console.log("API error " + status);
        })
        .always(function() {

        });  
}

//Function to get a list of files from the server
function getFiles(dirName){
    $('#fileList').find("a").remove();
    let data;

    if(dirName == null){ 
        data = {"path" : "home"};
    }
    else {
        data = {"path" : dirName}
    }

    $.post( "/fileList", data, function() {

    })
    .done(function(data) {
        currentFolder = data.currentFolder;

        $("#currentFolder").text(currentFolder);
        $('#fileList').append("<a href='#' onclick='getFiles(\"home\")' class='list-group-item'><span class='glyphicon glyphicon-home' aria-hidden='true' style='margin-right: 5px'></span> Home</a>");
        if(data.length == 0){
            $('#fileList').append("<a>No files</a>");
        }else {
            $.each(data.folders, function (indexInArray, valueOfElement) { 
                $('#fileList').append("<a href='#' onclick='getFiles(\"" + currentFolder + "/" +valueOfElement+"\")' class='list-group-item'><span class='glyphicon glyphicon-folder-open' aria-hidden='true' style='margin-right: 5px'></span> "+ valueOfElement + "</a>");
            });
            $.each(data.files, function (indexInArray, valueOfElement) { 
                $('#fileList').append("<a href='#' onclick='loadFile(\""+valueOfElement+"\")' class='list-group-item'><span class='glyphicon glyphicon-file' aria-hidden='true'></span> "+ valueOfElement + "</a>");
            });
        }

    })
    .fail(function() {
        
    })
    .always(function(data, status, xhr) {
    });
}

$(function () {
    require.config({ paths: { 'vs': 'monaco' }});
    require(['vs/editor/editor.main'], function() {
        editor = monaco.editor.create(document.getElementById('editor'), {
            value: "Ready, choose file to edit.",
            language: 'yaml'
        });
    });
    
    getFiles();
    console.log("current folder:" + currentFolder);
    
});
