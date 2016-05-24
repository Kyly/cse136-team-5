/* Classes for elements - Everything gets attached to app class */
(function () {

    var app = this['App'];
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
    
    /* Bookmark uploader */
    function BookmarkUploader() {
        this.template = app.templates['assets/templates/upload-file.hbs'];
    }

    BookmarkUploader.prototype.show = function showBookmarkUploader() {
        app.show('bm-upload-file-dialog', this.template);
    };

})(window);
