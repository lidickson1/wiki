//route for getting the events for a specific generation for a specific person

import { getEvents, getPeopleEvents, loadHTML } from "@/components/lib";
import { DateTime } from "luxon";
import groupBy from "@/components/group_by";

const events = getEvents();

for (const event of events) {
    if (!event.summary) {
        event.summary = event.content;
    }
    delete event.content;
    //we load the html later since loadHtml depends on the current person
}

//person specific events
const peopleEvents = getPeopleEvents();

//req contains person and generation/section
export async function POST(req) {
    const { person, section } = await req.json();
    const personEvents = events
        .filter((x) => x.section === section && x.participants.includes(person))
        .concat(peopleEvents[person][section] ?? [])
        .map((x) => JSON.parse(JSON.stringify(x))); //deep copy each event

    //sort events by date
    personEvents.sort(
        (a, b) => DateTime.fromISO(a.date).toMillis() - DateTime.fromISO(b.date).toMillis()
    );

    //load html
    for (const event of personEvents) {
        event.summary = loadHTML(event.summary, person);
    }

    //combine events if they are on the same day
    return Response.json(
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
