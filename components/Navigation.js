"use client";

import { useState } from "react";
import Link from "next/link";
import Icon from "@mdi/react";
import { mdiChevronUp, mdiMagnify, mdiCloseCircle } from "@mdi/js";
import fuzzysort from "fuzzysort";
import "bulma-floating-button/dist/css/bulma-floating-button.min.css";

export default function Navigation({ people }) {
    const [menuToggle, setMenuToggle] = useState(false);
    const [search, setSearch] = useState("");
    const [mainCharactersToggle, setMainCharactersToggle] = useState(false);
    const [sideCharactersToggle, setSideCharactersToggle] = useState(false);
    const [events, setEvents] = useState(null); //we lazy load events (through api) because there's a lot

    //TODO also include locations
    const result = fuzzysort.go(
        search,
        Object.values(people)
            .map((person) => ({
                entry: person.first_name,
                link: `/person/${person.id}`,
            }))
            .concat(
                events
                    ? events.map(({ name, link }) => ({
                          entry: name,
                          link: link,
                      }))
                    : []
            ),
        { limit: 10, key: "entry" }
    );
    return (
        <>
            <nav className="navbar my-5" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <div className="navbar-item">
                        <p className="title">Wiki Demo</p>
                    </div>

                    <a
                        role="button"
                        className="navbar-burger"
                        aria-label="menu"
                        aria-expanded="false"
                        data-target="navbarBasicExample"
                        onClick={() => setMenuToggle(!menuToggle)}
                    >
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div
                    id="navbarBasicExample"
                    className={"navbar-menu " + (menuToggle ? "is-active" : "")}
                >
                    <div className="navbar-start">
                        <Link href="/" className="navbar-item" onClick={() => setMenuToggle(false)}>
                            Home
                        </Link>

                        <Link
                            href="/timeline"
                            className="navbar-item"
                            onClick={() => setMenuToggle(false)}
                        >
                            Timeline
                        </Link>

                        <div className="navbar-item has-dropdown is-hoverable">
                            <a
                                className="navbar-link"
                                onMouseOver={() => setMainCharactersToggle(true)}
                                onClick={() => setMainCharactersToggle(!mainCharactersToggle)}
                            >
                                Main Characters
                            </a>
                            <div
                                className={
                                    "navbar-dropdown " + (mainCharactersToggle ? "" : "is-hidden")
                                }
                            >
                                {Object.values(people)
                                    .filter((person) => !person.side_character)
                                    .map((person) => (
                                        <a
                                            className="navbar-item"
                                            href={`/person/${person.id}`}
                                            key={person.id}
                                        >
                                            {person.first_name}
                                        </a>
                                    ))}
                            </div>
                        </div>

                        <div className="navbar-item has-dropdown is-hoverable">
                            <a
                                className="navbar-link"
                                onMouseOver={() => setSideCharactersToggle(true)}
                                onClick={() => setSideCharactersToggle(!sideCharactersToggle)}
                            >
                                Side Characters
                            </a>
                            <div
                                className={
                                    "navbar-dropdown " + (sideCharactersToggle ? "" : "is-hidden")
                                }
                            >
                                {/* <div className="navbar-item has-text-weight-bold">
                                    Side Characters
                                </div> */}
                                {Object.values(people)
                                    .filter((person) => person.side_character)
                                    .map((person) => (
                                        <a
                                            className="navbar-item"
                                            href={`/person/${person.id}`}
                                            key={person.id}
                                        >
                                            {person.first_name}
                                        </a>
                                    ))}
                                {/* <hr className="navbar-divider"></hr>
                                <div className="navbar-item has-text-weight-bold">
                                    Acquaintances
                                </div>
                                {Object.values(people)
                                    .filter((person) => !person.generation && person.acquaintance)
                                    .map((person) => (
                                        <a
                                            className="navbar-item"
                                            href={`/person/${person.id}`}
                                            key={person.id}
                                        >
                                            {person.first_name}
                                        </a>
                                    ))} */}
                            </div>
                        </div>
                    </div>

                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="dropdown is-active">
                                <div className="field">
                                    <p
                                        className="control has-icons-left has-icons-right"
                                        //only load the events if we clicked on the search box
                                        onClick={() => {
                                            if (!events) {
                                                fetch("/api/events")
                                                    .then((res) => res.json())
                                                    .then((res) => setEvents(res));
                                            }
                                        }}
                                    >
                                        <input
                                            className="input"
                                            type="text"
                                            placeholder="Search"
                                            value={search}
                                            onChange={(event) => setSearch(event.target.value)}
                                        />
                                        <span className="icon is-small is-left">
                                            <Icon
                                                path={mdiMagnify}
                                                size={1}
                                                className="search-box-icon"
                                            />
                                        </span>
                                        {search && (
                                            <span
                                                className="icon is-small is-right"
                                                style={{
                                                    cursor: "pointer",
                                                    pointerEvents: "auto",
                                                }}
                                                onClick={() => setSearch("")}
                                            >
                                                <Icon
                                                    path={mdiCloseCircle}
                                                    size={0.8}
                                                    className="search-box-icon"
                                                />
                                            </span>
                                        )}
                                    </p>
                                </div>
                                {
                                    <div
                                        className="dropdown-menu"
                                        id="dropdown-menu4"
                                        role="menu"
                                        style={{
                                            display: search ? "block" : "none",
                                        }}
                                    >
                                        <div className="dropdown-content">
                                            {result.length > 0 ? (
                                                result
                                                    .sort((a, b) => b.score - a.score)
                                                    .map(({ obj }, index) => (
                                                        <a
                                                            className="dropdown-item"
                                                            href={obj.link}
                                                            key={index}
                                                        >
                                                            {obj.entry}
                                                        </a>
                                                    ))
                                            ) : (
                                                <div className="dropdown-item">
                                                    <p className="has-text-danger">
                                                        No results found
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <a
                href="#"
                className="button is-floating is-small"
                style={{ bottom: "20px", right: "20px", borderRadius: "50%" }}
            >
                <span className="icon">
                    <Icon path={mdiChevronUp} size="1.6rem" className="section-arrow" />
                </span>
            </a>
        </>
    );
}
