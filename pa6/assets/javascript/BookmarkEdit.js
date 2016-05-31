(function () {
    var app          = this['App'];
    app.bookmarkEdit = new BookmarkEdit();

    function BookmarkEdit() {
        this.template = app.templates['assets/templates/bm-edit-dialog.hbs'];
    }

    BookmarkEdit.prototype.show = function showBookmarkEdit(event, id) {
        var current = this;
        if (event)
        {
            event.preventDefault();
        }
        console.log("SHOW EDIT FOR BOOKMARK WITH ID: ", id);
        console.log(id);
        var bookmark = app.bookmarkExplorer.getById(id);
        app.bookmarkExplorer.getFolders().then(
            function (folders) {
                console.log('found these folders ', folders);
                console.log(bookmark.url);
                if (bookmark.url == null)
                {
                    bookmark.url = "";
                }

                bookmark.folders = folders;
                console.log('Showing edit for ', bookmark);
                if (!bookmark.isFolder) {
                    delete bookmark.isFolder;
                    bookmark.isBookmark = true;
                }
                
                app.show('bm-edit-dialog', current.template, bookmark);

            }
        );

    };

    BookmarkEdit.prototype.apply = function apply(event, element, id) {
        if (event)
        {
            event.preventDefault();
        }

        console.log(id);
        var name        = element.form.name.value;
        var url         = element.form.url.value;
        var keywords    = element.form.keywords.value;
        var description = element.form.description.value;
        var folderId    = element.form.folderId.value;
        axios.post('/api/bookmarks/' + id, {
                 name: name,
                 url: url,
                 keywords: keywords,
                 description: description,
                 folderId: folderId
             })
             .then(function (res) {
                 console.log(res);
                 app.bookmarkExplorer.showBookmarks();
             })
             .catch(function (res) {
                 console.log(res);
                 if (res.status == 401)
                 {
                     window.location.href = 'users/login';
                 }

                 var error = {
                     name: res.data.message,
                     code: res.status,
                     message: res.data.errors[0].message
                 };

                 App.errorDialog.show(error);
             });

        app.remove(event, element, 'bm-edit-dialog');
    };

    BookmarkEdit.prototype.remove = function removeBookmarkEdit(event, element, id) {
        if (event)
        {
            event.preventDefault();
        }

        console.log("DELETE");

        axios.delete('/api/bookmarks/' + id, {})
             .then(function (res) {
                 console.log(res);
                 app.bookmarkExplorer.showBookmarks();
             })
             .catch(function (res) {
                 console.log(res);
                 if (res.status == 401)
                 {
                     window.location.href = 'users/login';
                 }

                 var error = {
                     name: res.data.message,
                     code: res.status,
                     message: res.data.errors[0].message
                 };

                 App.errorDialog.show(error);
             });

        app.remove(event, element, 'bm-edit-dialog');
    };
})(window);