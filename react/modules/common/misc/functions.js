// Thai
require('./polyfills');

var Misc = Object.assign(
    require('./functions-independent')
    // require('./functions-ims')
);

module.exports = window._Misc = Misc;