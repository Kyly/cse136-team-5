/* Custom element definitions */
(function () {
    /* Custom element for uploader */
    var bmApp = document.registerElement('bm-app', {
        prototype: Object.create(HTMLButtonElement.prototype),
        extends: 'div'
    });

    document.body.appendChild(new bmApp());

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

/* Classes for elements - Everything gets attached to App class */
(function () {

    var request         = window.superagent;
    this['App']         = this['App'] || {};
    var App             = this['App'];
    var dialogContainer = document.getElementById('bookmark-dialog');

    App.bookmarkExplorer = new BookmarkExplorer();
    App.bookmarkUploader = new BookmarkUploader();
    App.bookmarkCreate   = new BookmarkCreate();
    App.bookmarkEdit     = new BookmarkEdit();
    App.createFolder     = new CreateFolder();

    function CreateFolder() {
        this.template = App.templates['assets/templates/bm-create-folder.hbs'];
    }

    CreateFolder.prototype.show = function showCreateFolder() {
        show('bm-create-folder-dialog', this.template);
    };

    CreateFolder.prototype.remove = function hideCreateFolder() {
        hide('bm-create-folder-dialog');
    };

    /* Mock Bookmark Service*/
    function getBookmarks() {

        var bookmarks = {
            parent: null,
            name: 'root',
            url: '',
            children: [{
                parent: 'root',
                name: 'Python Tutorial',
                url: 'http://www.fromdev.com/2014/03/python-tutorials-resources.html',
                children: []
            }, {
                parent: 'root',
                name: 'Hightimes',
                url: 'hhttp://www.hightimes.com/',
                children: []
            }, {
                parent: 'root',
                name: 'School',
                url: 'sdklnjln',
                children: []
            }, {
                parent: 'root',
                name: 'Node JS',
                url: 'https://nodejs.org/en/',
                children: []
            }, {
                parent: 'root',
                name: 'Some other page',
                url: 'https://nodejs.org/en/',
                children: []
            }, {
                parent: 'root',
                name: 'Exciting Stuff',
                url: '',
                children: [{
                    parent: 'root',
                    name: 'Apple',
                    url: 'http://www.fromdev.com/2014/03/python-tutorials-resources.html',
                    children: []
                }, {
                    parent: 'root',
                    name: 'Google Keep',
                    url: 'hhttp://www.hightimes.com/',
                    children: []
                }, {
                    parent: 'root',
                    name: 'Netflix',
                    url: 'sdklnjln',
                    children: []
                }, {
                    parent: 'root',
                    name: 'Java',
                    url: 'https://nodejs.org/en/',
                    children: []
                }, {
                    parent: 'root',
                    name: 'Ocaml',
                    url: 'https://nodejs.org/en/',
                    children: []
                }, {
                    parent: 'root',
                    name: 'Cpp Fourms',
                    url: 'https://nodejs.org/en/',
                    children: []
                }, {
                    parent: 'root',
                    name: 'Learn CSS',
                    url: 'https://nodejs.org/en/',
                    children: []
                }]
            }, {
                parent: 'root',
                name: 'XXX',
                url: 'https://nodejs.org/en/',
                children: []
            }]
        };

        return bookmarks;
    }

    /* Code for bookmark explorer */
    function BookmarkExplorer() {
        this.container      = document.getElementById('bookmark-list');
        this.itemTemplate   = App.templates['assets/templates/bookmark-item.hbs'];
        this.folderTemplate = App.templates['assets/templates/bookmark-folder.hbs'];
        this.subFolderBack  = App.templates['assets/templates/bookmark-sub-back.hbs'];
    }

    BookmarkExplorer.prototype.showBookmarks = function showBookmarks(reference) {

        var bookExp   = this;
        var bookmarks = getBookmarks();

        document.getElementById('bookmark-list').innerHTML = "";

        if (reference == 'top')
        {
            current = bookmarks.children;
        }
        else
        {

            current = bookmarks.children[5].children;
            printBookmarkListItem(bookExp.container, bookExp.subFolderBack, {});
        }

        current.forEach(function (current) {
            if (current.url)
            {
                printBookmarkListItem(bookExp.container, bookExp.itemTemplate, current);
            }
            else
            {
                printBookmarkListItem(bookExp.container, bookExp.folderTemplate, current);
            }
        })
    };

    BookmarkExplorer.prototype.toggleFavorite = function toggleFavorite(ele) {
        if (ele.classList.contains("fa-star-o"))
        {
            ele.classList.toggle("fa-star-o");
            ele.classList.add("fa-star")
        }
        else
        {
            ele.classList.toggle("fa-star");
            ele.classList.add("fa-star-o")
        }
    };

    function printBookmarkListItem(container, template, context) {
        container.innerHTML += template(context);
    }

    /* Bookmark uploader */
    function BookmarkUploader() {
        this.template = App.templates['assets/templates/upload-file.hbs'];
    }

    BookmarkUploader.prototype.show = function showBookmarkUploader() {
        show('bm-upload-file-dialog', this.template);
    };

    BookmarkUploader.prototype.remove = function hideBookmarkUploader() {
        hide('bm-upload-file-dialog');
    };

    /* Bookmark create */
    function BookmarkCreate() {
        this.template = App.templates['assets/templates/bm-create-dialog.hbs'];
    }

    BookmarkCreate.prototype.show = function showBookmarkCreate() {
        show('bm-create-dialog', this.template);
    };

    BookmarkCreate.prototype.remove = function removeBookmarkCreate(event) {
        if (event)
        {
            event.preventDefault();
        }

        hide('bm-create-dialog');
    };

    function BookmarkEdit() {
        this.template = App.templates['assets/templates/bm-edit-dialog.hbs'];
    }

    BookmarkEdit.prototype.show = function showBookmarkEdit() {
        show('bm-edit-dialog', this.template);
    };

    BookmarkEdit.prototype.remove = function removeBookmarkEdit(event) {
        if (event)
        {
            event.preventDefault();
        }

        hide('bm-edit-dialog');
    };

    /* Show hide functionality */
    function hide(tag) {
        var elements = document.getElementsByTagName(tag);
        /* Check if element is present */
        if (elements.length !== 0)
        {
            var element           = elements[0];
            element.style.display = 'none';
        }
    }

    function show(tag, template, context) {

        context = context || {};

        var elements = document.getElementsByTagName(tag);
        /* Check if element is present */
        if (elements.length !== 0)
        {
            var element = elements[0];
            /* Check if element is shown */
            if (getDisplay(element) === 'none')
            {
                displayAsFirstChild(element);
            }

            return;
        }

        /* Inserts html as first child element */
        dialogContainer.insertAdjacentHTML('afterbegin', template(context));
    }

    function displayAsFirstChild(element) {
        var firstChild = dialogContainer.firstChild;

        /* Shows element as the first child */
        dialogContainer.insertBefore(element, firstChild);
        element.style.display = 'flex';
    }

    function getDisplay(element) {
        return element.currentStyle ? element.currentStyle.display :
               getComputedStyle(element, null).display;
    }

})(window);
