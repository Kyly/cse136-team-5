(function () {
    var app          = this['App'];
    app.bookmarkEdit = new BookmarkEdit();

    function BookmarkEdit() {
        this.template = app.templates['assets/templates/bm-edit-dialog.hbs'];
    }

    BookmarkEdit.prototype.show = function showBookmarkEdit(event, id) {
        if (event)
        {
            event.preventDefault();
        }
       // console.log("SHOW EDIT FOR BOOKMARK WITH ID: ", id);
        console.log(id);
        var bookmark = app.bookmarkExplorer.getById(id);
        console.log(bookmark.url);
        if(bookmark.url == null) {
            bookmark.url = "";
        }
        var folders = app.bookmarkExplorer.folders;
        bookmark.folders = folders;
        app.show('bm-edit-dialog', this.template, bookmark);
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
                if(res.status == 401) {
                    window.location.href = 'users/login';
                }

                var error = {
                    name: res.data.message,
                    code: res.status,
                    message: res.data.errors[0].message
                };
            
                App.errorDialog.show(error);
             });
    
        //console.log(JSON.stringify(element.form));
        
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
                if(res.status == 401) {
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