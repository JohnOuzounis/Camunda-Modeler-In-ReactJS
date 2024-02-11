import React, { useEffect, useRef } from 'react';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

import BpmnModeler from 'bpmn-js/lib/Modeler';
import BpmnModdle from 'bpmn-moddle';
import xml2js from 'xml-js';

import './CamundaModeler.css'

const CamundaModeler = () => {
    const bpmnModelerRef = useRef(null);

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
    };

    const handleSaveDiagram = async () => {
        const bpmnModeler = bpmnModelerRef.current;
        try {
            const { xml } = await bpmnModeler.saveXML({ format: true }, function (err, xml) {
                //here xml is the bpmn format 
            });
            const json = xml2js.xml2json(xml, { compact: true, spaces: 2 });
            downloadJSON(json);
        } catch (error) {
            console.error('Error converting BPMN diagram to JSON', error);
        }
    };

    const downloadXML = (xml) => {
        const blob = new Blob([xml], { type: 'application/xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diagram.bpmn';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const downloadJSON = (json) => {
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'diagram.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleLoadDiagram = () => {
        // Handle loading a BPMN diagram
    };

    return (
        <div className='editor-container'>
            <div className="button-container">
                <button className="action-button create-button" onClick={handleCreateDiagram}>Create</button>
                <button className="action-button save-button" onClick={handleSaveDiagram}>Save</button>
                <button className="action-button load-button" onClick={handleLoadDiagram}>Load</button>
            </div>
            <div id="bpmnview" className='editor'></div>
        </div>
    );
};

export default CamundaModeler;
