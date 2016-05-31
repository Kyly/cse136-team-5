(function () {
    var app            = this['App'];
    app.bookmarkCreate = new BookmarkCreate();
    var bCreate;

    /* Bookmark create */
    function BookmarkCreate() {
        bCreate          = this;
        bCreate.template = app.templates['assets/templates/bm-create-dialog.hbs'];
    }

    BookmarkCreate.prototype.show = function showBookmarkCreate() {

        var request = axios.get('/api/bookmarks/folders');

        request.then(function (folders) {
            var context = {folders: folders.data};
            console.log('folders ', folders);
            app.show('bm-create-dialog', bCreate.template, context);
        });

        request.catch(app.errorDialog.show);

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

        if (url == "")
        {
            app.errorDialog
               .show({
                         name: "No URL",
                         message: "Bookmark must have a URL"
                     });

            return;

        }

        if (url.substring(0, 7) != "http://" && url.substring(0, 8) != "https://")
        {
            app.errorDialog
               .show({
                         name: "Invalid URL format",
                         message: "URL must begin with http://"
                     });

            return;
        }

        axios.post('/api/bookmarks/', {
                 name: name,
                 url: url,
                 keywords: keywords,
                 folderId: folderId,
                 description: description
             })
             .then(function (res) {
                 console.log(res);
                 if (res.status == 204)
                 {
                     app.bookmarkExplorer.showBookmarks();
                     console.log("SUCCESFUL REQUEST");
                 }

             })
             .catch(function (res) {
                 var error = {
                     name: res.data.message,
                     code: res.status,
                     message: res.data.errors[0].message
                 };
                 app.errorDialog.show(error);
             });
        
        if (event)
        {
            event.preventDefault();
        }

        app.remove(event, element, 'bm-create-dialog');
    };

    BookmarkCreate.prototype.addFolderRequest = function addFolderRequest(event, element) {
        var folder = {
            name: element.form.name.value,
            keywords: element.form.keywords.value,
            description: element.form.description.value,
            folderId: element.form.folderId.value,
            isFolder: true
        };

        console.log('New folder request', folder);
        axios.post('/api/bookmarks/', folder)
             .then(function (res) {
                 console.log(res);
                 app.bookmarkExplorer.showBookmarks();
             })
             .catch(function (res) {

                 var error = {
                     name: res.data.message,
                     code: res.status,
                     message: res.data.errors[0].message
                 };

                 app.errorDialog.show(error);
             });

        if (event)
        {
            event.preventDefault();
        }
        app.remove(event, element, 'bm-create-folder-dialog');
    }

})(window);
