import {safeInvoke} from './function-util.js'

export const loadJs = function (url, callback) {
    if (!url) return;

    var arrScripts = document.querySelectorAll('script[src^="' + url + '"]');
    if (arrScripts && arrScripts.length) {
        return;
    }

    try {
        var scriptEl = document.createElement('script');
        scriptEl.type = 'text/javascript';
        scriptEl.src = url;
        scriptEl.onload = scriptEl.onreadystatechange = function () {
            safeInvoke(callback)
        };
        scriptEl.addEventListener('error', function (err) {
            head.removeChild(scriptEl);
            safeInvoke(callback, err)

        });
        head.appendChild(scriptEl);
    }
    catch (ex) {
        safeInvoke(callback, ex)
    }
}