'use strict';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './styles/select.css';
import Scrollbars from '../../scrollbar';

var formatUnicode = (function () {
    var unicodeMap = { "Á": "A", "Ă": "A", "Ắ": "A", "Ặ": "A", "Ằ": "A", "Ẳ": "A", "Ẵ": "A", "Ǎ": "A", "Â": "A", "Ấ": "A", "Ậ": "A", "Ầ": "A", "Ẩ": "A", "Ẫ": "A", "Ä": "A", "Ǟ": "A", "Ȧ": "A", "Ǡ": "A", "Ạ": "A", "Ȁ": "A", "À": "A", "Ả": "A", "Ȃ": "A", "Ā": "A", "Ą": "A", "Å": "A", "Ǻ": "A", "Ḁ": "A", "Ⱥ": "A", "Ã": "A", "Ꜳ": "AA", "Æ": "AE", "Ǽ": "AE", "Ǣ": "AE", "Ꜵ": "AO", "Ꜷ": "AU", "Ꜹ": "AV", "Ꜻ": "AV", "Ꜽ": "AY", "Ḃ": "B", "Ḅ": "B", "Ɓ": "B", "Ḇ": "B", "Ƀ": "B", "Ƃ": "B", "Ć": "C", "Č": "C", "Ç": "C", "Ḉ": "C", "Ĉ": "C", "Ċ": "C", "Ƈ": "C", "Ȼ": "C", "Ď": "D", "Ḑ": "D", "Ḓ": "D", "Ḋ": "D", "Ḍ": "D", "Ɗ": "D", "Ḏ": "D", "ǲ": "D", "ǅ": "D", "Đ": "D", "Ƌ": "D", "Ǳ": "DZ", "Ǆ": "DZ", "É": "E", "Ĕ": "E", "Ě": "E", "Ȩ": "E", "Ḝ": "E", "Ê": "E", "Ế": "E", "Ệ": "E", "Ề": "E", "Ể": "E", "Ễ": "E", "Ḙ": "E", "Ë": "E", "Ė": "E", "Ẹ": "E", "Ȅ": "E", "È": "E", "Ẻ": "E", "Ȇ": "E", "Ē": "E", "Ḗ": "E", "Ḕ": "E", "Ę": "E", "Ɇ": "E", "Ẽ": "E", "Ḛ": "E", "Ꝫ": "ET", "Ḟ": "F", "Ƒ": "F", "Ǵ": "G", "Ğ": "G", "Ǧ": "G", "Ģ": "G", "Ĝ": "G", "Ġ": "G", "Ɠ": "G", "Ḡ": "G", "Ǥ": "G", "Ḫ": "H", "Ȟ": "H", "Ḩ": "H", "Ĥ": "H", "Ⱨ": "H", "Ḧ": "H", "Ḣ": "H", "Ḥ": "H", "Ħ": "H", "Í": "I", "Ĭ": "I", "Ǐ": "I", "Î": "I", "Ï": "I", "Ḯ": "I", "İ": "I", "Ị": "I", "Ȉ": "I", "Ì": "I", "Ỉ": "I", "Ȋ": "I", "Ī": "I", "Į": "I", "Ɨ": "I", "Ĩ": "I", "Ḭ": "I", "Ꝺ": "D", "Ꝼ": "F", "Ᵹ": "G", "Ꞃ": "R", "Ꞅ": "S", "Ꞇ": "T", "Ꝭ": "IS", "Ĵ": "J", "Ɉ": "J", "Ḱ": "K", "Ǩ": "K", "Ķ": "K", "Ⱪ": "K", "Ꝃ": "K", "Ḳ": "K", "Ƙ": "K", "Ḵ": "K", "Ꝁ": "K", "Ꝅ": "K", "Ĺ": "L", "Ƚ": "L", "Ľ": "L", "Ļ": "L", "Ḽ": "L", "Ḷ": "L", "Ḹ": "L", "Ⱡ": "L", "Ꝉ": "L", "Ḻ": "L", "Ŀ": "L", "Ɫ": "L", "ǈ": "L", "Ł": "L", "Ǉ": "LJ", "Ḿ": "M", "Ṁ": "M", "Ṃ": "M", "Ɱ": "M", "Ń": "N", "Ň": "N", "Ņ": "N", "Ṋ": "N", "Ṅ": "N", "Ṇ": "N", "Ǹ": "N", "Ɲ": "N", "Ṉ": "N", "Ƞ": "N", "ǋ": "N", "Ñ": "N", "Ǌ": "NJ", "Ó": "O", "Ŏ": "O", "Ǒ": "O", "Ô": "O", "Ố": "O", "Ộ": "O", "Ồ": "O", "Ổ": "O", "Ỗ": "O", "Ö": "O", "Ȫ": "O", "Ȯ": "O", "Ȱ": "O", "Ọ": "O", "Ő": "O", "Ȍ": "O", "Ò": "O", "Ỏ": "O", "Ơ": "O", "Ớ": "O", "Ợ": "O", "Ờ": "O", "Ở": "O", "Ỡ": "O", "Ȏ": "O", "Ꝋ": "O", "Ꝍ": "O", "Ō": "O", "Ṓ": "O", "Ṑ": "O", "Ɵ": "O", "Ǫ": "O", "Ǭ": "O", "Ø": "O", "Ǿ": "O", "Õ": "O", "Ṍ": "O", "Ṏ": "O", "Ȭ": "O", "Ƣ": "OI", "Ꝏ": "OO", "Ɛ": "E", "Ɔ": "O", "Ȣ": "OU", "Ṕ": "P", "Ṗ": "P", "Ꝓ": "P", "Ƥ": "P", "Ꝕ": "P", "Ᵽ": "P", "Ꝑ": "P", "Ꝙ": "Q", "Ꝗ": "Q", "Ŕ": "R", "Ř": "R", "Ŗ": "R", "Ṙ": "R", "Ṛ": "R", "Ṝ": "R", "Ȑ": "R", "Ȓ": "R", "Ṟ": "R", "Ɍ": "R", "Ɽ": "R", "Ꜿ": "C", "Ǝ": "E", "Ś": "S", "Ṥ": "S", "Š": "S", "Ṧ": "S", "Ş": "S", "Ŝ": "S", "Ș": "S", "Ṡ": "S", "Ṣ": "S", "Ṩ": "S", "Ť": "T", "Ţ": "T", "Ṱ": "T", "Ț": "T", "Ⱦ": "T", "Ṫ": "T", "Ṭ": "T", "Ƭ": "T", "Ṯ": "T", "Ʈ": "T", "Ŧ": "T", "Ɐ": "A", "Ꞁ": "L", "Ɯ": "M", "Ʌ": "V", "Ꜩ": "TZ", "Ú": "U", "Ŭ": "U", "Ǔ": "U", "Û": "U", "Ṷ": "U", "Ü": "U", "Ǘ": "U", "Ǚ": "U", "Ǜ": "U", "Ǖ": "U", "Ṳ": "U", "Ụ": "U", "Ű": "U", "Ȕ": "U", "Ù": "U", "Ủ": "U", "Ư": "U", "Ứ": "U", "Ự": "U", "Ừ": "U", "Ử": "U", "Ữ": "U", "Ȗ": "U", "Ū": "U", "Ṻ": "U", "Ų": "U", "Ů": "U", "Ũ": "U", "Ṹ": "U", "Ṵ": "U", "Ꝟ": "V", "Ṿ": "V", "Ʋ": "V", "Ṽ": "V", "Ꝡ": "VY", "Ẃ": "W", "Ŵ": "W", "Ẅ": "W", "Ẇ": "W", "Ẉ": "W", "Ẁ": "W", "Ⱳ": "W", "Ẍ": "X", "Ẋ": "X", "Ý": "Y", "Ŷ": "Y", "Ÿ": "Y", "Ẏ": "Y", "Ỵ": "Y", "Ỳ": "Y", "Ƴ": "Y", "Ỷ": "Y", "Ỿ": "Y", "Ȳ": "Y", "Ɏ": "Y", "Ỹ": "Y", "Ź": "Z", "Ž": "Z", "Ẑ": "Z", "Ⱬ": "Z", "Ż": "Z", "Ẓ": "Z", "Ȥ": "Z", "Ẕ": "Z", "Ƶ": "Z", "Ĳ": "IJ", "Œ": "OE", "ᴀ": "A", "ᴁ": "AE", "ʙ": "B", "ᴃ": "B", "ᴄ": "C", "ᴅ": "D", "ᴇ": "E", "ꜰ": "F", "ɢ": "G", "ʛ": "G", "ʜ": "H", "ɪ": "I", "ʁ": "R", "ᴊ": "J", "ᴋ": "K", "ʟ": "L", "ᴌ": "L", "ᴍ": "M", "ɴ": "N", "ᴏ": "O", "ɶ": "OE", "ᴐ": "O", "ᴕ": "OU", "ᴘ": "P", "ʀ": "R", "ᴎ": "N", "ᴙ": "R", "ꜱ": "S", "ᴛ": "T", "ⱻ": "E", "ᴚ": "R", "ᴜ": "U", "ᴠ": "V", "ᴡ": "W", "ʏ": "Y", "ᴢ": "Z", "á": "a", "ă": "a", "ắ": "a", "ặ": "a", "ằ": "a", "ẳ": "a", "ẵ": "a", "ǎ": "a", "â": "a", "ấ": "a", "ậ": "a", "ầ": "a", "ẩ": "a", "ẫ": "a", "ä": "a", "ǟ": "a", "ȧ": "a", "ǡ": "a", "ạ": "a", "ȁ": "a", "à": "a", "ả": "a", "ȃ": "a", "ā": "a", "ą": "a", "ᶏ": "a", "ẚ": "a", "å": "a", "ǻ": "a", "ḁ": "a", "ⱥ": "a", "ã": "a", "ꜳ": "aa", "æ": "ae", "ǽ": "ae", "ǣ": "ae", "ꜵ": "ao", "ꜷ": "au", "ꜹ": "av", "ꜻ": "av", "ꜽ": "ay", "ḃ": "b", "ḅ": "b", "ɓ": "b", "ḇ": "b", "ᵬ": "b", "ᶀ": "b", "ƀ": "b", "ƃ": "b", "ɵ": "o", "ć": "c", "č": "c", "ç": "c", "ḉ": "c", "ĉ": "c", "ɕ": "c", "ċ": "c", "ƈ": "c", "ȼ": "c", "ď": "d", "ḑ": "d", "ḓ": "d", "ȡ": "d", "ḋ": "d", "ḍ": "d", "ɗ": "d", "ᶑ": "d", "ḏ": "d", "ᵭ": "d", "ᶁ": "d", "đ": "d", "ɖ": "d", "ƌ": "d", "ı": "i", "ȷ": "j", "ɟ": "j", "ʄ": "j", "ǳ": "dz", "ǆ": "dz", "é": "e", "ĕ": "e", "ě": "e", "ȩ": "e", "ḝ": "e", "ê": "e", "ế": "e", "ệ": "e", "ề": "e", "ể": "e", "ễ": "e", "ḙ": "e", "ë": "e", "ė": "e", "ẹ": "e", "ȅ": "e", "è": "e", "ẻ": "e", "ȇ": "e", "ē": "e", "ḗ": "e", "ḕ": "e", "ⱸ": "e", "ę": "e", "ᶒ": "e", "ɇ": "e", "ẽ": "e", "ḛ": "e", "ꝫ": "et", "ḟ": "f", "ƒ": "f", "ᵮ": "f", "ᶂ": "f", "ǵ": "g", "ğ": "g", "ǧ": "g", "ģ": "g", "ĝ": "g", "ġ": "g", "ɠ": "g", "ḡ": "g", "ᶃ": "g", "ǥ": "g", "ḫ": "h", "ȟ": "h", "ḩ": "h", "ĥ": "h", "ⱨ": "h", "ḧ": "h", "ḣ": "h", "ḥ": "h", "ɦ": "h", "ẖ": "h", "ħ": "h", "ƕ": "hv", "í": "i", "ĭ": "i", "ǐ": "i", "î": "i", "ï": "i", "ḯ": "i", "ị": "i", "ȉ": "i", "ì": "i", "ỉ": "i", "ȋ": "i", "ī": "i", "į": "i", "ᶖ": "i", "ɨ": "i", "ĩ": "i", "ḭ": "i", "ꝺ": "d", "ꝼ": "f", "ᵹ": "g", "ꞃ": "r", "ꞅ": "s", "ꞇ": "t", "ꝭ": "is", "ǰ": "j", "ĵ": "j", "ʝ": "j", "ɉ": "j", "ḱ": "k", "ǩ": "k", "ķ": "k", "ⱪ": "k", "ꝃ": "k", "ḳ": "k", "ƙ": "k", "ḵ": "k", "ᶄ": "k", "ꝁ": "k", "ꝅ": "k", "ĺ": "l", "ƚ": "l", "ɬ": "l", "ľ": "l", "ļ": "l", "ḽ": "l", "ȴ": "l", "ḷ": "l", "ḹ": "l", "ⱡ": "l", "ꝉ": "l", "ḻ": "l", "ŀ": "l", "ɫ": "l", "ᶅ": "l", "ɭ": "l", "ł": "l", "ǉ": "lj", "ſ": "s", "ẜ": "s", "ẛ": "s", "ẝ": "s", "ḿ": "m", "ṁ": "m", "ṃ": "m", "ɱ": "m", "ᵯ": "m", "ᶆ": "m", "ń": "n", "ň": "n", "ņ": "n", "ṋ": "n", "ȵ": "n", "ṅ": "n", "ṇ": "n", "ǹ": "n", "ɲ": "n", "ṉ": "n", "ƞ": "n", "ᵰ": "n", "ᶇ": "n", "ɳ": "n", "ñ": "n", "ǌ": "nj", "ó": "o", "ŏ": "o", "ǒ": "o", "ô": "o", "ố": "o", "ộ": "o", "ồ": "o", "ổ": "o", "ỗ": "o", "ö": "o", "ȫ": "o", "ȯ": "o", "ȱ": "o", "ọ": "o", "ő": "o", "ȍ": "o", "ò": "o", "ỏ": "o", "ơ": "o", "ớ": "o", "ợ": "o", "ờ": "o", "ở": "o", "ỡ": "o", "ȏ": "o", "ꝋ": "o", "ꝍ": "o", "ⱺ": "o", "ō": "o", "ṓ": "o", "ṑ": "o", "ǫ": "o", "ǭ": "o", "ø": "o", "ǿ": "o", "õ": "o", "ṍ": "o", "ṏ": "o", "ȭ": "o", "ƣ": "oi", "ꝏ": "oo", "ɛ": "e", "ᶓ": "e", "ɔ": "o", "ᶗ": "o", "ȣ": "ou", "ṕ": "p", "ṗ": "p", "ꝓ": "p", "ƥ": "p", "ᵱ": "p", "ᶈ": "p", "ꝕ": "p", "ᵽ": "p", "ꝑ": "p", "ꝙ": "q", "ʠ": "q", "ɋ": "q", "ꝗ": "q", "ŕ": "r", "ř": "r", "ŗ": "r", "ṙ": "r", "ṛ": "r", "ṝ": "r", "ȑ": "r", "ɾ": "r", "ᵳ": "r", "ȓ": "r", "ṟ": "r", "ɼ": "r", "ᵲ": "r", "ᶉ": "r", "ɍ": "r", "ɽ": "r", "ↄ": "c", "ꜿ": "c", "ɘ": "e", "ɿ": "r", "ś": "s", "ṥ": "s", "š": "s", "ṧ": "s", "ş": "s", "ŝ": "s", "ș": "s", "ṡ": "s", "ṣ": "s", "ṩ": "s", "ʂ": "s", "ᵴ": "s", "ᶊ": "s", "ȿ": "s", "ɡ": "g", "ᴑ": "o", "ᴓ": "o", "ᴝ": "u", "ť": "t", "ţ": "t", "ṱ": "t", "ț": "t", "ȶ": "t", "ẗ": "t", "ⱦ": "t", "ṫ": "t", "ṭ": "t", "ƭ": "t", "ṯ": "t", "ᵵ": "t", "ƫ": "t", "ʈ": "t", "ŧ": "t", "ᵺ": "th", "ɐ": "a", "ᴂ": "ae", "ǝ": "e", "ᵷ": "g", "ɥ": "h", "ʮ": "h", "ʯ": "h", "ᴉ": "i", "ʞ": "k", "ꞁ": "l", "ɯ": "m", "ɰ": "m", "ᴔ": "oe", "ɹ": "r", "ɻ": "r", "ɺ": "r", "ⱹ": "r", "ʇ": "t", "ʌ": "v", "ʍ": "w", "ʎ": "y", "ꜩ": "tz", "ú": "u", "ŭ": "u", "ǔ": "u", "û": "u", "ṷ": "u", "ü": "u", "ǘ": "u", "ǚ": "u", "ǜ": "u", "ǖ": "u", "ṳ": "u", "ụ": "u", "ű": "u", "ȕ": "u", "ù": "u", "ủ": "u", "ư": "u", "ứ": "u", "ự": "u", "ừ": "u", "ử": "u", "ữ": "u", "ȗ": "u", "ū": "u", "ṻ": "u", "ų": "u", "ᶙ": "u", "ů": "u", "ũ": "u", "ṹ": "u", "ṵ": "u", "ᵫ": "ue", "ꝸ": "um", "ⱴ": "v", "ꝟ": "v", "ṿ": "v", "ʋ": "v", "ᶌ": "v", "ⱱ": "v", "ṽ": "v", "ꝡ": "vy", "ẃ": "w", "ŵ": "w", "ẅ": "w", "ẇ": "w", "ẉ": "w", "ẁ": "w", "ⱳ": "w", "ẘ": "w", "ẍ": "x", "ẋ": "x", "ᶍ": "x", "ý": "y", "ŷ": "y", "ÿ": "y", "ẏ": "y", "ỵ": "y", "ỳ": "y", "ƴ": "y", "ỷ": "y", "ỿ": "y", "ȳ": "y", "ẙ": "y", "ɏ": "y", "ỹ": "y", "ź": "z", "ž": "z", "ẑ": "z", "ʑ": "z", "ⱬ": "z", "ż": "z", "ẓ": "z", "ȥ": "z", "ẕ": "z", "ᵶ": "z", "ᶎ": "z", "ʐ": "z", "ƶ": "z", "ɀ": "z", "ﬀ": "ff", "ﬃ": "ffi", "ﬄ": "ffl", "ﬁ": "fi", "ﬂ": "fl", "ĳ": "ij", "œ": "oe", "ﬆ": "st", "ₐ": "a", "ₑ": "e", "ᵢ": "i", "ⱼ": "j", "ₒ": "o", "ᵣ": "r", "ᵤ": "u", "ᵥ": "v", "ₓ": "x" }
    return function (string) {
        var arr = string.split('');
        arr.forEach(function (letter, i) {
            if (unicodeMap[letter]) arr[i] = unicodeMap[letter];
        });
        return arr.join('');
    };
})();

