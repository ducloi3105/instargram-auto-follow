var urlExists = function(url, success, fail, timeout) {
    try { XMLHttpRequest } catch (err) { return fail(url); }

    var token = tokensConstructor().new();

    success = success || function(url, http) {};
    fail = fail || function(url, http) {};
    timeout = timeout || 5000;

    var http = new XMLHttpRequest();
    http.open('GET', url, true);
    http.onload = function(e) {
        if (http.readyState === 4) {
            if (http.status === 200) {
                if (token.isStillValid()) {
                    token.destroy();
                    success(url, http);
                }
            } else {
                if (token.isStillValid()) {
                    token.destroy();
                    fail(url, http);
                }
            }
        }
    };
    http.onerror = function(e) {
        if (token.isStillValid()) {
            token.destroy();
            fail(url, http);
        }
    };
    http.send();

    setTimeout(function() {
        if (token.isStillValid()) {
            token.destroy();
            fail(url, http);
        }
    }, timeout);
};

var waitForUrl = function(url, success, fail, extraOpts) {
    success = success || function() {};
    fail = fail || function() {};
    extraOpts = extraOpts || {};
    var numOfRetries = !isNaN(parseInt(extraOpts.retries)) ? extraOpts.retries : 20;
    var retryInterval = !isNaN(parseInt(extraOpts.interval)) ? extraOpts.interval : 500;
    var shouldWaitingStop = extraOpts.shouldWaitingStop || function() {};

    (function loop(i) {
        if (shouldWaitingStop()) return;
        if (i > numOfRetries) return fail(url);
        urlExists(url, success, function() {
            setTimeout(function() {
                loop(i + 1);
            }, retryInterval);
        });
    })(1);
};

var jsonEqual = function(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
};

