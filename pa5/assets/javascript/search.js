(function () {
    var app = this['App'];
    //var dialogContainer = document.getElementById('searchwords');
    app.search = new Search();

    function Search() {

    }

    Search.prototype.search = function () {
        var keywords = document.getElementById('searchwords');
        var text = keywords.options[keywords.selectedIndex].text;
        axios.post('/search', {keywords: text})
            .then(function (payload) {
                console.log(JSON.stringify(payload));
            })
            .catch(function (payload) {
                console.log(JSON.stringify(payload));
            });
    }
})(window);