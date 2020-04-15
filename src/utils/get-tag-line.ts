import { getRandomNumberBy } from "./get-random-number";

export function getTagline() {
    const rand = getRandomNumberBy(10000);

    if(rand === 1) {
        return "Honk a brand new honking scheme for your next honk. Mix and honk colors you like with this drag and drop palette honker.";
    }
    return "Create a brand new color scheme for your next project. Mix and match colors you like with this drag and drop palette creator.";
}