class CustomSelect extends Component {
    constructor(props) {
        super(props);
        this.state = this.getInitialState(props)

        this.selectItem = this.selectItem.bind(this)
        this.closeDropdown = this.closeDropdown.bind(this)
        this.openDropdown = this.openDropdown.bind(this)
        this.callback = this.callback.bind(this)
        this.getSelectedItems = this.getSelectedItems.bind(this)
        this.selectItem = this.selectItem.bind(this)
        this.unselectItem = this.unselectItem.bind(this)
        this.renderInput = this.renderInput.bind(this)
    }

    getInitialState(props) {
        var selectedValues = [];
        var inputValueType;
        var defaultValues = '';
        if (props && props.defaultValues !== null && props.defaultValues !== undefined) defaultValues = props.defaultValues;

        if (defaultValues.constructor === String && defaultValues.length > 0) {
            if (defaultValues.indexOf(",") !== -1 && defaultValues.length > 2) {
                selectedValues = defaultValues.split(",");
            } else {
                selectedValues.push(defaultValues);
            }
        }
        else if (defaultValues.constructor === Array && defaultValues.length > 0) {
            defaultValues.forEach(function (value) {
                if (typeof value === 'undefined' || value === null) return;
                selectedValues.push(value.toString());
            });

        }
        else if (defaultValues.constructor === Number) {
            selectedValues.push(defaultValues.toString());
        }

        var state = {
            dropdownIsOpen: false,
            selectedValues: selectedValues, // array of strings
        };

        return state;
    }
    componentWillReceiveProps(nextProps) {
        // đổi ra string để so sánh 2 array
        if (JSON.stringify(this.props.defaultValues) !== JSON.stringify(nextProps.defaultValues)) {
            var newState = this.getInitialState(nextProps);
            this.setState({ selectedValues: newState.selectedValues });
        }
        if (nextProps.items && nextProps.items.toString() !== this.props.items.toString()) {
            // set lại state khi giá props thay đổi
            var newState = this.getInitialState(nextProps);
            this.setState({ selectedValues: newState.selectedValues });
        }
    }
    pageClick(e) {
        if (this.customSelectRoot.contains(e.target)) {
            return;
        }
        this.closeDropdown();
    }
    handleKeyboard(e) {
        switch (e.key) {
            case 'Escape': {
                this.closeDropdown();
                break;
            }
            case 'Enter': {
                break;
            }
            case 'ArrowUp': {
                break;
            }
            case 'ArrowDown': {
                break;
            }
        }
    }
    toggleDropdown() {
        if (this.state.dropdownIsOpen) {
            this.closeDropdown();
        }
        else {
            this.openDropdown();
        }
    }
    closeDropdown() {
        if (this.state.dropdownIsOpen) {
            var newState = {};
            newState.dropdownIsOpen = false;
            var that = this;
            this.setState(newState);
        }
    }
    openDropdown() {
        if (this.props.disabled) return;
        if (!this.state.dropdownIsOpen) {
            var self = this;
            var newState = { dropdownIsOpen: true };
            this.setState(newState);
        }
    }
    callback(selectedValues) {
        if (!this.props.onChange) {
            return;
        }
        // chuyển đổi từ String để trả về đúng dạng của props.items[i].value
        var self = this;
        var temp1 = [];
        selectedValues.forEach(function (value) {
            var temp2 = self.props.items.find(function (item) {
                return item.value.toString() === value;
            });
            if (temp2) temp1.push(temp2.value);
            else {
                if (typeof temp1[0] !== 'undefined' && temp1[0] !== null) {
                    if (temp1[0].constructor === Number) {
                        temp1.push(Number(value));
                    } else {
                        temp1.push(value);
                    }
                }
            }
        });
        this.props.onChange(temp1);
        // console.log('selected values:', temp1);
    }
    getSelectedItems() {
        var that = this;
        var temp1 = [];
        if (that.state.selectedValues.length < 1) {
            return temp1;
        }

        that.state.selectedValues.forEach(function (value) {
            var temp2 = that.props.items.find(function (item) {
                return item.value.toString() === value;//compare string
            });
            if (temp2) temp1.push(temp2);
        });

        return temp1;
    }
    selectItem(itemValue, dontCloseDropdown) {
        if (this.props.disabled) return;
        itemValue = itemValue.toString();
        var self = this;
        var items = self.props.items.slice();
        var selectedItem = items.find(function (item) {
            return item.value.toString() === itemValue;
        });
        if (selectedItem) {
            if (!self.props.multiMode) {
                self.setState({ selectedValues: [itemValue] }, function () {
                    if (!dontCloseDropdown) self.closeDropdown();
                    self.callback(self.state.selectedValues);
                });
            } else {
                var temp1 = self.state.selectedValues.slice();
                if (temp1.indexOf(itemValue) > -1) {
                    self.unselectItem(itemValue, dontCloseDropdown);
                } else {
                    temp1.push(itemValue);
                    self.setState({ selectedValues: temp1 }, function () {
                        if (!dontCloseDropdown) self.closeDropdown();
                        self.callback(self.state.selectedValues);
                    });
                }
            }
        }
    }
    unselectItem(itemValue, dontCloseDropdown) {
        if (this.props.disabled) return;
        itemValue = itemValue.toString();
        var selectedValues = this.state.selectedValues.slice();
        var index = selectedValues.indexOf(itemValue);
        if (index > -1) {
            selectedValues.splice(index, 1);
            this.setState({ selectedValues: selectedValues }, function () {
                if (!dontCloseDropdown) this.closeDropdown();
                this.callback(this.state.selectedValues);
            });
        }
    }
    dropdownPanelDidMount() {
        window.addEventListener('click', this.pageClick, false);
        window.addEventListener('keydown', this.handleKeyboard, false);
    }
    dropdownPanelWillUnmount() {
        window.removeEventListener('click', this.pageClick, false);
        window.removeEventListener('keydown', this.handleKeyboard, false);
    }
    renderInput() {
        var self = this;
        var temp1 = [];

        if (self.props.multiMode) {
            var items = self.getSelectedItems();
            items.forEach(function (item) {
                if (item && item.name) {
                    var tag = (
                        <div className='flex-child selected-tag noselect' key={item.value}>
                            <span className='selected-tag-name'>{item.name}</span>
                            <div className="selected-tag-close" onClick={function (e) {
                                setTimeout(function () { // let self.pageClick check first then unselect/delete element
                                    self.unselectItem(item.value, 'dontCloseDropdown');
                                }, 0);
                            }}></div>
                        </div>
                    );
                }
                temp1.push(tag);
            });
        }
        return (
            <div
                className={'custom-select-input-wrapper'}
                onMouseDown={
                    function (e) {
                        e = e || {};
                        var target = e.target || {};
                        if (target.className.indexOf('selected-tag-close') > -1) return;
                        self.toggleDropdown();
                    }
                }
                ref={function (el) { self.selectInputWrapper = el }} >
                <div className='input-wrapper-content'>
                    {temp1}
                    <div className={'flex-child-input'}>
                        <input
                            className={'custom-select-input noselect'}
                            value={(function () {
                                if (!self.props.multiMode && self.getSelectedItems().length) {
                                    return self.getSelectedItems()[0].name || '';
                                }
                            })()}
                            placeholder={(function () {
                                if (self.getSelectedItems().length) return '';
                                return self.props.placeholder;
                            })()}
                            disabled={true}
                        />
                        {(function () {
                            if (self.props.name || self.props.inputRef) {
                                var inputRef = self.props.inputRef || function () { };
                                return (
                                    <input
                                        className="display-none"
                                        type="text"
                                        name={self.props.name}
                                        value={self.getSelectedItems().map(function (item) {
                                            return item.value;
                                        }).join(',')}
                                        readOnly={true}
                                        ref={inputRef}
                                    />
                                );
                            }
                        })()}
                        <div className="custom-select-input-placeholder">{/* fix for "firefox disabled input consume mouse click event" */}</div>
                    </div>
                </div>
                <div className="updown-wrapper">
                    <div className='updown-triangle'>
                        {self.state.dropdownIsOpen ? '▲' : '▼'}
                    </div>
                </div>
            </div>
        );
    }

