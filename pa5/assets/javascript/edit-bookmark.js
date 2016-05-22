(function () {
    var app          = this['App'];
    app.bookmarkEdit = new BookmarkEdit();

    function BookmarkEdit() {
        this.template = app.templates['assets/templates/bm-edit-dialog.hbs'];
    }

    BookmarkEdit.prototype.show = function showBookmarkEdit() {
        app.show('bm-edit-dialog', this.template);
    };

    BookmarkEdit.prototype.remove = function removeBookmarkEdit(event) {
        if (event)
        {
            event.preventDefault();
        }

        hide('bm-edit-dialog');
    };
})(window);