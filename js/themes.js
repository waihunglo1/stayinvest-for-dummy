
var getObjectByValue = function (array, key, value) {
    return array.filter(function (object) {
        return object[key] === value;
    });
};

