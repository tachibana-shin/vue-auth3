export function isObject(val: any): val is object {
    if (val !== null && typeof val === 'object' && val.constructor !== Array ) {
        return true;
    }

    return false;
}

export function toArray<T = any>(val: T):  T[] {
    return (typeof val === "string" || typeof val === "number") ? [val] : val as any
}

export function extend<M, N>(mainObj: M, appendObj: N[] = {} as any): M & N {
    const  data = {} as any;

    for (const key in mainObj) {
        if (isObject(mainObj[key]) && mainObj[key] instanceof FormData) {
            data[key] = extend(mainObj[key], [{}]);
        }
        else {
            data[key] = mainObj[key];
        }
    }

    for (let i = 0, ii = appendObj.length; i < ii; i++) {
        for (const key in appendObj[i]) {
            if (isObject(appendObj[i][key]) && appendObj[i][key] instanceof FormData) {
                data[key] = extend((mainObj as any)[key] || {}, [appendObj[i][key]]);
            }
            else  {
                data[key] = appendObj[i][key];
            }
        }
    }

    return data;
}

export function compare<O, T>(one: O, two: T):boolean{

    if (isObject(one) && isObject(two)) {
        for (const key in one) {
            if (compare(one[key], (two as any)[key])) {
                return true;
            }
        }

        return false;
    }

    const aone = toArray(one);
    const atwo = toArray(two);

    for (let i = 0, ii = aone.length; i < ii; i++) {
        if (atwo.includes((aone as any)[i])) {
            return true;
        }
    }

    return false;
}

export function isLocalStorage() {
    try {
        if (!window.localStorage) {
            throw 'exception';
        }

        localStorage.setItem('storage_test', 1);
        localStorage.removeItem('storage_test');

        return true;
    } catch  {
        return false;
    }
}

export function isSessionStorage() {
    try {
        if (!window.sessionStorage) {
            throw 'exception';
        }

        sessionStorage.setItem('storage_test', 1);
        sessionStorage.removeItem('storage_test');

        return true;
    } catch {
        return false;
    }
}

export function isCookieStorage() {
    return true;
}

export function getProperty (obj: any, desc: string): any {
    const arr = desc.split('.');

    while (arr.length) {
        obj = obj[arr.shift()!];
    }

    return obj;
}
