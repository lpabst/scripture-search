function getRandomStringFromCharacters(length: number, characters: string) {
  let str = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = randomNumber(0, characters.length - 1);
    str += characters.charAt(randomIndex);
  }

  return str;
}

export function randomString(length: number) {
  const characters =
    "abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return getRandomStringFromCharacters(length, characters);
}

export function randomNumberAsString(length: number) {
  const characters = "0123456789";
  return getRandomStringFromCharacters(length, characters);
}

export function randomNumber(min: number, max: number) {
  const range = max - min;
  return Math.floor(Math.random() * range) + min;
}

export function randomId() {
  return randomString(16);
}
