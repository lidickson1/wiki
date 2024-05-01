"use client";

import { useState, Fragment } from "react";
import Link from "next/link";

export default function Timeline({ events, eras }) {
    const [reversed, setReversed] = useState(true);

    return (
        <>
            <div className="field">
                <input
                    id="switchExample"
                    type="checkbox"
                    name="switchExample"
                    className="switch"
                    defaultChecked={reversed}
                    onChange={() => setReversed(!reversed)}
                />
                <label htmlFor="switchExample">Show Recent Events First</label>
            </div>
            <div
                className="timeline mt-5 is-centered"
                style={{
                    flexDirection: reversed ? "column-reverse" : "column",
                }}
            >
                {events.map((event, index) => {
                    if (event.season) {
                        return (
                            <Fragment key={index}>
                                <header className="timeline-header" id={event.season}>
                                    <span className="tag is-medium is-primary">
                                        {eras.find((x) => x.season === event.season).name}
                                    </span>
                                </header>
                                {
                                    //if there isn't an event following the era, then we need to manually add a space
                                    index < events.length - 1 && !events[index + 1]?.events && (
                                        <div className="timeline-item"></div>
                                    )
                                }
                            </Fragment>
                        );
                    } else if (event.events) {
                        return (
                            <div className="timeline-item" key={index}>
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                    <p className="heading">{event.date}</p>
                                    {event.events.map((e, i) => (
                                        <Fragment key={e.id}>
                                            <Link href={`/event/${e.id}`}>
                                                {e.name ?? e.summary}
                                            </Link>
                                            {i < event.events.length - 1 && <br />}
                                        </Fragment>
                                    ))}
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <header className="timeline-header" key={index}>
                                <span className="tag is-light">{event.date}</span>
                            </header>
                        );
                    }
                })}
                <header className="timeline-header">
                    <span className="tag is-medium is-primary">Present</span>
                </header>
            </div>
        </>
    );
}
