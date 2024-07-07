import React, { useEffect, useState, useRef } from 'react';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js-embedded-comments/assets/comments.css';
import '@bpmn-io/properties-panel/assets/properties-panel.css';
import 'diagram-js-minimap/assets/diagram-js-minimap.css';

import minimapModule from 'diagram-js-minimap';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    // CamundaPlatformPropertiesProviderModule
} from 'bpmn-js-properties-panel';
import CamundaBpmnModdle from 'camunda-bpmn-moddle/resources/camunda.json';
import EmbeddedComments from 'bpmn-js-embedded-comments';
import ColorPickerModule from 'bpmn-js-color-picker';

import tagPropertiesProviderModule from './providers/tags';
import tagModdleDescriptor from './descriptors/tags';
import conditionPropertiesProviderModule from './providers/conditions';
import conditionModdleDescriptor from './descriptors/conditions';

import { downloadJSON } from './utils/Downloader';
import { jsonToXml, xmlToJson } from './utils/xml2json';

import './style/CamundaModeler.css';
import './style/comments.css';

const CamundaModeler = () => {
    const bpmnModelerRef = useRef(null);
    const propertiesPanelRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        if (!bpmnModelerRef.current) {

            bpmnModelerRef.current = new BpmnModeler({
                container: '#bpmnview',
                propertiesPanel: {
                    parent: '#propertiesview'
                },
                additionalModules: [
                    BpmnPropertiesPanelModule,
                    BpmnPropertiesProviderModule,
                    tagPropertiesProviderModule,
                    conditionPropertiesProviderModule,
                    // CamundaPlatformPropertiesProviderModule,
                    minimapModule,
                    EmbeddedComments,
                    ColorPickerModule
                ],
                moddleExtensions: {
                    tags: tagModdleDescriptor,
                    conditions: conditionModdleDescriptor,
                    camunda: CamundaBpmnModdle
                },
                keyboard: {
                    bindTo: document
                }
            });

            bpmnModelerRef.current.createDiagram();
            propertiesPanelRef.current = bpmnModelerRef.current.get('propertiesPanel');
        }
    }, []);

    const handleCreateDiagram = () => {
        const bpmnModeler = bpmnModelerRef.current;
        bpmnModeler.createDiagram((err, warnings) => {
            if (err) {
                console.log('Failed to create BPMN diagram: ' + err.message);
            } else {
                console.log('BPMN diagram created successfully');
            }
        });
        setOpen(true);
    };

    const handleSaveDiagram = async () => {
        const bpmnModeler = bpmnModelerRef.current;
        const { xml } = await bpmnModeler.saveXML({ format: true }, function (err, xml) {
        });
        const json = xmlToJson(xml);
        downloadJSON(JSON.stringify(json, null, 4));
    };

    const loadDiagram = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileType = file.name.split('.').pop().toLowerCase();
            let bpmnXML;

            if (fileType === 'bpmn') {
                bpmnXML = e.target.result;
            } else if (fileType === 'json') {
                bpmnXML = jsonToXml(JSON.parse(e.target.result), true);
            }
            const modeler = bpmnModelerRef.current;
            modeler.importXML(bpmnXML);
            setOpen(true);
        };
        if (file)
            reader.readAsText(file);
    };

    const handleLoadDiagram = async () => {
        fileInputRef.current.click();
    };

    return (
        <div className='editor-container'>
            {
                !isOpen ? (
                    <div className='intro-text'>
                        <div>
                            <button className="create-link" onClick={handleCreateDiagram}>Create a new diagram </button>
                            {' '}or{' '}
                            <label htmlFor="file-input" className="load-link">
                                <span>Load an existing one</span>
                            </label>
                            {' '}to get started.
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="button-container">
                            <button className="action-button create-button" onClick={handleCreateDiagram}>Create</button>
                            <button className="action-button save-button" onClick={handleSaveDiagram}>Save</button>
                            <button className="action-button load-button" onClick={handleLoadDiagram}>Load</button>
                        </div>
                    </div>
                )
            }
            <div id="bpmnview" className={`editor ${isOpen ? 'open' : 'closed'}`}></div>
            <div id="propertiesview" className={`properties-panel ${isOpen ? 'open' : 'closed'}`}></div>
            <input
                ref={fileInputRef}
                id="file-input"
                type="file"
                accept='.bpmn, .json'
                style={{ display: 'none' }}
                onChange={loadDiagram} />
        </div >
    );
};

export default CamundaModeler;
