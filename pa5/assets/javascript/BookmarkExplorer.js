(function () {

    var app = this['App'];
    var bookExp;

    function BookmarkExplorer() {
        this.folders        = [];
        this.container      = document.getElementById('bookmark-list');
        this.itemTemplate   = app.templates['assets/templates/bookmark-item.hbs'];
        this.folderTemplate = app.templates['assets/templates/bookmark-folder.hbs'];
        this.subFolderBack  = app.templates['assets/templates/bookmark-sub-back.hbs'];
        bookExp             = this;
    }

    function getBookmarks(folderId) {
        if (folderId)
        {
            return axios.get('/api/bookmarks?folderId=' + folderId);
        }

        return axios.get('/api/bookmarks');
    }

    BookmarkExplorer.prototype.showBookmarks = function showBookmarks(folderId, parentId) {
        console.log('this is the folderId ', folderId);
        bookExp.container.innerHTML = '';

        if (parentId)
        {
            sessionStorage.setItem('parentId', parentId);
        }

        getBookmarks(folderId).then(dislplayBookmarks, app.errorDialog.show);
    };

    function dislplayBookmarks(bookmarks) {
        console.log('Inside show bookmarks ', bookmarks);

        var folderId;
        var parentId = sessionStorage.getItem('parentId');

        bookmarks.data.forEach(function (current) {
            folderId = current.folderId;
            if (current.url)
            {
                printBookmarkListItem(bookExp.container, bookExp.itemTemplate, current);
            }
            else
            {
                bookExp.folders.push(current);
                printBookmarkListItem(bookExp.container, bookExp.folderTemplate, current);
            }
        });

        if (parentId != folderId)
        {
            bookExp.container.insertAdjacentHTML('afterbegin', bookExp.subFolderBack({parent: parentId}));
        }
    }

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

    app.bookmarkExplorer = new BookmarkExplorer();

})(window);
