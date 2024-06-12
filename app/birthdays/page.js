import "bulma-timeline/dist/css/bulma-timeline.min.css";
import { getPeople } from "@/components/lib";
import Birthdays from "./Birthdays";

export default function BirthdaysPage() {
    const people = getPeople();

    return (
        <div className="container mb-6">
            <h1 className="title is-1">Upcoming Birthdays</h1>
            <div className="divider"></div>
            <p>
                This is an overview of the upcoming birthdays of all characters (i.e. main and side
                characters are all included).
            </p>
            <div className="timeline mt-5 is-centered">
                <Birthdays people={people} />
            </div>
        </div>
    );
}
