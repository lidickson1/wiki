import Image from "next/image";
import Link from "next/link";
import { getPersonImage } from "./lib";

export function PeopleList({ name, people, centered, tags }) {
    return (
        <>
            {name && (
                <>
                    <h1 className="title mt-5">{name}</h1>
                    <div className="divider"></div>
                </>
            )}
            <div
                className={`columns is-mobile ${centered && "is-centered"}`}
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    // gap: "30px",
                }}
            >
                {people.map((person, index) => (
                    <div
                        className="column is-one-fifth-desktop is-one-quarter-tablet is-half-mobile"
                        key={index}
                    >
                        <PersonCard person={person} getTags={tags} />
                    </div>
                ))}
            </div>
        </>
    );
}

export function PersonCard({ person, getTags }) {
    const tags = getTags ? getTags(person) : [];
    if (person.nominee) {
        tags.push("Nominee");
    }
    return (
        <Link href={`/person/${person.id}`}>
            <div className="card" style={{ borderRadius: "1rem" }}>
                <div className="card-image">
                    <figure
                        className="image is-square"
                        style={{
                            float: "none",
                            width: "100%",
                            margin: 0,
                        }}
                    >
                        <Image
                            src={getPersonImage(person)}
                            alt={person.first_name}
                            width="0"
                            height="0"
                            sizes="100vw"
                            style={{
                                width: "100%",
                                height: "auto",
                                borderTopLeftRadius: "1rem",
                                borderTopRightRadius: "1rem",
                            }}
                        />
                    </figure>
                </div>
                <div className="card-content" style={{ padding: "1.25rem 0.5rem" }}>
                    <h5 className="title is-5 has-text-centered mb-2">{person.first_name}</h5>
                    {!!tags.length && (
                        <div
                            className="is-flex is-justify-content-center is-flex-wrap-wrap"
                            style={{ gap: "0.5rem" }}
                        >
                            {tags.map((tag, index) => (
                                <span className="tag" key={index}>
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Link>
    );
}
