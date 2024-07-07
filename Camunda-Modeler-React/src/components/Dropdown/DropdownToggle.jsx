import { useContext } from "react";
import { DropdownContext } from "./Dropdown";
import styles from "../../styles/Dropdown.module.css";


export const DropdownToggle = ({ children }) => {
    const { toggleDropdown } = useContext(DropdownContext);

    return (
        <button onClick={toggleDropdown} className={styles["dropdown-toggle"]}>
            {children}
        </button>
    );
};