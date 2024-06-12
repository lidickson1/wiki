import Link from "next/link";
import { PeopleList } from "@/components/people";
import Icon from "@mdi/react";
import { mdiGithub } from "@mdi/js";
import { getPeople, getEvents } from "@/components/lib";
import { DateTime } from "luxon";
import ordinal_suffix from "@/components/ordinal";
import TodayEvents from "@/components/TodayEvents";
import groupBy from "@/components/group_by";

export default function Home() {
    const people = getPeople();
    const events = groupBy(
        getEvents()
            .map(({ date, name, id }) => ({
                date: date,
                name: name,
                link: `/event/${id}`,
            }))
            .concat(
                Object.entries(people)
                    .map(([id, { birthday, first_name }]) => ({
                        date: birthday,
                        name: `${first_name}'s Birthday`,
                        link: `/person/${id}`,
                    }))
                    .filter(({ date }) => DateTime.fromISO(date).isValid)
            ),
        (x) => `${DateTime.fromISO(x.date).month} ${DateTime.fromISO(x.date).day}`
    );

    return (
        <div className="container mb-6">
            {/* <Navigation people={people} /> */}
            <h1 className="title is-1 has-text-centered">Wiki Demo</h1>
            <div className="divider"></div>
            <div className="columns">
                <div className="column">
                    <p>
                        This is a demo of a Wiki clone website that I built using Javascript, Bulma,
                        and Next.js. The original purpose of the website was to be a Wikipedia-like
                        website for my group of friends where we documented our members and all of
                        the events/hangouts/parties that have happened over the years. Due to
                        privacy concerns, that site is private so I created this demo site and
                        filled it with randomly generated fake/placeholder data using Faker. The
                        general theme is akin to a TV show where there are main characters, side
                        characters, seasons, and events. You can use the search bar in the top menu
                        to look for pages as well.
                    </p>
                    <br />
                    <p>
                        The site leverages <a href="https://nextjs.org/">Next.js</a> and makes use
                        of a mix of{" "}
                        <a href="https://nextjs.org/docs/app/building-your-application/rendering/server-components">
                            server side React components and client side components
                        </a>{" "}
                        to provide a fast and crisp browsing experience that is superior to other
                        Wiki like sites like Fandom. All of the content is dynamically generated
                        from data files (i.e. data-driven) and rendered server side, which means
                        that each page is not hardcoded individually. The website is also fully
                        responsive and can be viewed comfortably on both desktop and mobile devices.
                    </p>
                    <div className="buttons mt-4">
                        <button className="button">
                            <Link href="/timeline">📅 View Timeline</Link>
                        </button>
                        <button className="button">
                            <Link href="/birthdays">🎂 Upcoming Birthdays</Link>
                        </button>
                        <button className="button">
                            {/* bruh, needed to do this to align the icon properly: https://stackoverflow.com/a/46656420 */}
                            <a href="https://github.com/lidickson1/wiki">
                                <Icon
                                    path={mdiGithub}
                                    size={1}
                                    style={{ verticalAlign: "bottom" }}
                                />{" "}
                                View the Source Code
                            </a>
                        </button>
                    </div>
                    <TodayEvents events={events} />
                </div>
            </div>

            <PeopleList
                name="Main Characters"
                people={Object.values(people).filter((person) => !person.side_character)}
                tags={(person) => person.seasons.map((g) => ordinal_suffix(g))}
            />
            <PeopleList
                name="Side Characters"
                people={Object.values(people).filter((person) => person.side_character)}
            />
        </div>
    );
}
