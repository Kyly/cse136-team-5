/* Custom element definitions */
(function () {
    /* Custom element for uploader */
    var bmapp = document.registerElement('bm-app', {
        prototype: Object.create(HTMLButtonElement.prototype),
        extends: 'div'
    });

    document.body.appendChild(new bmapp());

    /* Custom element for uploader */
    var bmUploadFileDialog = document.registerElement('bm-upload-file-dialog', {
        prototype: Object.create(HTMLButtonElement.prototype),
        extends: 'div'
    });

    document.body.appendChild(new bmUploadFileDialog());

    /* Close button for dialog boxes */
    var bmDialogClose = document.registerElement('bm-dialog-close', {
        prototype: Object.create(HTMLButtonElement.prototype),
        extends: 'div'
    });

    document.body.appendChild(new bmDialogClose());

    /* Close button for dialog boxes */
    var bmDialogBody = document.registerElement('bm-dialog-body', {
        prototype: Object.create(HTMLButtonElement.prototype),
        extends: 'div'
    });

    document.body.appendChild(new bmDialogBody());

    var bmCreateDialog = document.registerElement('bm-create-dialog', {
        prototype: Object.create(HTMLButtonElement.prototype),
        extends: 'div'
    });

    document.body.appendChild(new bmCreateDialog());

    var bmEditDialog = document.registerElement('bm-edit-dialog', {
        prototype: Object.create(HTMLButtonElement.prototype),
        extends: 'div'
    });

    document.body.appendChild(new bmEditDialog());

    var bmCreateFolderDialog = document.registerElement('bm-create-folder-dialog', {
        prototype: Object.create(HTMLButtonElement.prototype),
        extends: 'div'
    });

    document.body.appendChild(new bmCreateFolderDialog());

})(window);

/* Classes for elements - Everything gets attached to app class */
(function () {

    var app            = this['App'];
    
    app.bookmarkExplorer = new BookmarkExplorer();
    app.bookmarkUploader = new BookmarkUploader();
    // app.bookmarkEdit     = new BookmarkEdit();
    app.createFolder     = new CreateFolder();

    function CreateFolder() {
        this.template = app.templates['assets/templates/bm-create-folder.hbs'];
    }

    CreateFolder.prototype.show = function showCreateFolder() {
        app.show('bm-create-folder-dialog', this.template);
    };

    CreateFolder.prototype.remove = function hideCreateFolder() {
        hide('bm-create-folder-dialog');
    };

    /* Mock Bookmark Service*/
    function getBookmarks(folderId) {
        if(folderId) {
            return axios.get('/api/bookmarks?folderId=' + folderId).then(function (payload) {
                return payload;
            });
        }
        else {
            return axios.get('/api/bookmarks').then(function (payload) {
                return payload;
            });
        }
    }

    /* Code for bookmark explorer */
    function BookmarkExplorer() {
        this.container      = document.getElementById('bookmark-list');
        this.itemTemplate   = app.templates['assets/templates/bookmark-item.hbs'];
        this.folderTemplate = app.templates['assets/templates/bookmark-folder.hbs'];
        this.subFolderBack  = app.templates['assets/templates/bookmark-sub-back.hbs'];
    }

    BookmarkExplorer.prototype.showBookmarks = function showBookmarks(reference, parent) {
        
        console.log('this is the reference ', reference);
        //console.log('this is the container ', this.container.innerHTML);
        var bookExp   = this;
        bookExp.container.innerHTML = '';
        //console.log('this is the container after ', this.container.innerHTML);
        
        if (parent) {
            var  context = {parent: parent};
            bookExp.container.innerHTML += bookExp.subFolderBack(context);
        }
        
        getBookmarks(reference)
            .then(
                function (bookmarks) {
                    console.log('Inside show bookmarks ', bookmarks);

                    bookmarks.data.forEach(function (current) {
                        if (current.url)
                        {
                            printBookmarkListItem(bookExp.container, bookExp.itemTemplate, current);
                        }
                        else
                        {
                            printBookmarkListItem(bookExp.container, bookExp.folderTemplate, current);
                        }
                    })
                }).catch( function(error){
            
        });
    };

    BookmarkExplorer.prototype.toggleFavorite = function toggleFavorite(ele, id) {
        var body = {};
        if (ele.classList.contains("fa-star-o"))
        {
            ele.classList.toggle("fa-star-o");
            ele.classList.add("fa-star");
            axios.post('/api/bookmarks/' + id, {favorite: true}).then(function (payload) {
                console.log(JSON.stringify(payload));
            });
        }
        else
        {
            ele.classList.toggle("fa-star");
            ele.classList.add("fa-star-o");
            axios.post('/api/bookmarks/' + id, {favorite: false}).then(function (payload) {
                console.log(JSON.stringify(payload));
            });
        }
    };

    function printBookmarkListItem(container, template, context) {
        container.innerHTML += template(context);
    }

    /* Bookmark uploader */
    function BookmarkUploader() {
        this.template = app.templates['assets/templates/upload-file.hbs'];
    }

    BookmarkUploader.prototype.show = function showBookmarkUploader() {
        app.show('bm-upload-file-dialog', this.template);
    };

    BookmarkUploader.prototype.remove = function hideBookmarkUploader() {
        hide('bm-upload-file-dialog');
    };
    

})(window);
