import "bulma-timeline/dist/css/bulma-timeline.min.css";
import "bulma-switch/dist/css/bulma-switch.min.css";
import { getEvents } from "@/components/lib";
import ordinal_suffix from "@/components/ordinal";
import { DateTime, Settings } from "luxon";
import seasons from "@/seasons.json";
import Timeline from "./timeline";
import groupBy from "@/components/group_by";

export default function TimelinePage() {
    Settings.defaultZone = "America/Toronto";
    let events = getEvents().filter((event) => !event.minor);

    //combine events that are on the same day
    events = groupBy(events, (event) => DateTime.fromISO(event.date).startOf("day").toString());
    events = Object.entries(events)
        .map(([date, events]) => ({
            date: date,
            events: events
                .sort(
                    (a, b) =>
                        DateTime.fromISO(a.date).toMillis() - DateTime.fromISO(b.date).toMillis()
                )
                .map((event) => ({ id: event.id, name: event.name })),
        }))
        .flat();
    // console.log(events);

    const eras = Object.entries(seasons).map(([id, x]) => ({ season: id, ...x }));
    events.push(...eras);
    events.sort(
        (a, b) => DateTime.fromISO(a.date).toMillis() - DateTime.fromISO(b.date).toMillis()
    );

    let month = 8;
    for (let i = 0; i < events.length; i++) {
        if (!events[i].date) {
            continue;
        }
        //make sure the timezone is correct
        const date = DateTime.fromISO(events[i].date);
        const eventMonth = date.month;
        if (eventMonth !== month && i > 0) {
            month = eventMonth;
            events.splice(i, 0, { date: `${date.monthShort} ${date.year}` });
        }
        if (events[i].events) {
            // events[i].summary = loadHTML(fs, events[i].summary);
            //change date format
            events[i].date = `${date.monthShort} ${ordinal_suffix(date.day)}`;
        }
    }

    return (
        <div className="container mb-6">
            <h1 className="title is-1">Timeline</h1>
            <div className="divider"></div>
            <p>This is the complete timeline of the TV show this wiki is for.</p>
            <div className="box mt-5" style={{ display: "inline-block" }}>
                <aside className="menu ml-4">
                    <p className="menu-label">Eras</p>
                    <ol className="menu-list">
                        {Object.entries(seasons).map(([id, { name }]) => (
                            <li key={id}>
                                <a href={`#${id}`}>{name}</a>
                            </li>
                        ))}
                    </ol>
                </aside>
            </div>
            <Timeline events={events} eras={eras} />
        </div>
    );
}
