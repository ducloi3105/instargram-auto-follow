const DOMUtil = {
    offset: function (node) {
        var rect = node.getBoundingClientRect();
        return {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft
        }
    }
}

export default DOMUtil;