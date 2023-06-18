import * as React from "react";
import { IAbsentProps } from "../AbsentWebPart";
import { Absence } from "./Absence";
import styles from "./Absent.module.scss";

const Absent: React.FC<IAbsentProps> = (props) => {
    const [absent, setAbsent] = React.useState<Absence[]>([]);

    async function load(): Promise<void> {
        try {
            const { value } = await props.getAbsent();
            setAbsent(value);
        } catch (err) {
            console.log(err);
            throw new Error("problem loading data");
        }
    }

    React.useEffect(() => {
        load().catch(console.error);
    }, [props.division]);

    if (!absent.length) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <table className={styles.absent}>
                <thead>
                    <tr>
                        <th>Absent</th>
                        <th>Covered By</th>
                    </tr>
                </thead>

                <tbody>
                    {absent.map((a) => {
                        const coverage =
                            a.Coverage && a.Coverage.length
                                ? a.Coverage.reduce((acc: string[], cur: { Title: string }) => {
                                    acc.push(cur.Title);
                                    return acc;
                                }, [])
                                : [];
                        return (
                            <tr key={a["@odata.id"]}>
                                <td>{a.Faculty.Title}</td>
                                <td>{coverage.join(", ")}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Absent;
