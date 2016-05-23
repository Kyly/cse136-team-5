(function () {
    var app          = this['App'];
    app.bookmarkEdit = new BookmarkEdit();

    function BookmarkEdit() {
        this.template = app.templates['assets/templates/bm-edit-dialog.hbs'];
    }

    BookmarkEdit.prototype.show = function showBookmarkEdit(event) {
        if (event)
        {
            event.preventDefault();
        }
        
        app.show('bm-edit-dialog', this.template);
    };

    BookmarkEdit.prototype.apply = function apply(event, element) {
        if (event)
        {
            event.preventDefault();
        }

        // axios('/api/bookmarks/' + )

        console.log(JSON.stringify(element.form));
        
        app.remove(element);
    };

    BookmarkEdit.prototype.remove = function removeBookmarkEdit(event, element) {
        if (event)
        {
            event.preventDefault();
        }

        app.remove(element);
    };
})(window);