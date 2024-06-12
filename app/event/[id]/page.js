import fs from "fs";
import path from "path";
import { getPeople, loadHTML, loadHTMLFile } from "@/components/lib";
import { Images } from "@/components/images";
import eras from "@/seasons.json";
import { DateTime } from "luxon";

export default function Event({ params }) {
    const people = getPeople();
    const section = fs
        .readdirSync("events")
        .find((section) => fs.existsSync(`events/${section}/${params.id}.json`));

    const event = JSON.parse(fs.readFileSync(`events/${section}/${params.id}.json`, "utf8"));
    event.id = params.id;
    if (event.content) {
        event.content = loadHTML(event.content);
    } else {
        event.content = loadHTMLFile(null, `events/${section}/${params.id}.html`);
    }

    if (event.location) {
        event.location = loadHTML(event.location);
    } else if (event.locations) {
        event.locations = event.locations.map((x) => loadHTML(x));
    }

    event.section = section;

    event.date = DateTime.fromISO(event.date).toISODate();

    return (
        <div className="container mb-6">
            <h1 className="title is-1">{event.name}</h1>
            <div className="divider"></div>

            <div className="columns event-columns mb-4">
                {event.media ? (
                    <div className="column" id="event-images">
                        {event.media && <Images images={event.media} />}
                    </div>
                ) : (
                    <div
                        className="column"
                        dangerouslySetInnerHTML={{
                            __html: "<p>" + event.content + "</p>",
                        }}
                    ></div>
                )}

                <div className="column is-one-third">
                    <div className="card">
                        <div className="card-image"></div>
                        <div className="card-content">
                            <table className="table is-fullwidth is-bordered">
                                <tbody>
                                    <tr>
                                        <th>Location</th>
                                        <td>
                                            {event.locations ? (
                                                <div className="content">
                                                    <ul>
                                                        {event.locations.map((location, index) => (
                                                            <li key={index}>
                                                                <div
                                                                    dangerouslySetInnerHTML={{
                                                                        __html:
                                                                            "<p>" +
                                                                            location +
                                                                            "</p>",
                                                                    }}
                                                                ></div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : (
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: "<p>" + event.location + "</p>",
                                                    }}
                                                ></div>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>Date</th>
                                        <td>{event.date}</td>
                                    </tr>
                                    <tr>
                                        <th>Season</th>
                                        <td>{eras[event.section].name}</td>
                                    </tr>
                                    <tr>
                                        <th>Characters</th>
                                        <td>
                                            <div className="content">
                                                <ul>
                                                    {event.participants.sort().map((id, index) => (
                                                        <li key={index}>
                                                            <a href={`/person/${id}`}>
                                                                {people[id].first_name}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {event.media && (
                <div
                    dangerouslySetInnerHTML={{
                        __html: "<p>" + event.content + "</p>",
                    }}
                ></div>
            )}
        </div>
    );
}

export const dynamicParams = false;
export async function generateStaticParams() {
    return fs
        .readdirSync("events")
        .map((section) => fs.readdirSync(`events/${section}`))
        .flat()
        .map((filename) => ({ id: path.parse(filename).name }));
}
