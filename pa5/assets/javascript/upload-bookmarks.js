(function () {
    var app            = this['App'];
    app.bookmarkUploader = new BookmarkUploader();

    /* Bookmark uploader */
    function BookmarkUploader() {
        this.myDropzone = new Dropzone("bm-upload-file-dialog", { url: "/api/bookmarks/upload", acceptedFiles : [".csv"] });
        this.template = app.templates['assets/templates/upload-file.hbs'];
    }

    BookmarkUploader.prototype.show = function showBookmarkUploader() {
        app.show('bm-upload-file-dialog', this.template);
    };

    BookmarkUploader.prototype.remove = function hideBookmarkUploader() {
        hide('bm-upload-file-dialog');
    };

})(window);
