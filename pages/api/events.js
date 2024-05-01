import fs from "fs";
import path from "path";
import { getEvents } from "@/components/lib";

//https://github.com/vercel/next.js/discussions/32236#discussioncomment-5427295
console.log(path.join(process.cwd(), "events"));
const events = getEvents(fs, path).map(({ name, id }) => ({
    name: name,
    link: `/event/${id}`,
}));

export default async function handler(req, res) {
    res.status(200).send(events);
}
