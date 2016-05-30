(function () {

    var app = this['App'];
    var bookExp;

    function BookmarkExplorer() {
        this.container      = document.getElementById('bookmark-list');
        this.itemTemplate   = app.templates['assets/templates/bookmark-item.hbs'];
        this.folderTemplate = app.templates['assets/templates/bookmark-folder.hbs'];
        this.subFolderBack  = app.templates['assets/templates/bookmark-sub-back.hbs'];
        this.bookmarks      = [];
        bookExp             = this;
    }

    function getBookmarks(folderId) {
        if (folderId)
        {
            return axios.get('/api/bookmarks?folderId=' + folderId);
        }

        return axios.get('/api/bookmarks');
    }

    BookmarkExplorer.prototype.getById = function (id) {
        return _.find(bookExp.bookmarks, function(o) { return o.id === id; });

    };

    
    
    BookmarkExplorer.prototype.showBookmarks = function showBookmarks(folderId, parentId) {
        console.log('this is the folderId ', folderId);

        if (parentId)
        {
            sessionStorage.setItem('parentId', parentId);
        }

        getBookmarks(folderId).then(dislplayBookmarks, app.errorDialog.show);
    };

    function dislplayBookmarks(bookmarks) {
        bookExp.container.innerHTML = '';
        console.log('Inside show bookmarks ', bookmarks);

        var folderId;
        var parentId = sessionStorage.getItem('parentId');

        bookExp.bookmarks = bookmarks.data;

        bookExp.bookmarks.forEach(function (current) {
            folderId = current.folderId;
            if (current.url)
            {
                printBookmarkListItem(bookExp.container, bookExp.itemTemplate, current);
            }

            if(current.isFolder)
            {
                printBookmarkListItem(bookExp.container, bookExp.folderTemplate, current);
            }

        });

        if (parentId != folderId)
        {
            bookExp.container.insertAdjacentHTML('afterbegin', bookExp.subFolderBack({parent: parentId}));
        }
    }

    BookmarkExplorer.prototype.toggleFavorite = function toggleFavorite(ele, id) {

        if (ele.classList.contains('icon-star-empty'))
        {
            ele.classList.toggle('icon-star-empty');
            ele.classList.add("icon-star");
            axios.post('/api/bookmarks/' + id, {favorite: true}).then(function (payload) {
                console.log(JSON.stringify(payload));
            });

            return;
        }

        ele.classList.toggle('icon-star');
        ele.classList.add('icon-star-empty');
        axios.post('/api/bookmarks/' + id, {favorite: false}).then(function (payload) {
            console.log(JSON.stringify(payload));
        });
    };

    function printBookmarkListItem(container, template, context) {
        container.innerHTML += template(context);
    }

    BookmarkExplorer.prototype.search = function (event, element) {
        if (event)
        {
            event.preventDefault();
        }

        var urlArr = ['/api/bookmarks'];
        var elements = event.type === 'change' ? element.form : element.elements;
        urlArr.push('?search=' + elements.search.value);
        urlArr.push('&sortBy=' + elements.options.value);
        
        var url = urlArr.join('');
        axios.get(url).then(dislplayBookmarks, app.errorDialog.show);
    };


    BookmarkExplorer.prototype.getFolders = function () {

        var request = axios.get('/api/bookmarks/folders');

        var folders;
        return request.then(function (response) {
            return response.data;
        });

        request.catch(app.errorDialog.show);

    };
    
    
    app.bookmarkExplorer = new BookmarkExplorer();

})(window);
