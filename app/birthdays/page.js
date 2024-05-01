import "bulma-timeline/dist/css/bulma-timeline.min.css";
import { getPeople } from "@/components/lib";
import { DateTime } from "luxon";

export default function Birthdays() {
    const people = getPeople();

    let birthdays = Object.entries(people)
        .map(([id, person]) => ({
            person: id,
            date: DateTime.fromISO(person.birthday),
        }))
        .filter(({ date }) => date.isValid);

    for (const x of birthdays) {
        const currentYear = DateTime.now().year;
        const currentBirthday = x.date.set({ year: currentYear });
        x.date = x.date.set({
            year:
                //ignore time when comparing
                DateTime.now().startOf("day") > currentBirthday.startOf("day")
                    ? currentYear + 1
                    : currentYear,
        });
    }

    // console.log(birthdays);

    birthdays.sort(
        (a, b) => DateTime.fromISO(a.date).toMillis() - DateTime.fromISO(b.date).toMillis()
    );

    return (
        <div className="container mb-6">
            <h1 className="title is-1">Upcoming Birthdays</h1>
            <div className="divider"></div>
            <p>
                This is an overview of the upcoming birthdays of all characters (i.e. main and side
                characters are all included).
            </p>
            <div className="timeline mt-5 is-centered">
                {/*TODO in the future, might need to handle special case where 2 people have the same birthday*/}
                {birthdays.map(({ person, date }, index) => (
                    <div className="timeline-item" key={index}>
                        <div className="timeline-marker"></div>
                        <div className="timeline-content">
                            <p className="heading">{date.toLocaleString(DateTime.DATE_MED)}</p>
                            <p>
                                <a href={`person/${person}`}>{people[person].first_name}</a>
                                &apos;s Birthday
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
