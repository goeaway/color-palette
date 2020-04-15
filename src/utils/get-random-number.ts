export function getRandomNumberInRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
}

export function getRandomNumberBy(multiplier: number) {
    return Math.floor(Math.random() * multiplier);
}