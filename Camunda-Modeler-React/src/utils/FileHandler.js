import { saveAs } from 'file-saver'
import { jsonToXml } from './xml2json';

export const loadDiagram = (event, cb) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        const fileType = file.name.split('.').pop().toLowerCase();
        let bpmnXML;

        if (fileType === 'bpmn') {
            bpmnXML = e.target.result;
        } else if (fileType === 'json') {
            bpmnXML = jsonToXml(JSON.parse(e.target.result));
        }

        cb(bpmnXML);
    };

    if (file)
        reader.readAsText(file);
};

export const downloadXML = (xml) => {
    const blob = new Blob([xml], { type: 'application/xml' });
    saveAs(blob, 'diagram.bpmn');
};

export const downloadJSON = (json) => {
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'diagram.json');
};

export const downloadSVG = (svg) => {
    const blob = new Blob([svg], { type: 'image/svg' });
    saveAs(blob, 'diagram.svg');
}