function addBookmarkRequest() {
    console.log("ADD BOOKMARK");
    var name = document.getElementById("create-bookmark-form").elements.namedItem("name").value;
    var url = document.getElementById("create-bookmark-form").elements.namedItem("url").value;
    var keywords = document.getElementById("create-bookmark-form").elements.namedItem("keywords").value;
    var description = document.getElementById("create-bookmark-form").elements.namedItem("description").value;
    var folderId = document.getElementById("create-bookmark-form").elements.namedItem("folderId").value;
    
    axios.post('/api/bookmarks/', {
        name: name,
        url: url,
        keywords: keywords,
        folderId: folderId,
        description: description
    })
    .then(function(res) {
        console.log(res);
    })
    .catch(function(res){
        console.log(res);
    });
    
    return false;

}

function addFolderRequest() {
    console.log("ADD FOLDER");
    var name = document.getElementById("create-folder-form").elements.namedItem("name").value;
    console.log(name);
    var description = document.getElementById("create-folder-form").elements.namedItem("description").value;
    console.log(description);
    if(description == "") {
        description = "NULL";
    }

        
    axios.post('/api/bookmarks/', {
        name: name,
        description: description
    })
    .then(function(res) {
        console.log(res);
    })
    .catch(function(res){
        console.log(res);
    });
        
        
    return false;
}

