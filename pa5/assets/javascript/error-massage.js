(function () {
    var app          = this['App'];
    app.errorDialog = new ErrorDialog();
    function ErrorDialog() {
        this.template = app.templates['assets/templates/bm-error-dialog.hbs'];
    }
    
    ErrorDialog.prototype.show = function showErrorDialog(error) {
        app.show('bm-error-dialog', this.template, error);
    };
})(window);