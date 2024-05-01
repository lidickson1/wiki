import fs from "fs";
import path from "path";
import Hjson from "hjson";

export function getPeople() {
    return Object.fromEntries(
        fs
            .readdirSync(`people`)
            .map((id) => [
                id,
                { ...JSON.parse(fs.readFileSync(`people/${id}/${id}.json`, "utf8")), id: id },
            ])
    );
}

export function getEvents() {
    return (
        fs
            .readdirSync("events")
            .map((section) =>
                fs
                    .readdirSync(`events/${section}`)
                    .filter((filename) => path.parse(filename).ext === ".json")
                    .map((filename) => ({
                        ...JSON.parse(fs.readFileSync(`events/${section}/${filename}`, "utf8")),
                        id: path.parse(filename).name,
                        section: section,
                    }))
            )
            .flat()
            //TODO this is temporary, all events should have a name
            //once I finish going through all events I can remove this
            .map((event) => ({
                ...event,
                name:
                    event.name ??
                    event.id.replaceAll("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
            }))
    );
}

//get people specific events
export function getPeopleEvents(fs) {
    const peopleEvents = {};
    for (const id of Object.keys(getPeople(fs))) {
        const sectionEvents = {};
        for (const section of fs.readdirSync("events")) {
            //person specific events
            if (fs.existsSync(`people/${id}/${section}.hjson`)) {
                for (const event of Hjson.parse(
                    fs.readFileSync(`people/${id}/${section}.hjson`, "utf8")
                )) {
                    //TODO duplicate code
                    //this can happen if the person only has person specific events for this section
                    if (!(section in sectionEvents)) {
                        sectionEvents[section] = [];
                    }
                    event.section = section;
                    event.summary = event.content;
                    delete event.content;
                    sectionEvents[section].push(event);
                }
            }
        }
        peopleEvents[id] = sectionEvents;
    }
    return peopleEvents;
}

export function loadImages(fs, id) {
    const images = [];
    for (let i = 1; i < 20; i++) {
        if (fs.existsSync(`public/images/${id}_${i}.jpg`)) {
            images.push(`/images/${id}_${i}.jpg`);
        }
    }
    return images;
}

export function getPersonImage(person) {
    return Object.values(person.images).at(-1).at(-1);
}

//if the current key is a substring of another key (e.g. Fernando is a substring of Fernando's room)
//then we need to perform a lookahead to make sure the string is not the other (longer) key
function replaceKey(string, key, keys) {
    const index = string.search(new RegExp(`\\b${key}\\b`));
    const otherKeys = Object.keys(keys).filter((x) => x.includes(key) && x !== key);
    if (otherKeys.some((x) => string.slice(index, index + x.length) === x)) {
        return string; //don't replace
    }
    return string.replace(new RegExp(`\\b${key}\\b`), `<a href="${keys[key]}">${key}</a>`);
}

export function loadHTML(fs, string, currentPerson) {
    string = string.trim();
    //markdown links
    string = string.replaceAll(/\[([^\[]+)\](\(([^)]*))\)/gim, '<a href="$3">$1</a>');
    const people = Object.entries(getPeople(fs));
    const keys = Object.fromEntries(
        people.map(([id, person]) => [person.first_name, `/person/${id}`])
    );
    delete keys.Daniel;
    for (const key of Object.keys(keys)) {
        if (currentPerson) {
            //ignore if we are linking to the current person
            const p = people.find(([_, person]) => person.first_name === key);
            if (p && p[0] === currentPerson) {
                continue;
            }
        }
        string = replaceKey(string, key, keys);
    }
    //bruh, using css to change the height of br doesn't work on mobile
    //(it might be because i'm not using the full form <br></br> lol idc)
    //https://stackoverflow.com/a/64562352
    string = string.replaceAll(
        "<br />",
        `<p style="margin: 1em;"></p>
    `
    );
    return string;
}

export function loadHTMLFile(id, fileName) {
    return loadHTML(fs, fs.readFileSync(fileName, "utf-8"), id);
}

export function groupBy(xs, key) {
    return xs.reduce(function (rv, x) {
        (rv[key(x)] = rv[key(x)] || []).push(x);
        return rv;
    }, {});
}
