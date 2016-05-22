(function () {
    var app            = this['App'];
    app.bookmarkCreate = new BookmarkCreate();

    /* Bookmark create */
    function BookmarkCreate() {
        this.template = app.templates['assets/templates/bm-create-dialog.hbs'];
    }

    BookmarkCreate.prototype.show = function showBookmarkCreate() {
        app.show('bm-create-dialog', this.template);
    };

    BookmarkCreate.prototype.remove = function removeBookmarkCreate(event) {
        if (event)
        {
            event.preventDefault();
        }

        app.hide('bm-create-dialog');
    };

    BookmarkCreate.prototype.addBookmarkRequest = function addBookmarkRequest(event, element) {
        console.log("ADD BOOKMARK");
        var name        = element.form.name.value;
        var url         = element.form.url.value;
        var keywords    = element.form.keywords.value;
        var description = element.form.description.value;
        var folderId    = element.form.folderId.value;

        axios.post('/api/bookmarks/', {
                 name: name,
                 url: url,
                 keywords: keywords,
                 folderId: folderId,
                 description: description
             })
             .then(function (res) {
                 console.log(res);
             })
             .catch(function (res) {
                 console.log(res);
             });

        if (event)
        {
            event.preventDefault();
        }

    };

    BookmarkCreate.prototype.addFolderRequest = function addFolderRequest(event, element) {
        console.log("ADD FOLDER");
        var name = document.getElementById("create-folder-form").elements.namedItem("name").value;
        console.log(name);
        var description = document.getElementById("create-folder-form").elements.namedItem("description").value;
        console.log(description);
        if (description == "")
        {
            description = "NULL";
        }

        axios.post('/api/bookmarks/', {
                 name: name,
                 description: description
             })
             .then(function (res) {
                 console.log(res);
             })
             .catch(function (res) {
                 console.log(res);
             });

        if (event)
        {
            event.preventDefault();
        }

    }

})(window);
