import { saveAs } from 'file-saver'

export const downloadXML = (xml) => {
    const blob = new Blob([xml], { type: 'application/xml' });
    saveAs(blob, 'diagram.bpmn');
};

export const downloadJSON = (json) => {
    const blob = new Blob([json], { type: 'application/json' });
    saveAs(blob, 'diagram.json');
};