    render() {
        var self = this;
        return (
            <div className={'custom-select' + (self.props.multiMode ? ' multi-mode' : '') + (self.state.dropdownIsOpen ? ' active' : '')}
                ref={function (el) { self.customSelectRoot = el }} >

                {self.renderInput()}

                {
                    self.state.dropdownIsOpen ?
                        (
                            <DropdownPanel
                                items={self.props.items}
                                dropdownPanelDidMount={self.dropdownPanelDidMount}
                                dropdownPanelWillUnmount={self.dropdownPanelWillUnmount}
                                selectedValues={self.state.selectedValues}
                                multiMode={self.props.multiMode}
                                maxHeight={self.props.maxHeight}
                                selectItem={self.selectItem}
                                autoClose={self.props.autoClose}
                                disableFilter={self.props.disableFilter}
                                selectInputWrapperRef={self.selectInputWrapper}
                            ></DropdownPanel>
                        )
                        : null
                }

                {
                    (function () {
                        if (self.props.disabled) return <div className="disabled-overlay"></div>;
                    })()
                }
            </div >
        );
    }
};
CustomSelect.propTypes = {
    // [{ name: 'something', value: 'abc', className: '', _disable: true }, { name: 'something2', value: 123, className: '' }]
    // add item._disable = true to disable select item
    items: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.string,
        className: PropTypes.string
    })).isRequired,
    multiMode: PropTypes.bool,
    defaultValues: PropTypes.oneOfType([ // '1,2,3,4,5,6' || 'a,b,c,d' || ['a', 'b', 'c'] || 1 || '1' || [1, 2]
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.shape({
            name: PropTypes.string,
            value: PropTypes.string,
            className: PropTypes.string
        }))
    ]),
    onChange: PropTypes.func, // callback([selectedValues])
    placeholder: PropTypes.string,
    maxHeight: PropTypes.oneOfType([ // dropdown max-height (default: 300px)
        PropTypes.string,
        PropTypes.number
    ]),
    name: PropTypes.string,
    inputRef: PropTypes.func, /**
                                            ** inputRef={function(e) { // ref to get values;
                                            **     self.select = e; 
                                            **     console.log(self.select.value); // '1' || '1,2,3' || 'abc,xyz,123'
                                            ** }}
                                            */
    autoClose: PropTypes.bool, // close after selecting item (default = true)
    disableFilter: PropTypes.bool, // disable filter (default = false) (filter will only show when items.length > 10)
    disabled: PropTypes.bool // disable select
};
CustomSelect.defaultProps = {
    items: [],
    multiMode: false,
    defaultValues: "",
    onChange: function (arr) { },
    placeholder: "",
    maxHeight: 300,
    autoClose: true,
    disableFilter: false,
    name: '',
    inputRef: null,
    disabled: false
}
export default CustomSelect;

