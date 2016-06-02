(function () {
    var app              = this['App'];
    var create = this;
    function CreateFolder() {
        create.template = app.templates['assets/templates/bm-create-folder.hbs'];
    }

    CreateFolder.prototype.show = function showCreateFolder() {
        // app.show('bm-create-folder-dialog', create.template);

        var request = axios.get('/api/bookmarks/folders');

        request.then(function (folders) {
            var context = {folders: folders.data};
            console.log('folders ', folders);
            app.show('bm-create-folder-dialog', create.template, context);
        });

        request.catch(app.errorDialog.show);
    };
    
    app.createFolder = new CreateFolder();
    
})(window);