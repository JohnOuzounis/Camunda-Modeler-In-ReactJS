import { useContext, useRef, useEffect } from "react";
import { DropdownContext } from "./Dropdown";

import styles from "../../styles/Dropdown.module.css";

export const DropdownMenu = ({ children }) => {
    const { isOpen, toggleDropdown } = useContext(DropdownContext);
    const menuRef = useRef(null);

    useEffect(() => {
        const closeMenu = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                toggleDropdown();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", closeMenu);
        } else {
            document.removeEventListener("mousedown", closeMenu);
        }

        return () => {
            document.removeEventListener("mousedown", closeMenu);
        };
    }, [isOpen, toggleDropdown]);

    return isOpen ? (
        <div ref={menuRef} className={styles["dropdown-menu"]}>
            {children}
        </div>
    ) : null;
};
