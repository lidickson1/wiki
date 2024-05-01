"use client";

import Link from "next/link";
import { DateTime } from "luxon";
import ordinal_suffix from "@/components/ordinal";

export default function TodayEvents({ events }) {
    const today = events[`${DateTime.now().month} ${DateTime.now().day}`];
    return (
        today && (
            <article className="message is-primary">
                <div className="message-header">
                    <p>
                        On This Day - {DateTime.now().monthLong}{" "}
                        {ordinal_suffix(DateTime.now().day)}
                    </p>
                </div>
                <div className="message-body content today">
                    <ul>
                        {today.map(({ name, link }, index) => (
                            <li key={index}>
                                <Link href={link}>{name}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </article>
        )
    );
}
