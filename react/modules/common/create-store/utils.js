export var jsonClone = obj => JSON.parse(JSON.stringify(obj));

export var makeId = LENGTH => { // https://stackoverflow.com/a/1349426
    LENGTH = LENGTH || 5;
    var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var text = [];
    for (var i = 0; i < LENGTH; i++) {
        text[i] = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return text.join('');
};

export var uniqueId = f => Date.now() + '_' + makeId(4);

export var isDebugging = function() {
    var conditions = [ // only need 1 condition to be true
        window._debug,
        ['192.168.60.70'].includes(window.location && window.location.hostname),
        window.locationStorage && locationStorage.getItem('_debug'),
        window.sessionStorage && sessionStorage.getItem('_debug')
    ];
    return conditions.some(function(item) { return !!item; });
};

export var getStackTrace = function() { // return array of stacktrace
    try {
        throw new Error('getStackTrace');
    } catch (e) {
        try {
            return e.stack.toString().trim().split('\n').map(function(item) {
                item = item.trim();
                if (item.startsWith('at ')) item = item.replace('at ', '');
                return item;
            });
        } catch (err) {
            console.warn(err);
            return [];
        }
    }
};