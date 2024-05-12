import fs from "fs";
import _ from "lodash";
import { fakerEN_CA as faker } from "@faker-js/faker";

const seasons = [
    ["first_season", { name: "First Season" }],
    ["second_season", { name: "Second Season" }],
    ["third_season", { name: "Third Season" }],
];
const seasonDates = _.times(seasons.length, () => faker.date.past({ years: 5 })).sort(
    (a, b) => a - b
);
// console.log(seasonDates);
for (let i = 0; i < seasons.length; i++) {
    seasons[i][1].date = seasonDates[i];
}
const seasonNumbers = seasons.map((_, index) => index + 1);
fs.writeFileSync("seasons.json", JSON.stringify(Object.fromEntries(seasons)), "utf8");

const MEMBERS = 15;
// const localFakers = [
//     faker,
//     new Faker({ locale: [es] }),
//     new Faker({ locale: [ja] }),
//     new Faker({ locale: [ko] }),
//     new Faker({ locale: [zh_TW] }),
// ];
const people = {};
for (let i = 0; i < MEMBERS; i++) {
    // const localFaker = localFakers[Math.floor(Math.random() * localFakers.length)];
    const sex = faker.person.sexType();

    const randomSeasons = seasons
        .map((x, index) => [x[0], index + 1])
        .filter((_) => Math.random() < 0.5);
    if (!randomSeasons.length) {
        //if seasons is empty, add a random season
        randomSeasons.push(_.sample(seasons.map((x, index) => [x[0], index + 1])));
    }

    const person = {
        first_name: faker.person.firstName(sex),
        last_name: faker.person.lastName(sex),
        birthday: faker.date.birthdate(),
        location: faker.location.city(),
        origin: faker.location.city(),
        status: faker.person.jobTitle(),
        seasons: randomSeasons.map((x) => x[1]),
        date_joined: faker.date.past({ years: 5 }),
        side_character: Math.random() < 0.25,
    };
    person.images = {
        [_.sample(randomSeasons.map((x) => x[0]))]: [
            // faker.image.urlLoremFlickr({
            //     category: sex === "male" ? "man,face" : "woman,face",
            //     width: 500,
            //     height: 500,
            // }),
            `https://api.dicebear.com/8.x/avataaars/svg?seed=${person.first_name}&eyebrows=angryNatural,default,defaultNatural,flatNatural,raisedExcited,raisedExcitedNatural,unibrowNatural,upDown,upDownNatural,angry&eyes=default&mouth=default,grimace,sad,serious,smile,tongue,twinkle`,
        ],
    };
    person.bio = `${person.first_name} ${person.last_name} is a ${
        person.status
    } who is currently living in ${person.location}. ${faker.lorem.sentences(5)}`;

    people[person.first_name.toLowerCase()] = person;
    // console.log(person);
}

if (fs.existsSync("people")) {
    fs.rmdirSync("people", { recursive: true });
}
fs.mkdirSync("people");
for (const [id, person] of Object.entries(people)) {
    fs.mkdirSync(`people/${id}`);
    fs.writeFileSync(`people/${id}/${id}.json`, JSON.stringify(person), "utf8");
}

const EVENTS = 10;
if (fs.existsSync("events")) {
    fs.rmdirSync("events", { recursive: true });
}
fs.mkdirSync("events");
for (let i = 0; i < seasons.length; i++) {
    fs.mkdirSync(`events/${seasons[i][0]}`);
    for (let j = 0; j < EVENTS; j++) {
        const seasonPeople = Object.keys(
            _.pickBy(people, (x) => x.seasons.includes(seasonNumbers[i]))
        );
        const participants = seasonPeople.filter((_) => Math.random() < 0.3);
        if (!participants.length) {
            participants.push(_.sample(seasonPeople));
        }
        const event = {
            name: _.startCase(faker.word.words({ count: { min: 1, max: 3 } })),
            date: faker.date.between({
                from: seasons[i][1].date,
                to: seasons[i + 1]?.at(1)?.date ?? Date.now(),
            }),
            participants: participants,
            content: faker.lorem.sentences({ min: 3, max: 20 }),
            location: faker.location.city(),
            media:
                Math.random() < 0.8
                    ? _.times(_.random(1, 5), () => ({
                          image: faker.image.urlPicsumPhotos(),
                          caption: faker.lorem.sentence(),
                      }))
                    : undefined,
        };
        console.log(event);
        fs.writeFileSync(
            `events/${seasons[i][0]}/${_.snakeCase(event.name)}.json`,
            JSON.stringify(event),
            "utf8"
        );
    }
}