var formatUnicode = (function() {
    var unicodeMap = {"Á":"A","Ă":"A","Ắ":"A","Ặ":"A","Ằ":"A","Ẳ":"A","Ẵ":"A","Ǎ":"A","Â":"A","Ấ":"A","Ậ":"A","Ầ":"A","Ẩ":"A","Ẫ":"A","Ä":"A","Ǟ":"A","Ȧ":"A","Ǡ":"A","Ạ":"A","Ȁ":"A","À":"A","Ả":"A","Ȃ":"A","Ā":"A","Ą":"A","Å":"A","Ǻ":"A","Ḁ":"A","Ⱥ":"A","Ã":"A","Ꜳ":"AA","Æ":"AE","Ǽ":"AE","Ǣ":"AE","Ꜵ":"AO","Ꜷ":"AU","Ꜹ":"AV","Ꜻ":"AV","Ꜽ":"AY","Ḃ":"B","Ḅ":"B","Ɓ":"B","Ḇ":"B","Ƀ":"B","Ƃ":"B","Ć":"C","Č":"C","Ç":"C","Ḉ":"C","Ĉ":"C","Ċ":"C","Ƈ":"C","Ȼ":"C","Ď":"D","Ḑ":"D","Ḓ":"D","Ḋ":"D","Ḍ":"D","Ɗ":"D","Ḏ":"D","ǲ":"D","ǅ":"D","Đ":"D","Ƌ":"D","Ǳ":"DZ","Ǆ":"DZ","É":"E","Ĕ":"E","Ě":"E","Ȩ":"E","Ḝ":"E","Ê":"E","Ế":"E","Ệ":"E","Ề":"E","Ể":"E","Ễ":"E","Ḙ":"E","Ë":"E","Ė":"E","Ẹ":"E","Ȅ":"E","È":"E","Ẻ":"E","Ȇ":"E","Ē":"E","Ḗ":"E","Ḕ":"E","Ę":"E","Ɇ":"E","Ẽ":"E","Ḛ":"E","Ꝫ":"ET","Ḟ":"F","Ƒ":"F","Ǵ":"G","Ğ":"G","Ǧ":"G","Ģ":"G","Ĝ":"G","Ġ":"G","Ɠ":"G","Ḡ":"G","Ǥ":"G","Ḫ":"H","Ȟ":"H","Ḩ":"H","Ĥ":"H","Ⱨ":"H","Ḧ":"H","Ḣ":"H","Ḥ":"H","Ħ":"H","Í":"I","Ĭ":"I","Ǐ":"I","Î":"I","Ï":"I","Ḯ":"I","İ":"I","Ị":"I","Ȉ":"I","Ì":"I","Ỉ":"I","Ȋ":"I","Ī":"I","Į":"I","Ɨ":"I","Ĩ":"I","Ḭ":"I","Ꝺ":"D","Ꝼ":"F","Ᵹ":"G","Ꞃ":"R","Ꞅ":"S","Ꞇ":"T","Ꝭ":"IS","Ĵ":"J","Ɉ":"J","Ḱ":"K","Ǩ":"K","Ķ":"K","Ⱪ":"K","Ꝃ":"K","Ḳ":"K","Ƙ":"K","Ḵ":"K","Ꝁ":"K","Ꝅ":"K","Ĺ":"L","Ƚ":"L","Ľ":"L","Ļ":"L","Ḽ":"L","Ḷ":"L","Ḹ":"L","Ⱡ":"L","Ꝉ":"L","Ḻ":"L","Ŀ":"L","Ɫ":"L","ǈ":"L","Ł":"L","Ǉ":"LJ","Ḿ":"M","Ṁ":"M","Ṃ":"M","Ɱ":"M","Ń":"N","Ň":"N","Ņ":"N","Ṋ":"N","Ṅ":"N","Ṇ":"N","Ǹ":"N","Ɲ":"N","Ṉ":"N","Ƞ":"N","ǋ":"N","Ñ":"N","Ǌ":"NJ","Ó":"O","Ŏ":"O","Ǒ":"O","Ô":"O","Ố":"O","Ộ":"O","Ồ":"O","Ổ":"O","Ỗ":"O","Ö":"O","Ȫ":"O","Ȯ":"O","Ȱ":"O","Ọ":"O","Ő":"O","Ȍ":"O","Ò":"O","Ỏ":"O","Ơ":"O","Ớ":"O","Ợ":"O","Ờ":"O","Ở":"O","Ỡ":"O","Ȏ":"O","Ꝋ":"O","Ꝍ":"O","Ō":"O","Ṓ":"O","Ṑ":"O","Ɵ":"O","Ǫ":"O","Ǭ":"O","Ø":"O","Ǿ":"O","Õ":"O","Ṍ":"O","Ṏ":"O","Ȭ":"O","Ƣ":"OI","Ꝏ":"OO","Ɛ":"E","Ɔ":"O","Ȣ":"OU","Ṕ":"P","Ṗ":"P","Ꝓ":"P","Ƥ":"P","Ꝕ":"P","Ᵽ":"P","Ꝑ":"P","Ꝙ":"Q","Ꝗ":"Q","Ŕ":"R","Ř":"R","Ŗ":"R","Ṙ":"R","Ṛ":"R","Ṝ":"R","Ȑ":"R","Ȓ":"R","Ṟ":"R","Ɍ":"R","Ɽ":"R","Ꜿ":"C","Ǝ":"E","Ś":"S","Ṥ":"S","Š":"S","Ṧ":"S","Ş":"S","Ŝ":"S","Ș":"S","Ṡ":"S","Ṣ":"S","Ṩ":"S","Ť":"T","Ţ":"T","Ṱ":"T","Ț":"T","Ⱦ":"T","Ṫ":"T","Ṭ":"T","Ƭ":"T","Ṯ":"T","Ʈ":"T","Ŧ":"T","Ɐ":"A","Ꞁ":"L","Ɯ":"M","Ʌ":"V","Ꜩ":"TZ","Ú":"U","Ŭ":"U","Ǔ":"U","Û":"U","Ṷ":"U","Ü":"U","Ǘ":"U","Ǚ":"U","Ǜ":"U","Ǖ":"U","Ṳ":"U","Ụ":"U","Ű":"U","Ȕ":"U","Ù":"U","Ủ":"U","Ư":"U","Ứ":"U","Ự":"U","Ừ":"U","Ử":"U","Ữ":"U","Ȗ":"U","Ū":"U","Ṻ":"U","Ų":"U","Ů":"U","Ũ":"U","Ṹ":"U","Ṵ":"U","Ꝟ":"V","Ṿ":"V","Ʋ":"V","Ṽ":"V","Ꝡ":"VY","Ẃ":"W","Ŵ":"W","Ẅ":"W","Ẇ":"W","Ẉ":"W","Ẁ":"W","Ⱳ":"W","Ẍ":"X","Ẋ":"X","Ý":"Y","Ŷ":"Y","Ÿ":"Y","Ẏ":"Y","Ỵ":"Y","Ỳ":"Y","Ƴ":"Y","Ỷ":"Y","Ỿ":"Y","Ȳ":"Y","Ɏ":"Y","Ỹ":"Y","Ź":"Z","Ž":"Z","Ẑ":"Z","Ⱬ":"Z","Ż":"Z","Ẓ":"Z","Ȥ":"Z","Ẕ":"Z","Ƶ":"Z","Ĳ":"IJ","Œ":"OE","ᴀ":"A","ᴁ":"AE","ʙ":"B","ᴃ":"B","ᴄ":"C","ᴅ":"D","ᴇ":"E","ꜰ":"F","ɢ":"G","ʛ":"G","ʜ":"H","ɪ":"I","ʁ":"R","ᴊ":"J","ᴋ":"K","ʟ":"L","ᴌ":"L","ᴍ":"M","ɴ":"N","ᴏ":"O","ɶ":"OE","ᴐ":"O","ᴕ":"OU","ᴘ":"P","ʀ":"R","ᴎ":"N","ᴙ":"R","ꜱ":"S","ᴛ":"T","ⱻ":"E","ᴚ":"R","ᴜ":"U","ᴠ":"V","ᴡ":"W","ʏ":"Y","ᴢ":"Z","á":"a","ă":"a","ắ":"a","ặ":"a","ằ":"a","ẳ":"a","ẵ":"a","ǎ":"a","â":"a","ấ":"a","ậ":"a","ầ":"a","ẩ":"a","ẫ":"a","ä":"a","ǟ":"a","ȧ":"a","ǡ":"a","ạ":"a","ȁ":"a","à":"a","ả":"a","ȃ":"a","ā":"a","ą":"a","ᶏ":"a","ẚ":"a","å":"a","ǻ":"a","ḁ":"a","ⱥ":"a","ã":"a","ꜳ":"aa","æ":"ae","ǽ":"ae","ǣ":"ae","ꜵ":"ao","ꜷ":"au","ꜹ":"av","ꜻ":"av","ꜽ":"ay","ḃ":"b","ḅ":"b","ɓ":"b","ḇ":"b","ᵬ":"b","ᶀ":"b","ƀ":"b","ƃ":"b","ɵ":"o","ć":"c","č":"c","ç":"c","ḉ":"c","ĉ":"c","ɕ":"c","ċ":"c","ƈ":"c","ȼ":"c","ď":"d","ḑ":"d","ḓ":"d","ȡ":"d","ḋ":"d","ḍ":"d","ɗ":"d","ᶑ":"d","ḏ":"d","ᵭ":"d","ᶁ":"d","đ":"d","ɖ":"d","ƌ":"d","ı":"i","ȷ":"j","ɟ":"j","ʄ":"j","ǳ":"dz","ǆ":"dz","é":"e","ĕ":"e","ě":"e","ȩ":"e","ḝ":"e","ê":"e","ế":"e","ệ":"e","ề":"e","ể":"e","ễ":"e","ḙ":"e","ë":"e","ė":"e","ẹ":"e","ȅ":"e","è":"e","ẻ":"e","ȇ":"e","ē":"e","ḗ":"e","ḕ":"e","ⱸ":"e","ę":"e","ᶒ":"e","ɇ":"e","ẽ":"e","ḛ":"e","ꝫ":"et","ḟ":"f","ƒ":"f","ᵮ":"f","ᶂ":"f","ǵ":"g","ğ":"g","ǧ":"g","ģ":"g","ĝ":"g","ġ":"g","ɠ":"g","ḡ":"g","ᶃ":"g","ǥ":"g","ḫ":"h","ȟ":"h","ḩ":"h","ĥ":"h","ⱨ":"h","ḧ":"h","ḣ":"h","ḥ":"h","ɦ":"h","ẖ":"h","ħ":"h","ƕ":"hv","í":"i","ĭ":"i","ǐ":"i","î":"i","ï":"i","ḯ":"i","ị":"i","ȉ":"i","ì":"i","ỉ":"i","ȋ":"i","ī":"i","į":"i","ᶖ":"i","ɨ":"i","ĩ":"i","ḭ":"i","ꝺ":"d","ꝼ":"f","ᵹ":"g","ꞃ":"r","ꞅ":"s","ꞇ":"t","ꝭ":"is","ǰ":"j","ĵ":"j","ʝ":"j","ɉ":"j","ḱ":"k","ǩ":"k","ķ":"k","ⱪ":"k","ꝃ":"k","ḳ":"k","ƙ":"k","ḵ":"k","ᶄ":"k","ꝁ":"k","ꝅ":"k","ĺ":"l","ƚ":"l","ɬ":"l","ľ":"l","ļ":"l","ḽ":"l","ȴ":"l","ḷ":"l","ḹ":"l","ⱡ":"l","ꝉ":"l","ḻ":"l","ŀ":"l","ɫ":"l","ᶅ":"l","ɭ":"l","ł":"l","ǉ":"lj","ſ":"s","ẜ":"s","ẛ":"s","ẝ":"s","ḿ":"m","ṁ":"m","ṃ":"m","ɱ":"m","ᵯ":"m","ᶆ":"m","ń":"n","ň":"n","ņ":"n","ṋ":"n","ȵ":"n","ṅ":"n","ṇ":"n","ǹ":"n","ɲ":"n","ṉ":"n","ƞ":"n","ᵰ":"n","ᶇ":"n","ɳ":"n","ñ":"n","ǌ":"nj","ó":"o","ŏ":"o","ǒ":"o","ô":"o","ố":"o","ộ":"o","ồ":"o","ổ":"o","ỗ":"o","ö":"o","ȫ":"o","ȯ":"o","ȱ":"o","ọ":"o","ő":"o","ȍ":"o","ò":"o","ỏ":"o","ơ":"o","ớ":"o","ợ":"o","ờ":"o","ở":"o","ỡ":"o","ȏ":"o","ꝋ":"o","ꝍ":"o","ⱺ":"o","ō":"o","ṓ":"o","ṑ":"o","ǫ":"o","ǭ":"o","ø":"o","ǿ":"o","õ":"o","ṍ":"o","ṏ":"o","ȭ":"o","ƣ":"oi","ꝏ":"oo","ɛ":"e","ᶓ":"e","ɔ":"o","ᶗ":"o","ȣ":"ou","ṕ":"p","ṗ":"p","ꝓ":"p","ƥ":"p","ᵱ":"p","ᶈ":"p","ꝕ":"p","ᵽ":"p","ꝑ":"p","ꝙ":"q","ʠ":"q","ɋ":"q","ꝗ":"q","ŕ":"r","ř":"r","ŗ":"r","ṙ":"r","ṛ":"r","ṝ":"r","ȑ":"r","ɾ":"r","ᵳ":"r","ȓ":"r","ṟ":"r","ɼ":"r","ᵲ":"r","ᶉ":"r","ɍ":"r","ɽ":"r","ↄ":"c","ꜿ":"c","ɘ":"e","ɿ":"r","ś":"s","ṥ":"s","š":"s","ṧ":"s","ş":"s","ŝ":"s","ș":"s","ṡ":"s","ṣ":"s","ṩ":"s","ʂ":"s","ᵴ":"s","ᶊ":"s","ȿ":"s","ɡ":"g","ᴑ":"o","ᴓ":"o","ᴝ":"u","ť":"t","ţ":"t","ṱ":"t","ț":"t","ȶ":"t","ẗ":"t","ⱦ":"t","ṫ":"t","ṭ":"t","ƭ":"t","ṯ":"t","ᵵ":"t","ƫ":"t","ʈ":"t","ŧ":"t","ᵺ":"th","ɐ":"a","ᴂ":"ae","ǝ":"e","ᵷ":"g","ɥ":"h","ʮ":"h","ʯ":"h","ᴉ":"i","ʞ":"k","ꞁ":"l","ɯ":"m","ɰ":"m","ᴔ":"oe","ɹ":"r","ɻ":"r","ɺ":"r","ⱹ":"r","ʇ":"t","ʌ":"v","ʍ":"w","ʎ":"y","ꜩ":"tz","ú":"u","ŭ":"u","ǔ":"u","û":"u","ṷ":"u","ü":"u","ǘ":"u","ǚ":"u","ǜ":"u","ǖ":"u","ṳ":"u","ụ":"u","ű":"u","ȕ":"u","ù":"u","ủ":"u","ư":"u","ứ":"u","ự":"u","ừ":"u","ử":"u","ữ":"u","ȗ":"u","ū":"u","ṻ":"u","ų":"u","ᶙ":"u","ů":"u","ũ":"u","ṹ":"u","ṵ":"u","ᵫ":"ue","ꝸ":"um","ⱴ":"v","ꝟ":"v","ṿ":"v","ʋ":"v","ᶌ":"v","ⱱ":"v","ṽ":"v","ꝡ":"vy","ẃ":"w","ŵ":"w","ẅ":"w","ẇ":"w","ẉ":"w","ẁ":"w","ⱳ":"w","ẘ":"w","ẍ":"x","ẋ":"x","ᶍ":"x","ý":"y","ŷ":"y","ÿ":"y","ẏ":"y","ỵ":"y","ỳ":"y","ƴ":"y","ỷ":"y","ỿ":"y","ȳ":"y","ẙ":"y","ɏ":"y","ỹ":"y","ź":"z","ž":"z","ẑ":"z","ʑ":"z","ⱬ":"z","ż":"z","ẓ":"z","ȥ":"z","ẕ":"z","ᵶ":"z","ᶎ":"z","ʐ":"z","ƶ":"z","ɀ":"z","ﬀ":"ff","ﬃ":"ffi","ﬄ":"ffl","ﬁ":"fi","ﬂ":"fl","ĳ":"ij","œ":"oe","ﬆ":"st","ₐ":"a","ₑ":"e","ᵢ":"i","ⱼ":"j","ₒ":"o","ᵣ":"r","ᵤ":"u","ᵥ":"v","ₓ":"x"}
    return function(string) {
        var arr = string.split('');
        arr.forEach(function(letter, i) {
            if (unicodeMap[letter]) arr[i] = unicodeMap[letter];
        });
        return arr.join('');
    };
})();

