import fs from "fs";
import path from "path";
import { getPeople, loadHTML, loadHTMLFile, getEvents, getPeopleEvents } from "@/components/lib";
import PersonInfoBox from "@/components/PersonInfoBox";
import Section from "@/app/person/[id]/Section";
import { Settings } from "luxon";
import eras from "@/seasons.json";
import { Provider } from "./provider";
import SectionItem from "./SectionItem";

Settings.defaultZone = "America/Toronto";

export default function Person({ params }) {
    const person = getPeople()[params.id];
    //load bio
    if (person.bio) {
        person.bio = loadHTML(fs, person.bio, params.id);
    } else {
        person.bio = loadHTMLFile(params.id, `people/${params.id}/bio.html`);
    }
    if (fs.existsSync(`people/${params.id}/background.html`)) {
        person.background = loadHTMLFile(params.id, `people/${params.id}/background.html`);
    }
    if (fs.existsSync(`people/${params.id}/trivia.html`)) {
        person.trivia = loadHTMLFile(params.id, `people/${params.id}/trivia.html`);
    }

    //get sections
    const events = getEvents()
        .filter((x) => x.participants.includes(params.id))
        .map((x) => x.section);
    const personEvents = Object.keys(getPeopleEvents(fs)[params.id]);
    person.sections = [...new Set(events.concat(personEvents))];

    //I'm doing it like this to preserve the ordering
    const sections = Object.keys(eras).filter((x) => person.sections.includes(x));
    const latestSection = sections.at(-1);

    return (
        <div className="container mb-6">
            {/* <Navigation people={people} /> */}
            <h1 className="title is-1">
                {person.first_name} {person.last_name}
            </h1>
            <div className="divider"></div>
            <Provider sections={sections} latestSection={latestSection}>
                <div className="columns">
                    <div className="column is-two-thirds">
                        <div
                            dangerouslySetInnerHTML={{
                                __html: "<p>" + person.bio + "</p>",
                            }}
                        ></div>
                        <div className="box mt-5" style={{ display: "inline-block" }}>
                            <aside className="menu ml-4">
                                <p className="menu-label">Contents</p>
                                <ol className="menu-list">
                                    {person.background && (
                                        <li>
                                            <a href="#background">Background</a>
                                        </li>
                                    )}
                                    {Object.entries(eras)
                                        .filter(([section, _]) => person.sections.includes(section))
                                        .map(([id, section]) => (
                                            <SectionItem
                                                key={id}
                                                section={id}
                                                name={section.name}
                                            />
                                        ))}
                                    {person.quotes && (
                                        <li>
                                            <a href="#quotes">Quotes</a>
                                        </li>
                                    )}
                                    {person.trivia && (
                                        <li>
                                            <a href="#trivia">Trivia</a>
                                        </li>
                                    )}
                                </ol>
                            </aside>
                        </div>
                    </div>
                    <div className="column" style={{ minWidth: 0, maxWidth: "90vw" }}>
                        <PersonInfoBox person={person} />
                    </div>
                </div>
                {person.background && (
                    <div id="background" style={{ clear: "both" }}>
                        <h1 className="title">Background</h1>
                        <div className="divider"></div>
                        <div
                            className="mb-5 content"
                            dangerouslySetInnerHTML={{
                                __html: person.background,
                            }}
                        ></div>
                    </div>
                )}
                {Object.entries(eras)
                    .filter(([section, _]) => person.sections.includes(section))
                    .map(([id, section]) => (
                        <Section
                            id={id}
                            name={section.name}
                            // collapsed={collapsed[section]}
                            // handler={(value) => setCollapsed({ ...collapsed, [section]: value })}
                            key={id}
                            person={params.id}
                        />
                    ))}
                {person.quotes && (
                    <div id="quotes" style={{ clear: "both" }}>
                        <h1 className="title">Quotes</h1>
                        <div className="divider"></div>
                        <div className="mb-5 content">
                            <ul>
                                {person.quotes.map((quote, index) => (
                                    <li key={index}>{quote}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
                {person.trivia && (
                    <div id="trivia" style={{ clear: "both" }}>
                        <h1 className="title">Trivia</h1>
                        <div className="divider"></div>
                        <div
                            className="mb-5 content"
                            dangerouslySetInnerHTML={{
                                __html: person.trivia,
                            }}
                        ></div>
                    </div>
                )}
                <div style={{ clear: "both" }}></div>
            </Provider>
        </div>
    );
}

export const dynamicParams = false;
export async function generateStaticParams() {
    // Return a list of possible value for id
    return fs.readdirSync("people").map((id) => ({ id: id }));
}
