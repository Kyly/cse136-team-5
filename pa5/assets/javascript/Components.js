(function () {
    /* Custom element for uploader */
    var tags = ['bm-app', 'bm-upload-file-dialog', 'bm-dialog-close', 'bm-dialog-close',
                'bm-dialog-body', 'bm-create-dialog', 'bm-edit-dialog', 'bm-create-folder-dialog',
                'bm-error-dialog', 'bm-confirm-delete'
    ];

    for(var i = 0; i < tags.length; ++i) {
        document.createElement(tags[i]);
    }
})(window);