var immutableClone = function(objOrArray) {
    return JSON.parse(JSON.stringify(objOrArray));
};

var dateConvert = function(date, opt, offset) {
    // parse date or from unix date -> 16/08/2017 14:56:23
    // opt === 'showHHmm' -> hours + minutes
    // opt === 'showHHmmss' -> hours + minutes + seconds
    opt = opt || '';
    offset = isNaN(parseInt(offset)) ? 0 : parseInt(offset);
    date = (function tryToParseDate(date, i) {
        var d;
        switch (i) {
            case 0:
                d = new Date(Misc.int(date));
                break;
            case 1:
                d = new Date(date);
                break;
            default:
                return ''; // cant parse
        }

        if (!isNaN(d.getTime())) return new Date(d.getTime() + offset);
        else return tryToParseDate(date, i + 1);
    })(date, 0);
    if (!date) return '';

    var dd = String(date.getDate());
    if (dd.length === 1) dd = '0' + dd;
    var MM = String(date.getMonth() + 1);
    if (MM.length === 1) MM = '0' + MM;
    var yy = String(date.getFullYear());
    if (yy.length === 1) yy = '000' + yy;
    if (yy.length === 2) yy = '00' + yy;
    if (yy.length === 3) yy = '0' + yy;
    var HH = String(date.getHours());
    if (HH.length === 1) HH = '0' + HH;
    var mm = String(date.getMinutes());
    if (mm.length === 1) mm = '0' + mm;
    var ss = String(date.getSeconds());
    if (ss.length === 1) ss = '0' + ss;

    var _return = dd + '/' + MM + '/' + yy;
    if (~opt.toLowerCase().indexOf('hhmmss')) _return += ' ' + HH + ':' + mm + ':' + ss;
    else if (~opt.toLowerCase().indexOf('hhmm')) _return += ' ' + HH + ':' + mm;
    return _return;
};

