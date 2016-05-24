/* Classes for elements - Everything gets attached to app class */
(function () {
    var app              = this['App'];
    function CreateFolder() {
        this.template = app.templates['assets/templates/bm-create-folder.hbs'];
    }

    CreateFolder.prototype.show = function showCreateFolder() {
        app.show('bm-create-folder-dialog', this.template);
    };
    
    app.createFolder = new CreateFolder();
})(window);
