const decode = (str: string) : string => {
    return atob ? atob(decodeURIComponent(str)) : decodeURIComponent(str);
}

const encode = (str: string) : string => {
    return encodeURIComponent(btoa ? btoa(str) : str);
}

const matchesKey = (key: string, matcher: string) : boolean => {
    // for this solution to work on any string, no matter what characters it has
    var escapeRegex = (str: string) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");

    matcher = matcher.split("*").map(escapeRegex).join(".*");

    //Create a regular expression object for matching string
    var regex = new RegExp("^" + matcher + "$");

    //Returns true if it finds a match, otherwise it returns false
    return regex.test(key);
}

export const get = <T>(key: string) : T => {
    if(!key) {
        return undefined;
    }

    try {
        const localStorageStr = window.localStorage.getItem(key);
    
        if(localStorageStr === null) {
            return undefined;
        }
    
        return JSON.parse(decode(localStorageStr)) as T;
    } catch (err) {
        return undefined;
    }
}

export const set = <T>(key: string, value: T) => {
    if(!key) {
        throw "Key was not usable (" + key + ")";
    }

    try {
        window.localStorage.setItem(key, encode(JSON.stringify(value)));
    } catch (err) {

    }
}

export const getMatchingKey = <T>(keyPattern: string) : Array<T> => {
    const results : Array<T> = [];
    for(let i = 0; i < window.localStorage.length; i++) {
        const keyFromStorage = window.localStorage.key(i);
        if(matchesKey(keyFromStorage, keyPattern)) {
            results.push(get<T>(keyFromStorage));
        }
    }

    return results;
}

export const remove = (key: string) => {
    if(!key) {
        throw "Key was not usable (" + key + ")";
    }

    if(!get(key)) {
        return;
    }

    window.localStorage.removeItem(key);
}