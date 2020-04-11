interface Array<T> {
    random: () => T;
    equals: (second: Array<T>) => boolean;
}

Array.prototype.random = function<T>(this: Array<T>) : T {
    return this[Math.floor(Math.random() * this.length)];
}

Array.prototype.equals = function<T>(this:Array<T>, second: Array<T>) : boolean {
    if (this === second) return true;
    if (this == null || second == null) return false;
    if (this.length != second.length) return false;
    
    // If you don't care about the order of the elements inside
    // the array, you should sort both arrays here.
    // Please note that calling sort on an array will modify that array.
    // you might want to clone your array first.
    
    for (var i = 0; i < this.length; ++i) {
        if (this[i] !== second[i]) return false;
    }
    return true;
}