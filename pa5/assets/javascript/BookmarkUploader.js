/* Classes for elements - Everything gets attached to app class */
(function () {

    var app = this['App'];
    function BookmarkUploader() {
        this.myDropzone = null;
        this.template = app.templates['assets/templates/upload-file.hbs'];
    }

    BookmarkUploader.prototype.show = function showBookmarkUploader() {
        app.show('bm-upload-file-dialog', this.template);
        myDropzone = new Dropzone("bm-upload-file-dialog bm-dialog-body", {
            url: "/api/bookmarks/upload", 
            acceptedFiles: '.csv',
            uploadMultiple: false,
            createImageThumbnails: false,
            clickable: true,
            addRemoveLinks: true,
            });
    };

    BookmarkUploader.prototype.remove = function removeBookmarkCreate(event) {
        if (event)
        {
            event.preventDefault();
        }

        app.hide('bm-upload-file-dialog');
    };
    app.bookmarkUploader = new BookmarkUploader();
})(window);