var getDateMonthYear = function(date, opt) {
    // parse date then format to dd.mm.yyyy
    if (!date || Date.parse(date) < 0) return '';
    date = new Date(Date.parse(date));
    if (date === 'Invalid Date') return '';
    var dd = date.getDate();
    if (dd.toString().length === 1) dd = '0' + dd;
    var MM = date.getMonth() + 1;
    if (MM.toString().length === 1) MM = '0' + MM;
    var yy = date.getFullYear();
    if (yy.toString().length === 1) yy = '000' + yy;
    if (yy.toString().length === 2) yy = '00' + yy;
    if (yy.toString().length === 3) yy = '0' + yy;

    if (opt && opt.toLowerCase() === 'dd/mm/yyyy') {
        return dd + '/' + MM + '/' + yy;
    }
    return dd + '.' + MM + '.' + yy;
};

var detectIE = function() {
    try { window.navigator.userAgent } catch (err) { return; }
    var ua = window.navigator.userAgent;
    // Test values; Uncomment to check result …
    // IE 10
    // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';
    // IE 11
    // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';
    // Edge 12 (Spartan)
    // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';
    // Edge 13
    // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';
    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }
    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
    var edge = ua.indexOf('Edge/');
        if (edge > 0) {
        // Edge (IE 12+) => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }
    // other browser
    return false;
};

