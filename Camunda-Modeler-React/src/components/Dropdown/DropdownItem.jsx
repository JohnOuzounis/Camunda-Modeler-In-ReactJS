import { useContext } from "react";
import { DropdownContext } from "./Dropdown";
import styles from "../../styles/Dropdown.module.css";


export const DropdownItem = ({ children, onClick }) => {
    const { toggleDropdown } = useContext(DropdownContext);

    const handleClick = () => {
        onClick();
        toggleDropdown();
    };

    return (
        <button onClick={handleClick} className={styles["dropdown-item"]}>
            {children}
        </button>
    );
};