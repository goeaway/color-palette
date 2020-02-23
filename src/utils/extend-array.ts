interface Array<T> {
    random: () => T;
}

Array.prototype.random = function<T>(this: Array<T>) : T {
    return this[Math.floor(Math.random() * this.length)];
}