var isChrome = function() {
    try { window.chrome } catch (err) { return; }
    var temp1 = Object.getOwnPropertyNames(window.chrome);
    if (temp1.length > 0) return true;
};

var existElement = function(selector) {
    try { return document.querySelector(selector); } catch (err) { return; }
};

var waitForElement = function(selector, callback, timeoutMs) {
    timeoutMs = timeoutMs || 5000;
    var interv = setInterval(function() {
        var element = existElement(selector);
        if (element) {
            callback(null, element);
            clearInterval(interv);
            clearTimeout(timeout);
        }
    }, 100);
    var timeout = setTimeout(function() {
        clearInterval(interv);
        callback('timedout', null);
    }, timeoutMs);
};

var objAssign = Object.assign;

var tokensConstructor = function() {
    var _tokens = {};
    var generateNew = function(name) {
        name = name || String(Date.now());
        _tokens[name] = Date.now();
        return get(name);
    };
    var get = function(name) {
        if (!_tokens[name]) generateNew(name);
        var token = _tokens[name];
        var isStillValid = function() {
            if (!token) return false;
            return token === _tokens[name];
        };
        var destroy = function() {
            generateNew(name);
        };
        return {
            isStillValid: isStillValid,
            destroy: destroy
        };
    };
    var getVal = function(name) {
        return _tokens[name];
    };
    return {
        new: generateNew,
        get: get,
        getVal: getVal
    };
};

