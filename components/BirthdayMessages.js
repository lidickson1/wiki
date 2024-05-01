import Link from "next/link";
import Image from "next/image";
import { getPersonImage } from "./lib";

export default function BirthdayMessages({ people, messages }) {
    return (
        <div className="my-5">
            {messages.map(({ id, message }, index) => {
                const person = people.find((x) => x.id === id);
                return (
                    <article className="media" key={index}>
                        <figure className="media-left">
                            <p className="image is-64x64">
                                <Link href={`person/${person.id}`}>
                                    <Image
                                        src={getPersonImage(person)}
                                        width={64}
                                        height={64}
                                        alt={person.id}
                                    ></Image>
                                </Link>
                            </p>
                        </figure>
                        <div className="media-content">
                            <div className="content">
                                <Link href={`person/${person.id}`}>
                                    <p style={{ marginTop: "-6px" }}>
                                        {/* <strong> */}
                                        {person.first_name} {person.last_name}
                                        {/* </strong>{" "} */}
                                    </p>
                                </Link>
                                <p style={{ whiteSpace: "pre-wrap" }}>
                                    {message}
                                </p>
                            </div>
                        </div>
                    </article>
                );
            })}
        </div>
    );
}
