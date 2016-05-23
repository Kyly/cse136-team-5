(function () {
    var app = this['App'];
    //var dialogContainer = document.getElementById('searchwords');
    app.search = new Sort();

    function Sort() {

    }

    Sort.prototype.search = function () {
        var e = document.getElementById('sorto');
        var text = e.options[e.selectedIndex].text;
        axios.post('/sort', { sortBy:text  })
            .then(function (payload) {
                console.log(JSON.stringify(payload));
            })
            .catch(function (payload) {
                console.log(JSON.stringify(payload));
            });
    }
})(window);