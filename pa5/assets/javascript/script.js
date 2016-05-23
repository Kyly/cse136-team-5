/* Classes for elements - Everything gets attached to app class */
(function () {

    var app = this['App'];

    app.bookmarkExplorer = new BookmarkExplorer();
    app.bookmarkUploader = new BookmarkUploader();
    // app.bookmarkEdit     = new BookmarkEdit();
    app.createFolder     = new CreateFolder();

    // ErrorDialog.prototype.remove = function hideErrorDialog() {		
    //     hide('bm-error-dialog');
    // };

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
        if (folderId)
        {
            return axios.get('/api/bookmarks?folderId=' + folderId).then(function (payload) {
                return payload;
            });
        }

        return axios.get('/api/bookmarks').then(function (payload) {
            return payload;
        });
    }

    /* Code for bookmark explorer */
    function BookmarkExplorer() {
        this.folders        = [];
        this.container      = document.getElementById('bookmark-list');
        this.itemTemplate   = app.templates['assets/templates/bookmark-item.hbs'];
        this.folderTemplate = app.templates['assets/templates/bookmark-folder.hbs'];
        this.subFolderBack  = app.templates['assets/templates/bookmark-sub-back.hbs'];
    }

    BookmarkExplorer.prototype.showBookmarks = function showBookmarks(reference, parent) {
        console.log('this is the reference ', reference);
        //console.log('this is the container ', this.container.innerHTML);
        var bookExp                 = this;
        bookExp.container.innerHTML = '';
        //console.log('this is the container after ', this.container.innerHTML);
        var parentId;
        
        if (parent) {
            sessionStorage.setItem('parentFolder', parent);
            parentId = parent;
        }
        
        else {
                
        }
        
        if (parent)
        {
            sessionStorage.setItem('parentFolder', parent);
            var context = {parent: parent};
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
                            bookExp.folders.push(current);
                            printBookmarkListItem(bookExp.container, bookExp.folderTemplate, current);
                        }
                    })
                }).catch(function (error) {

        });
    };

    BookmarkExplorer.prototype.toggleFavorite = function toggleFavorite(ele, id) {

        if (ele.classList.contains('fa-star-o'))
        {
            ele.classList.toggle('fa-star-o');
            ele.classList.add("fa-star");
            axios.post('/api/bookmarks/' + id, {favorite: true}).then(function (payload) {
                console.log(JSON.stringify(payload));
            });

            return;
        }

        ele.classList.toggle('fa-star');
        ele.classList.add('fa-star-o');
        axios.post('/api/bookmarks/' + id, {favorite: false}).then(function (payload) {
            console.log(JSON.stringify(payload));
        });
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

})(window);
