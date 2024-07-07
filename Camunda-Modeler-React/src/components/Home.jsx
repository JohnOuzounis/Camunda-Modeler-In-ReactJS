import { Modeler } from "./Modeler";
import styles from "../styles/Home.module.css";

export function Home() {
    return (
        <div className={styles['wrapper']}>
            <Modeler />
        </div>
    );
}