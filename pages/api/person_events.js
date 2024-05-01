//route for getting the events for a specific generation for a specific person

import { getEvents, getPeopleEvents, groupBy, loadHTML } from "@/components/lib";
import fs from "fs";
import path from "path";
import { DateTime } from "luxon";

console.log(path.join(process.cwd(), "people"));
console.log(path.join(process.cwd(), "events"));

const events = getEvents(fs, path);

for (const event of events) {
    if (!event.summary) {
        event.summary = event.content;
    }
    delete event.content;
    //we load the html later since loadHtml depends on the current person
}

//person specific events
const peopleEvents = getPeopleEvents(fs);

//req contains person and generation/section
export default async function handler(req, res) {
    const personEvents = events
        .filter((x) => x.section === req.body.section && x.participants.includes(req.body.person))
        .concat(peopleEvents[req.body.person][req.body.section] ?? [])
        .map((x) => JSON.parse(JSON.stringify(x))); //deep copy each event

    //sort events by date
    personEvents.sort(
        (a, b) => DateTime.fromISO(a.date).toMillis() - DateTime.fromISO(b.date).toMillis()
    );

    //load html
    for (const event of personEvents) {
        event.summary = loadHTML(fs, event.summary, req.body.person);
    }

    //combine events if they are on the same day
    res.status(200).send(
        Object.entries(
            groupBy(personEvents, (event) => DateTime.fromISO(event.date).startOf("day").toString())
        ).map(([_, events]) => ({
            date: events[0].date,
            events: events,
            media: events
                .map((x) => {
                    if (x.minor) {
                        return [];
                    } else if (x.media) {
                        return x.media.some((m) => "highlight" in m)
                            ? x.media.filter((m) => m.highlight)
                            : x.media;
                    }
                    return [];
                })
                .flat(),
        }))
    );
}
