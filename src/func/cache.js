
import { AsyncStorage } from "react-native";
import {
    Cache
} from "react-native-cache";


var cache = new Cache({
    namespace: "myapp",
    policy: {
        maxEntries: 50000
    },
    backend: AsyncStorage
});

export var setCache = function (key, val) {
    return cache.setItem(key, val, function (err) {
        if(err){
            //console.warn(err.message);
        }
        return true;
    });
};

export var getCache = function (key,func=false) {
    cache.getItem(key, function (err, value) {
        if(err){
            //console.warn(err.message);
        }else{
            if(value&&func)
                func(value);
        }
    });
};

export var clearCache = function () {
    cache.clearAll(function(err) {
        if(err){
            //console.warn(err.message);
        }
    });
};
