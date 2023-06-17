import * as React from "react";
import { IAbsentProps } from "../AbsentWebPart";
import styles from "./Absent.module.scss";

const Absent: React.FC<IAbsentProps> = (props) => {
    const [absent, setAbsent] = React.useState([]);

    async function load() {
        try {
            const resp = await props.getAbsent();
            console.log("resp", resp.value);
            setAbsent(resp.value);
        } catch (err) {
            console.log(err);
        }
    }

    React.useEffect(() => {
        load();
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
                        console.log(coverage);
                        return (
                            <tr>
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