class DropdownPanel extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dropdownListHeight: null, inputWrapperHeight: null, upDirection: false, availableHeight: null, filter: ''
        }
        this.renderListItems = this.renderListItems.bind(this)
    }

    componentDidMount() {
        var that = this;
        setTimeout(function () {
            if (that.filterInput) {
                that.filterInput.focus();
            }
        }, 0);
        this.props.dropdownPanelDidMount();
        this.setState({
            dropdownListHeight: this.dropdownItems.offsetHeight,
            inputWrapperHeight: this.props.selectInputWrapperRef.offsetHeight,
            upDirection: false
        }, function () {
            // calculate direction and height
            that.calculateAvailableSpace(that.props.selectInputWrapperRef, function (upDirection, maxHeight) {
                that.setState({ upDirection: upDirection, availableHeight: maxHeight });
            });
        });
    }
    componentDidUpdate() {
        var that = this;
        var dropdownListHeight = this.dropdownItems.offsetHeight;
        var inputWrapperHeight = this.props.selectInputWrapperRef.offsetHeight;
        if (dropdownListHeight === this.state.dropdownListHeight && inputWrapperHeight === this.state.inputWrapperHeight) return;

        this.setState({
            dropdownListHeight: dropdownListHeight,
            inputWrapperHeight: this.props.selectInputWrapperRef.offsetHeight,
            upDirection: false
        }, function () {
            // calculate direction and height
            that.calculateAvailableSpace(that.props.selectInputWrapperRef, function (upDirection, maxHeight) {
                that.setState({ upDirection: upDirection, availableHeight: maxHeight });
            });
        });
    }
    componentWillUnmount() {
        this.props.dropdownPanelWillUnmount();
    }
    calculateAvailableSpace(inputWrapperRef, callback) {
        try {
            var inputRect = inputWrapperRef.getBoundingClientRect();
            var windowHeight = window.innerHeight;
        } catch (err) {
            return console.warn(err);
        }
        var topSpace = inputRect.top - 0;
        var bottomSpace = windowHeight - inputRect.bottom;
        var shouldBeUp = topSpace - bottomSpace > 0;
        var maxHeight = topSpace > bottomSpace ? topSpace : bottomSpace;
        maxHeight -= 50;
        if (maxHeight < 0) maxHeight = 0;
        callback(shouldBeUp, maxHeight);
    }
    shouldDirectionBeUp(element) {
        if (!element) return console.error('undefined/null element');
        try {
            var topPos = element.getBoundingClientRect().top;
            var bottomPos = element.getBoundingClientRect().bottom;
        } catch (err) {
            return console.error(err);
        }
        // if (topPos > window.innerHeight - bottomPos) {
        if (window.innerHeight - 50 < bottomPos && topPos > window.innerHeight - bottomPos) {
            return true;
        } else {
            return false;
        }
    }
    renderListItems() {
        var that = this;
        var listItems = [];
        var filter = that.state.filter;
        that.props.items.forEach(function (item) {
            var itemName = formatUnicode(item.name.toLowerCase());
            var filterText = formatUnicode(filter.toLowerCase());
            if (filterText && itemName.indexOf(filterText) === -1) {
                return;
            }
            var extraClass = [];
            var selStatus = false;
            var temp1 = that.props.selectedValues.indexOf(item.value.toString());
            if (temp1 > -1) {
                extraClass.push('selected');
                selStatus = true;
            }
            if (item.className) {
                extraClass.push(item.className);
            }
            var onClick = function () {
                if (!that.props.autoClose && that.props.multiMode) {
                    that.props.selectItem(item.value, 'dontCloseDropdown');
                } else {
                    that.props.selectItem(item.value);
                }
            };
            if (item._disable) {
                extraClass.push('disabled');
                onClick = function () { };
            }

            listItems.push(
                <li
                    className={extraClass.join(" ") + ' noselect'}
                    onClick={onClick}
                    selected={selStatus}
                    key={item.value}
                // onMouseOver={(a, b) => console.log(a, b)}
                >
                    {item.name}
                </li>
            );
        })
        return (
            <ul ref={function (e) { that.dropdownItems = e; }}>
                {(function () {
                    if (!listItems.length && filter) return <li className="noselect disabled no-result">không có kết quả</li>;
                    return listItems;
                })()}
            </ul>
        );
    }
    render() {
        var that = this;
        var props = this.props;
        var maxHeight = that.props.maxHeight;
        if (!maxHeight) {
            maxHeight = 300;
        } else if (maxHeight.constructor !== Number) {
            maxHeight = parseInt(maxHeight, 10);
        }
        var availableHeight = this.state.availableHeight;
        if (availableHeight && availableHeight < maxHeight) maxHeight = availableHeight;
        if (that.filterDiv && that.filterDiv.offsetHeight) {
            maxHeight -= that.filterDiv.offsetHeight;
        }
        return (
            <div
                className={"custom-select-content" + (that.state.upDirection ? " csc-updir" : "")}
                ref={function (e) { that.dropdownPanelRef = e; }}
            >
                {(function () {
                    if (!props.disableFilter && props.items.length > 10) return (
                        <div className="custom-select-filter" ref={function (e) { that.filterDiv = e; }}>
                            <input
                                type="text"
                                onChange={function (e) {
                                    var val = e.target.value || '';
                                    that.setState({ filter: val });
                                }}
                                placeholder="Tìm kiếm"
                                ref={function (e) { that.filterInput = e; }}
                            />
                            <div className="icon" onClick={function () { that.filterInput.focus(); }}>
                                <i className="fa fa-search" aria-hidden="true"></i>
                            </div>
                        </div>
                    );
                })()}

                {(function () {
                    if (that.state.dropdownListHeight <= maxHeight) return (
                        <div className="no-scrollbar">
                            {that.renderListItems()}
                        </div>
                    );
                    return (
                        <Scrollbars style={{ height: maxHeight }} className="select-scrollbar">
                            {that.renderListItems()}
                        </Scrollbars>
                    );
                })()}
            </div>
        );
    }
}