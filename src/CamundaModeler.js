import React, { useEffect, useState, useRef } from 'react';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import '@bpmn-io/properties-panel/assets/properties-panel.css';
import 'diagram-js-minimap/assets/diagram-js-minimap.css';


import minimapModule from 'diagram-js-minimap';
import BpmnModeler from 'bpmn-js/lib/Modeler';
import {
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule
} from 'bpmn-js-properties-panel';

import { JParser } from './JParser';
import { downloadJSON } from './Downloader';
import { jsonToXml, xmlToJson } from './xml2json'

import './CamundaModeler.css'

const CamundaModeler = () => {
    const bpmnModelerRef = useRef(null);
    const propertiesPanelRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isOpen, setOpen] = useState(false);

    useEffect(() => {
        bpmnModelerRef.current = new BpmnModeler({
            container: '#bpmnview',
            propertiesPanel: {
                parent: '#propertiesview'
            },
            additionalModules: [
                BpmnPropertiesPanelModule,
                BpmnPropertiesProviderModule,
                minimapModule
            ]
        });

        propertiesPanelRef.current = bpmnModelerRef.current.get('propertiesPanel');

        return () => {
            bpmnModelerRef.current.destroy();
        };
    }, []);

    const handleError = (msg) => {
        setOpen(false);
        window.alert(msg);
    };

    const handleCreateDiagram = () => {
        const bpmnModeler = bpmnModelerRef.current;
        bpmnModeler.createDiagram((err, warnings) => {
            if (err) {
                handleError('Failed to create BPMN diagram: ' + err.message);
            } else {
                console.log('BPMN diagram created successfully');
            }
        });
        setOpen(true);
    };

    const handleSaveDiagram = async () => {
        const bpmnModeler = bpmnModelerRef.current;
        try {
            const { xml } = await bpmnModeler.saveXML({ format: true }, function (err, xml) {
            });
            const json = xmlToJson(xml);
            downloadJSON(json);
        } catch (error) {
            handleError('Error converting BPMN diagram to JSON: ' + error.message);
        }
    };

    const loadDiagram = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const fileType = file.name.split('.').pop().toLowerCase();
                let bpmnXML;

                if (fileType === 'bpmn') {
                    bpmnXML = e.target.result;
                } else if (fileType === 'json') {
                    const parser = new JParser(e.target.result);
                    const bpmnJSON = parser.parse();
                    bpmnXML = jsonToXml(bpmnJSON);
                }
                const modeler = bpmnModelerRef.current;
                modeler.importXML(bpmnXML);
                setOpen(true);
            } catch (error) {
                handleError('Error occured while loading BPMN diagram: ' + error.message);
            }
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
                    <div className="button-container">
                        <button className="action-button create-button" onClick={handleCreateDiagram}>Create</button>
                        <button className="action-button save-button" onClick={handleSaveDiagram}>Save</button>
                        <button className="action-button load-button" onClick={handleLoadDiagram}>Load</button>
                    </div>)
            }
            <div id="bpmnview" className={`editor ${isOpen ? 'open' : 'closed'}`}></div>
            <div id="propertiesview" className={`properties-panel ${isOpen ? 'open' : 'closed'}`}></div>
            <input ref={fileInputRef} id="file-input" type="file" accept='.bpmn, .json' style={{ display: 'none' }} onChange={loadDiagram} />
        </div>
    );
};

export default CamundaModeler;
