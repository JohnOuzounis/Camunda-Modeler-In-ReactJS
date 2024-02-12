import React, { useEffect, useState, useRef } from 'react';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import { JParser } from './JParser';
import { downloadXML, downloadJSON } from './Downloader';
import { jsonToXml, xmlToJson } from './xml2json'

import './CamundaModeler.css'

const CamundaModeler = () => {
    const bpmnModelerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isOpen, setOpen] = useState(false);
    const [errorOccured, setErrorOccured] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        bpmnModelerRef.current = new BpmnModeler({
            container: '#bpmnview'
        });

        return () => {
            bpmnModelerRef.current.destroy();
        };
    }, []);

    const handleCreateDiagram = () => {
        const bpmnModeler = bpmnModelerRef.current;
        bpmnModeler.createDiagram((err, warnings) => {
            if (err) {
                console.error('Failed to create BPMN diagram', err);
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
            downloadXML(xml);
        } catch (error) {
            console.error('Error converting BPMN diagram to JSON', error);
        }
    };

    const loadDiagram = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            const parser = new JParser(e.target.result);
            const bpmnJSON = parser.parse();
            const bpmnXML = jsonToXml(bpmnJSON);
            // throw Error(bpmnXML);
            try {
                const modeler = bpmnModelerRef.current;
                modeler.importXML(bpmnXML);
                setOpen(true);
            } catch (error) {
                setErrorOccured(true);
                setErrorMsg(error.message);
            }
        };

        reader.readAsText(file);
    };

    const handleLoadDiagram = async () => {
        fileInputRef.current.click();
    };

    return (
        <div className='editor-container'>
            {errorOccured ? (
                <div className='error-message'>
                    {errorMsg}
                </div>
            ) : (
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
            )
            }
            <div id="bpmnview" className={`editor ${isOpen ? 'open' : 'closed'}`}></div>
            <input ref={fileInputRef} id="file-input" type="file" accept='application/json' style={{ display: 'none' }} onChange={loadDiagram} />
        </div>
    );
};

export default CamundaModeler;
