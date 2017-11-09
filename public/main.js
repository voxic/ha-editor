var editor;
var currentFile;


//Function to load contents from a file on the server to the editor
function loadFile(fileName){
    $("#saveStatus").text("");
    $.get( "/file/"+fileName, function() {
        console.log("Get file");
    })
    .done(function(data) {
        $("#editorTitle").text(fileName);
        editor.setValue(data);
        currentFile = fileName;
    })
    .fail(function() {
        
    })
    .always(function(data, status, xhr) {
        console.log(xhr.status);
    });
}


//Function to save the contents from the editor to the server
function saveFile(){
    var data = {"fileName": currentFile, data: editor.getValue()};
    console.log(data);
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
function getFiles(){
    $('#fileList').find("a").remove();
    $.get( "/fileList", function() {

    })
    .done(function(data) {
        console.log(data);
        if(data.length == 0){
            $('#fileList').append("<a>No files</a>");
        }else {
            $.each(data, function (indexInArray, valueOfElement) { 
                $('#fileList').append("<a href='#' onclick='loadFile(\""+valueOfElement+"\")' class='list-group-item'>"+ valueOfElement + "</a>");
            });
        }

    })
    .fail(function() {
        
    })
    .always(function(data, status, xhr) {
        console.log(xhr.status);
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
    
});
