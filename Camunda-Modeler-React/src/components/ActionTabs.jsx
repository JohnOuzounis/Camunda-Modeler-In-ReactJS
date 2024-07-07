import { Dropdown } from "./Dropdown/Dropdown";
import { DropdownToggle } from "./Dropdown/DropdownToggle";
import { DropdownMenu } from "./Dropdown/DropdownMenu";
import { DropdownItem } from "./Dropdown/DropdownItem";

import styles from "../styles/ActionTabs.module.css"
import { DropdownList } from "./Dropdown/DropdownList";

export function ActionTabs(props) {
    return (
        <div className={styles['tabs']}>
            <DropdownList>
                <Dropdown id='file'>
                    <DropdownToggle>
                        <label className={styles['tab-title']}>File</label>
                    </DropdownToggle>

                    <DropdownMenu>
                        <DropdownItem onClick={props.file.create}>
                            <label className={styles['item-text']}>Create New File</label>
                        </DropdownItem>

                        <DropdownItem onClick={props.file.load}>
                            <label className={styles['item-text']}>Open File</label>
                        </DropdownItem>

                    </DropdownMenu>
                </Dropdown>

                <Dropdown id='export'>
                    <DropdownToggle>
                        <label className={styles['tab-title']}>Export</label>
                    </DropdownToggle>

                    <DropdownMenu>
                        <DropdownItem onClick={props.export.toJson}>
                            <label className={styles['item-text']}>Export to Json</label>
                        </DropdownItem>

                        <DropdownItem onClick={props.export.toBpmn}>
                            <label className={styles['item-text']}>Export to Bpmn</label>
                        </DropdownItem>

                        <DropdownItem onClick={props.export.toSvg}>
                            <label className={styles['item-text']}>Export to Svg</label>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </DropdownList>
        </div>
    );
}