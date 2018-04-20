module.exports = {
    clone: function (date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds());
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

    compareDateObj: function(firstDate, secondDate){
        if (firstDate instanceof Date && secondDate instanceof Date){
            if (firstDate.getFullYear() === secondDate.getFullYear() && firstDate.getMonth() === secondDate.getMonth()
                && firstDate.getDate() === secondDate.getDate()){
                return true;
            }
        }

        return false;
    },

    buildDateTimeObj: function (ObjDate, strHour, strMin) {
        return new Date(ObjDate.getFullYear(), ObjDate.getMonth(), ObjDate.getDate(), parseInt(strHour), parseInt(strMin), 0, 0);
    }
};