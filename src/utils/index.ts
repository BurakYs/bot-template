export function randomFromArray<T>(array: T[]) {
    return array[Math.floor(Math.random() * array.length)];
}
