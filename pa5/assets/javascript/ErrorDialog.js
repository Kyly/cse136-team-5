(function () {
    var app         = this['App'];
    app.errorDialog = new ErrorDialog();

    var errorDialog;

    function ErrorDialog() {
        errorDialog = this;
        errorDialog.template = app.templates['assets/templates/bm-error-dialog.hbs'];
    }

    ErrorDialog.prototype.show = function showErrorDialog(error) {
        if (error.status === 401) {
            window.location = '/';
            return;
        }

        app.show('bm-error-dialog', errorDialog.template, error);
    };

})(window);