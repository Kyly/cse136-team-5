/* Classes for elements - Everything gets attached to app class */
(function () {

    var app = this['App'];
    var uploader;
    function BookmarkUploader() {
        uploader = this;
        uploader.myDropzone = null;
        uploader.template   = app.templates['assets/templates/upload-file.hbs'];
    }

    BookmarkUploader.prototype.show = function showBookmarkUploader() {
        app.show('bm-upload-file-dialog', this.template);
        var dz = uploader.myDropzone = new Dropzone('bm-upload-file-dialog bm-dialog-body', {
            url: '/api/bookmarks/upload',
            acceptedFiles: '.csv',
            paramName: 'file',
            uploadMultiple: false,
            createImageThumbnails: false,
            clickable: true,
            addRemoveLinks: true
        });

        dz.on('error', function (file, errorMessage, xhr) {
            console.log(file, errorMessage, xhr);
            if (typeof errorMessage !== "String") {
                if (errorMessage.name && errorMessage.message) {
                    errorMessage.name = "Upload Error: " + errorMessage.name;
                    app.errorDialog.show(errorMessage);
                } else {
                    var error = new Error("Something went wrong!");
                    error.name = "Upload Error";
                    app.errorDialog.show(error);
                }
            } else {
                var error = new Error(errorMessage);
                error.name = "Upload Error";
                app.errorDialog.show(error);
            }
            var element = document.getElementsByTagName('bm-upload-file-dialog')[0];
            app.dialogContainer.removeChild(element);
        });
    };

    app.bookmarkUploader = new BookmarkUploader();

})(window);
