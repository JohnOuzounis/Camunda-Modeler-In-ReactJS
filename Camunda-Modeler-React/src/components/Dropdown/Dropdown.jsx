import { useContext, createContext } from "react";
import { DropdownListContext } from "./DropdownList";
import styles from "../../styles/Dropdown.module.css";

export const DropdownContext = createContext();

export const Dropdown = ({ id, children }) => {
    const { openDropdownId, setOpenDropdownId } = useContext(DropdownListContext);
    const isOpen = openDropdownId === id;

    const toggleDropdown = () => {
        setOpenDropdownId(isOpen ? null : id);
    };

    return (
        <DropdownContext.Provider value={{ isOpen, toggleDropdown }}>
            <div className={styles["dropdown"]}>{children}</div>
        </DropdownContext.Provider>
    );
};