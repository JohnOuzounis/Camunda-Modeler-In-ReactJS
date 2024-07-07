import React, { useEffect, useState, useRef } from 'react';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js-embedded-comments/assets/comments.css';
import '@bpmn-io/properties-panel/assets/properties-panel.css';
import 'diagram-js-minimap/assets/diagram-js-minimap.css';
import '../styles/comments.css';
import styles from '../styles/Modeler.module.css';

import minimapModule from 'diagram-js-minimap';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    CamundaPlatformPropertiesProviderModule
} from 'bpmn-js-properties-panel';
import CamundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda.json';
import EmbeddedComments from 'bpmn-js-embedded-comments';
import ColorPickerModule from 'bpmn-js-color-picker';
import { ActionTabs } from './ActionTabs';
import { useActionTabProps } from '../props/useActionTabProps';
import { loadDiagram } from '../utils/FileHandler';

export function Modeler() {
    const bpmnModelerRef = useRef(null);
    const propertiesPanelRef = useRef(null);
    const fileInputRef = useRef(null);

    const getModeler = () => bpmnModelerRef.current;
    const diagramLoader = () => fileInputRef.current?.click()

    const { actionTabProps } = useActionTabProps(getModeler, diagramLoader);

    useEffect(() => {
        if (!bpmnModelerRef.current) {
            bpmnModelerRef.current = createModeler();
            propertiesPanelRef.current = bpmnModelerRef.current.get('propertiesPanel');
        }
    }, []);

    const createModeler = () => {
        const modeler = new BpmnModeler({
            container: '#bpmnview',
            propertiesPanel: {
                parent: '#propertiesview'
            },
            additionalModules: [
                BpmnPropertiesPanelModule,
                BpmnPropertiesProviderModule,
                CamundaPlatformPropertiesProviderModule,
                minimapModule,
                EmbeddedComments,
                ColorPickerModule
            ],
            moddleExtensions: {
                camunda: CamundaBpmnModdle
            },
            keyboard: {
                bindTo: document
            }
        });

        modeler.createDiagram();

        return modeler;
    };

    return (
        <>
            <ActionTabs {...actionTabProps} />

            <div className={styles['editor']}>
                <div id="bpmnview" className={styles['modeler']} />
                <div id="propertiesview" className={styles['properties-panel']} />
            </div>

            <input
                ref={fileInputRef}
                id="file-input"
                type="file"
                accept='.bpmn, .json'
                style={{ display: 'none' }}
                onChange={(e) => loadDiagram(e, (xml) => {
                    const modeler = bpmnModelerRef.current;
                    modeler?.importXML(xml);
                })} />
        </>
    );
}

