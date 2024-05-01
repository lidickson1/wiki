import fs from "fs";
import path from "path";
import { getPeople } from "@/components/lib";

//need the following to tell vercel to include the people folder: https://github.com/vercel/next.js/discussions/32236#discussioncomment-5427295
console.log(path.join(process.cwd(), "people"));
const people = getPeople(fs);

for (const person of Object.values(people)) {
    person.image = Object.entries(person.images).at(-1)[1].at(-1);
    delete person.images;
    delete person.bio;
    delete person.background;
    delete person.quotes;
}

export default async function handler(req, res) {
    res.status(200).send(people);
}
