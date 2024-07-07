import { useState, createContext } from "react";

export const DropdownListContext = createContext();

export const DropdownList = ({ children }) => {
    const [openDropdownId, setOpenDropdownId] = useState(null);

    return (
        <DropdownListContext.Provider value={{ openDropdownId, setOpenDropdownId }}>
            {children}
        </DropdownListContext.Provider>
    );
};