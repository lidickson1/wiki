import { getPeople } from "@/components/lib";

const people = getPeople();

for (const person of Object.values(people)) {
    person.image = Object.entries(person.images).at(-1)[1].at(-1);
    delete person.images;
    delete person.bio;
    delete person.background;
    delete person.quotes;
}

export async function GET(req) {
    return Response.json(people);
}