var isNumeric = function(n) {
    // [
    //     '-1', // true
    //     '-1.5', // true
    //     '0', // true
    //     '0.42', // true
    //     '.42', // true
    //     '0x89f', // true
    //     '99,999', // false
    //     '#abcdef', // false
    //     '1.2.3', // false
    //     '', // false
    //     ' ', // false
    //     'blah' // false
    // ];
    return !isNaN(parseFloat(n)) && isFinite(n);
};

var isInteger = function(n) {
    return parseInt(n) == n;
};

var getUniqueString = (function() {
    var i = 470000;
    return function() {
        return (i++).toString(36); // convert number to base36
    };
})();

var makeId = function(LENGTH) { // https://stackoverflow.com/a/1349426
    LENGTH = LENGTH || 5;
    var CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    var text = [];
    for (var i = 0; i < LENGTH; i++) {
        text[i] = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    return text.join('');
};

var viewsFormat = function(num) {
    num = parseInt(num);
    if (isNaN(num)) return '';
    if (num >= 1000000) return Math.floor(num/100000)/10 + 'M';
    if (num >= 1000) return Math.floor(num/1000) + 'K';
    return String(num);
};

var encodeQueryString = function(obj) {
    try {
        if (!obj || obj.constructor !== Object) throw new Error('must be object');
        var params = [];
        for (var key in obj) {
            var val = obj[key];
            if (val === undefined || val === null) val = '';
            params.push(key + '=' + encodeURIComponent(val));
        }
        return params.join('&');
    } catch (err) {
        console.warn(err);
        return '';
    }
};

var decodeQueryString = function(str) {
    try {
        var obj = {};
        str.split('&').forEach(function(part) {
            var item = part.split('=');
            var name = item[0];
            if (!name) return;
            var val = item[1];
            if (val === undefined || val === null) val = '';
            obj[name] = decodeURIComponent(val);
        });
        return obj;
    } catch (err) {
        console.warn(err);
        return {};
    }
};

var getStackTrace = function() { // return array of stacktrace
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

var trimSlashes = function(str) { // "//something/abc/" -> "something/abc"
    return str.replace(/^\/+|\/+$/g, '');
};

var filterAnchorTags = function(htmlContent) {
    var div = document.createElement('div');
    div.innerHTML = htmlContent;
    var aTags = div.querySelectorAll('a');
    for (var i = 0; i < aTags.length; i++) {
        aTags[i].setAttribute('href', 'javascript:void(0)');
    }
    return div.innerHTML;
};

var timeAgo = function(unixTime, useVietnamese) {
    /**
     * 44s -> [44, 'second'] (ago)
     * 45s -> [1, 'minute'] (ago)
     * 60s + 44s -> [1, 'minute'] (ago)
     * 60s + 45s -> [2, 'minute'] (ago)
     * 21h -> [21, 'hour'] (ago)
     * 22h -> [1, 'day'] (ago)
     * ... (see thresholds for more)
     */
    if (typeof unixTime !== 'number' || Number.isNaN(unixTime)) throw new Error('timeAgo invalid input');

    var currentTime = Date.now();
    var offset = currentTime - unixTime;

    if (offset < 0) return null;

    var thresholds = {
        s : 45,       // seconds to minute
        m : 45,       // minutes to hour
        h : 22,       // hours to day
        d : 26,       // days to month
        M : 11        // months to year
    };

    var seconds = Math.round(offset/1000);

    var _minutes = [Math.floor(seconds/60), seconds%60]; // [floored minutes, remainder seconds]
    var roundedMinutes = _minutes[0] + (_minutes[1] >= thresholds.s ? 1 : 0);

    var _hours = [Math.floor(seconds/60/60), seconds%(60*60)]; // [floored hours, remainder seconds]
    var roundedHours = _hours[0] + (_hours[1] >= thresholds.m*60 ? 1 : 0);

    var _days = [Math.floor(seconds/60/60/24), seconds%(60*60*24)]; // [floored days, remainder seconds]
    var roundedDays = _days[0] + (_days[1] >= thresholds.h*60*60 ? 1 : 0);

    var _months = [Math.floor(secondsToMonths(seconds)), monthsToSeconds(secondsToMonths(seconds) % 1)]; // [floored months, remainder seconds]
    var roundedMonths = _months[0] + (_months[1] >= thresholds.d*24*60*60 ? 1 : 0);

    var _years = [Math.floor(seconds/60/60/24/365), seconds%(60*60*24*365)];
    var roundedYears = _years[0] + (_years[1] > monthsToSeconds(thresholds.M) ? 1 : 0);

    var res = roundedYears >= 1 && [roundedYears, 'year'] ||
        roundedMonths >= 1 && [roundedMonths, 'month'] ||
        roundedDays >= 1 && [roundedDays, 'day'] ||
        roundedHours >= 1 && [roundedHours, 'hour'] ||
        roundedMinutes >= 1 && [roundedMinutes, 'minute'] || [seconds, 'second'];

    if (useVietnamese) {
        res[1] = res[1] === 'year' && 'năm' ||
            res[1] === 'month' && 'tháng' ||
            res[1] === 'day' && 'ngày' ||
            res[1] === 'hour' && 'giờ' ||
            res[1] === 'minute' && 'phút' || 'giây';
    }

    return res;
};

var secondsToMonths = function(ms) {
    // 400 years have 146097 days (taking into account leap year rules)
    // 400 years have 12 months === 4800
    var days = ms/60/60/24;
    return days * 4800 / 146097;
};

var monthsToSeconds = function(months) {
    // the reverse of secondsToMonths
    return (months * 146097 / 4800) * 24*60*60;
};

var isVisibleY = function(el) {
    /**
     * #inview #view #elementinview
     * check if element is visible (only in Y axis)
     */
    var rect = el.getBoundingClientRect(),
        top = rect.top,
        height = rect.height,
        el = el.parentNode;
    do {
        rect = el.getBoundingClientRect();
        if (top <= rect.bottom === false) return false;
        // Check if the element is out of view due to a container scrolling
        if (top + height <= rect.top) return false;
        el = el.parentNode;
    } while (el != document.body);
    // Check its within the document viewport
    return top <= document.documentElement.clientHeight;
};

var lowerCaseEqual = function(str1, str2) {
    try {
        return str1.toLowerCase() === str2.toLowerCase();
    } catch (err) {
        return false;
    }
};

var queueConstructor = function() {
    /**
     * wrap around callback functions
     */
    var queues = {};
    var Q = function(name) {
        if (!name) throw new Error('must specify queue name');
        queues[name] = queues[name] || [];
        var add = function(func) { // returns wrapper function
            if (queues[name].indexOf(func) === -1) queues[name].push(func);

            return function() {
                if (queues[name].indexOf(func) > -1) func.apply(null, arguments);
            };
        };
        var clear = function() {
            Q.clear(name);
            return self;
        };
        var self = {
            add: add,
            clear: clear
        };
        return self;
    };
    Q.create = function() {
        return Q(Date.now() + '_' + makeId());
    };
    Q.clear = function(name) {
        if (!name) throw new Error('must specify queue name');
        queues[name] = [];
    };
    Q.clearAll = function() {
        queues = {};
    };
    return Q;
};

var int = function(n) {
    return isInteger(n) ? parseInt(n) : NaN;
};

var isDebugging = function() {
    var conditions = [ // only need 1 condition to be true
        window._debug,
        window.location && window.location.hostname === '192.168.60.70',
        window.locationStorage && locationStorage.getItem('_debug'),
        window.sessionStorage && sessionStorage.getItem('_debug')
    ];
    return conditions.some(function(item) { return !!item; });
};

var Misc = {
    urlExists: urlExists,
    waitForUrl: waitForUrl,
    jsonEqual: jsonEqual,
    formatUnicode: formatUnicode,
    immutableClone: immutableClone,
    dateConvert: dateConvert,
    detectIE: detectIE,
    isChrome: isChrome,
    existElement: existElement,
    waitForElement: waitForElement,
    getDateMonthYear: getDateMonthYear,
    objAssign: objAssign,
    tokensConstructor: tokensConstructor,
    getUniqueString: getUniqueString,
    makeId: makeId,
    viewsFormat: viewsFormat,
    encodeQueryString: encodeQueryString,
    decodeQueryString: decodeQueryString,
    getStackTrace: getStackTrace,
    trimSlashes: trimSlashes,
    isNumeric: isNumeric,
    filterAnchorTags: filterAnchorTags,
    timeAgo: timeAgo,
    isVisibleY: isVisibleY,
    secondsToMonths: secondsToMonths,
    monthsToSeconds: monthsToSeconds,
    lowerCaseEqual: lowerCaseEqual,
    queueConstructor: queueConstructor,
    int: int,
    isDebugging: isDebugging
};

module.exports = Misc;