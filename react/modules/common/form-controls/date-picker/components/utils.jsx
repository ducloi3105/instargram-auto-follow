module.exports = {
    pad: function (value, length) {
        while (value.length < length)
            value = "0" + value;
        return value;
    },

    clone: function (date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    },

    isLeapyear: function (year) {
        if (year % 400 === 0 || (year % 4 === 0 && year % 100 !== 0)) {
            return true;
        }
        return false;
    },

    isCorrectDate: function (strDate) {
        var regex = /^\d{1,2}\/\d{1,2}\/\d{4}$/gi;
        var arrDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (regex.test(strDate)) {
            var arrayDMY = strDate.split("/");
            var day = parseInt(arrayDMY[0]),
                month = parseInt(arrayDMY[1]),
                year = parseInt(arrayDMY[2]);
            if (this.isLeapyear(year)) {
                arrDays[1] = 29;
            }
            if (month < 1 || month > 12) {
                return false;
            }
            if (day < 1 || day > arrDays[month - 1]) {
                return false;
            }
            return true;
        }
        return false;
    },

    isCorrectTime: function (strTime) {
        var arrTime = strTime.split(":");
        if (arrTime.length === 2) {
            var hourTime = parseInt(arrTime[0]),
                minuteTime = parseInt(arrTime[1]);
            return hourTime >= 0 && hourTime < 24 && minuteTime >= 0 && minuteTime < 60;
        }
        return false;
    },

    isCorrectDateTime: function (strDateTime) {
        var regexDateTime = /^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}$/gi;
        if (regexDateTime.test(strDateTime)) {
            var strDate = strDateTime.substring(0, 10),
                strTime = strDateTime.substring(10, strDateTime.length).trim();
            if (this.isCorrectDate(strDate) && this.isCorrectTime(strTime)) {
                return true;
            }
        }
        return false;
    },

    toString: function (date) {
        return this.pad(date.getDate().toString(), 2) + "/" + this.pad((date.getMonth() + 1).toString(), 2) + "/" + date.getFullYear();
    },

    toDayOfMonthString: function (date) {
        return this.pad(date.getDate().toString());
    },

    toMonthAndYearString: function (date) {
        var months = ["Tháng 01", "Tháng 02", "Tháng 03", "Tháng 04", "Tháng 05", "Tháng 06", "Tháng 07", "Tháng 08", "Tháng 09", "Tháng 10", "Tháng 11", "Tháng 12"];
        return months[date.getMonth()] + " - " + date.getFullYear();
    },

    moveToDayOfWeek: function (date, dayOfWeek) {
        while (date.getDay() !== dayOfWeek)
            date.setDate(date.getDate() - 1);
        return date;
    },

    isSameDay: function (first, second) {
        return first.getFullYear() === second.getFullYear() && first.getMonth() === second.getMonth() && first.getDate() === second.getDate();
    },

    isBefore: function (first, second) {
        return first.getTime() < second.getTime();
    },

    isAfter: function (first, second) {
        return first.getTime() > second.getTime();
    },

    buildDateObj: function (stringDate) {
        var arrayDate = stringDate.split("/");
        return new Date(arrayDate[2], arrayDate[1] - 1, arrayDate[0], 0, 0, 0, 0);
    },

    buildDateTimeObj: function (ObjDate, strHour, strMin) {
        return new Date(ObjDate.getFullYear(), ObjDate.getMonth(), ObjDate.getDate(), parseInt(strHour), parseInt(strMin), 0, 0);
    },

    compareDateObj: function(firstDate, secondDate){
        if (firstDate instanceof Date && secondDate instanceof Date){
            if (firstDate.getFullYear() === secondDate.getFullYear() && firstDate.getMonth() === secondDate.getMonth()
                && firstDate.getDate() === secondDate.getDate()){
                return true;
            }
        }

        return false;
    },
};