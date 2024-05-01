"use client";

import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import { DateTime } from "luxon";
import eras from "@/seasons.json";

export default function PersonInfoBox({ person, values }) {
    const [era, setEra] = useState(Object.keys(person.images).at(-1));

    //if we don't know the month and day, we just calculate the age based on the year
    let birthdayDate = DateTime.fromISO(person.birthday);
    if (birthdayDate.invalid) {
        birthdayDate = DateTime.fromISO(`${person.birthday.split("-")[0]}`);
    }
    return (
        <div className="card">
            <div className="card-image">
                <div className="tabs mb-0">
                    <ul>
                        {Object.keys(person.images)
                            .reverse()
                            .map((x, index) => (
                                <li className={era === x ? "is-active" : undefined} key={index}>
                                    <a onClick={() => setEra(x)}>{eras[x].name}</a>
                                </li>
                            ))}
                    </ul>
                </div>
                <Carousel
                    autoPlay={true}
                    interval={5000}
                    infiniteLoop={true}
                    showThumbs={false}
                    showStatus={false}
                    key={era}
                >
                    {
                        //reversing the array so that latest images come first
                        [...person.images[era]].reverse().map((image, index) => (
                            <picture key={index}>
                                <img src={image} alt="" />
                            </picture>
                        ))
                    }
                </Carousel>
            </div>
            <div className="card-content">
                <table className="table is-fullwidth is-bordered" style={{ tableLayout: "fixed" }}>
                    <tbody>
                        {person.nickname && (
                            <tr>
                                <th>Nickname</th>
                                <td>{person.nickname}</td>
                            </tr>
                        )}
                        {person.role && (
                            <tr>
                                <th>Role</th>
                                <td>{person.role}</td>
                            </tr>
                        )}
                        {person.date_joined && (
                            <tr>
                                <th>Date Joined</th>

                                <td>{DateTime.fromISO(person.date_joined).toISODate()}</td>
                            </tr>
                        )}
                        <tr>
                            <th>Birthday</th>
                            <td>{DateTime.fromISO(person.birthday).toISODate()}</td>
                        </tr>
                        <tr>
                            <th>Age</th>
                            <td>{Math.floor(-birthdayDate.diffNow("years").years)}</td>
                        </tr>
                        <tr>
                            <th>Location</th>
                            <td>{person.location}</td>
                        </tr>
                        <tr>
                            <th>Origin</th>
                            <td>{person.origin}</td>
                        </tr>
                        <tr>
                            <th>Status</th>
                            <td>{person.status}</td>
                        </tr>
                        {/* {person.generation && !person.female && (
                            <tr>
                                <th>
                                    <a href="https://www.urbandictionary.com/define.php?term=Maidenless">
                                        Maidenless
                                    </a>
                                </th>
                                <td>{(person.maidenless ?? true).toString()}</td>
                            </tr>
                        )} */}
                        {values &&
                            Object.entries(values).map(([key, value], index) => (
                                <tr key={index}>
                                    <th>{key}</th>
                                    <td>{value.toString()}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
