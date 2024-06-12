"use client";

import { InlineImages } from "../../../components/images";
import Icon from "@mdi/react";
import { mdiChevronUp, mdiChevronDown } from "@mdi/js";
import Collapsible from "react-collapsible";
import { DateTime } from "luxon";
import ordinal_suffix from "../../../components/ordinal";
import Link from "next/link";
import LazyLoad from "react-lazyload-v18";
import { useContext, useEffect, useState } from "react";
import Context from "./provider";

export default function Section({ id, name, person }) {
    const { collapsed, setCollapsed } = useContext(Context);
    const [loading, setLoading] = useState(false);
    const [dateEvents, setDateEvents] = useState([]);

    useEffect(() => {
        if (!collapsed[id] && !dateEvents.length && !loading) {
            setLoading(true);
            fetch("/api/person-events", {
                method: "POST",
                headers: {
                    // 'Accept': 'application/json',
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ person: person, section: id }),
            })
                .then((res) => res.json())
                .then((res) => {
                    // console.log(`Fetched ${section} events:`);
                    // console.log(res);
                    setDateEvents(res);
                    setLoading(false);
                });
        }
    }, [collapsed]);

    return (
        <div style={{ clear: "both" }}>
            <Collapsible
                trigger={<SectionTitle id={id} name={name} collapsed={collapsed[id]} />}
                transitionTime={200}
                open={!collapsed[id]}
                //using trigger here so that it doesn't trigger the handler twice
                onTriggerOpening={() => setCollapsed({ ...collapsed, [id]: false })}
                onTriggerClosing={() => setCollapsed({ ...collapsed, [id]: true })}
                //disable auto-generating ids, see https://github.com/glennflanagan/react-collapsible/issues/210
                contentElementId={`${id}-collapsible`}
                triggerElementProps={{ id: `${id}-collapsible-trigger` }}
            >
                <div className="mb-5">
                    {loading ? (
                        <div className="button is-loading is-ghost"></div>
                    ) : (
                        dateEvents.map(({ date, events, media }, index) => {
                            const datetime = DateTime.fromISO(date);
                            return (
                                <div key={index}>
                                    {index > 0 && (
                                        <p
                                            style={{
                                                margin: "1em",
                                            }}
                                        ></p>
                                    )}
                                    <div
                                        className="event"
                                        style={{
                                            flexDirection: "column",
                                        }}
                                    >
                                        {media.length > 0 && !collapsed[id] && (
                                            <div className="event-images-div">
                                                <LazyLoad>
                                                    <InlineImages
                                                        images={media}
                                                        floatIndex={dateEvents
                                                            .filter((e) => e.media.length > 0)
                                                            .findIndex((e) => e.date === date)}
                                                    />
                                                </LazyLoad>
                                            </div>
                                        )}
                                        <div className="event-summary-div">
                                            <p className="heading">{`${datetime.toFormat(
                                                "MMM"
                                            )} ${ordinal_suffix(datetime.day)}`}</p>
                                            {events.map((event, index) => (
                                                <div
                                                    //prevent date and summary being separated by floated images
                                                    // style={{ display: "flex" }}
                                                    key={index}
                                                >
                                                    {event.id && (
                                                        <Link href={`/event/${event.id}`}>
                                                            <h5 className="is-size-5">
                                                                {event.name}
                                                            </h5>
                                                        </Link>
                                                    )}
                                                    <div
                                                        //person-specific events don't have ids
                                                        //also we don't want them to have event-summary class
                                                        //because we don't want to hide the content on mobile
                                                        className={`mb-1 ${
                                                            event.id ? "event-summary" : ""
                                                        }`}
                                                        dangerouslySetInnerHTML={{
                                                            __html: "<p>" + event.summary + "</p>",
                                                        }}
                                                    ></div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {media.length > 0 && !collapsed[id] && (
                                        <div
                                            style={{
                                                clear:
                                                    dateEvents
                                                        .filter((e) => e.media.length > 0)
                                                        .findIndex((e) => e.date === date) %
                                                        2 ===
                                                    0
                                                        ? "left"
                                                        : "right",
                                            }}
                                        ></div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </Collapsible>
        </div>
    );
}

function SectionTitle({ id, name, collapsed }) {
    return (
        <div id={id} style={{ cursor: "pointer" }}>
            <div className="level">
                <div className="level-left">
                    <h1 className="title">{name}</h1>
                </div>
                <div className="level-right">
                    <span className="icon">
                        <Icon
                            path={collapsed ? mdiChevronDown : mdiChevronUp}
                            size={1}
                            className="section-arrow"
                        />
                    </span>
                </div>
            </div>

            <div className="divider"></div>
        </div>
    );
}
