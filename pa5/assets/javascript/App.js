/* Classes for elements - Everything gets attached to App class */
(function () {

    history.pushState({ login: '' }, 'index', '/');

    var app = this.app = this['App'];
    var dialogContainer = app.dialogContainer = document.getElementById('bookmark-dialog');

    app.remove = function remove(event, el, tag) {
        if (event)
        {
            event.preventDefault();
        }
        var parent = app.getParentByTagName(el, tag);
        dialogContainer.removeChild(parent);
    };

    app.show = function show(tag, template, context) {

        context = context || {};

        var elements = document.getElementsByTagName(tag);
        /* Check if element is present */
        if (elements.length !== 0)
        {
            var element = elements[0];
            app.remove(null, element, tag);

        }
        //console.log(id);
        /* Inserts html as first child element */
        dialogContainer.insertAdjacentHTML('afterbegin', template(context));
    };

    app.displayAsFirstChild = function displayAsFirstChild(element) {
        var firstChild = dialogContainer.firstChild;

        /* Shows element as the first child */
        dialogContainer.insertBefore(element, firstChild);
        element.style.display = 'flex';
    };

    app.getDisplay = function getDisplay(element) {
        return element.currentStyle ? element.currentStyle.display :
               getComputedStyle(element, null).display;
    };

    app.getParentByTagName = function getParentByTagName(node, tagname) {
        var parent;
        if (node === null || tagname === '')
        {
            return;
        }
        parent  = node.parentNode;
        tagname = tagname.toUpperCase();

        while (parent.tagName !== "HTML")
        {
            if (parent.tagName === tagname)
            {
                return parent;
            }
            parent = parent.parentNode;
        }

        return parent;
    }

})(window);
