import { getPersonImage } from "./lib";
import Image from "next/image";

export default function Ranking({ title, items, type }) {
    //sort and resolve ties
    const sortedItems = [...items].sort((a, b) => b[1] - a[1]);
    const rankedItems = [];
    let rank = 0;
    for (let i = 0; i < sortedItems.length; i++) {
        //if there is a tie don't increment
        let tie;
        if (i > 0 && sortedItems[i][1] === sortedItems[i - 1][1]) {
            tie = true;
        } else {
            rank++;
        }
        rankedItems.push([tie ? "" : rank, ...sortedItems[i]]);
    }
    return (
        <div className="box">
            <h1 className="title is-5 mb-3 has-text-centered">{title}</h1>
            <table className="table is-fullwidth">
                <tbody>
                    {rankedItems.map((item, index) => (
                        <tr key={index}>
                            <th>{item[0]}</th>
                            <td>
                                {type === "people" ? (
                                    <div className="is-flex">
                                        <figure className="image is-32x32">
                                            <Image
                                                src={getPersonImage(item[1])}
                                                width={32}
                                                height={32}
                                                alt={item[1].id}
                                            ></Image>
                                        </figure>
                                        <p className="ml-2">{item[1].first_name}</p>
                                    </div>
                                ) : (
                                    item[1]
                                )}
                            </td>
                            <td>{item[2]}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
