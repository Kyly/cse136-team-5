/* Classes for elements - Everything gets attached to app class */
(function () {

    var app = this['App'];
    function BookmarkUploader() {
        this.template = app.templates['assets/templates/upload-file.hbs'];
    }

    BookmarkUploader.prototype.show = function showBookmarkUploader() {
        app.show('bm-upload-file-dialog', this.template);
    };

    app.bookmarkUploader = new BookmarkUploader();
})(window);
