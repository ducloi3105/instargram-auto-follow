const createService = function createService(initialData, processNextData) {
    var _data = initialData;

    var callbacks = [];

    const emitChange = () => {
        callbacks.forEach(f => f(_data))
    }

    return {
        subscribe: cb => {
            callbacks.push(cb);
            return () => {
                callbacks = callbacks.filter(f => f != cb)
            }
        },

        getData: () => _data,

        setData: nextData => {
            //console.log({data: _data, nextData});
            if (typeof processNextData == 'function') {
                _data = processNextData(_data, nextData);
            } else {
                _data = Object.assign({}, _data, nextData);
            }
            //console.log("NEXT DATA => ", _data);
            emitChange();
        },
        createNewData: (newData) => {
            _data = newData
        }
    }
}

exports.createService = createService;