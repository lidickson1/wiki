"use client";

import { DateTime } from "luxon";

export default function Birthdays({ people }) {
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

    /*TODO in the future, might need to handle special case where 2 people have the same birthday*/
    return birthdays.map(({ person, date }, index) => (
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
    ));
}
