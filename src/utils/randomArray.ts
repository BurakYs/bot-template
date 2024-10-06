export default function randomArray<T>(array: T[]) {
  return array[Math.floor(Math.random() * array.length)];
}