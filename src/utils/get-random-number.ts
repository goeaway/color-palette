export function getRandomNumberInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export function getRandomNumberBy(multiplier: number) {
    return Math.random() * multiplier;
}