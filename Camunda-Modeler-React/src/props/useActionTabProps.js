import { downloadJSON, downloadXML, downloadSVG } from "../utils/FileHandler";
import { xmlToJson } from "../utils/xml2json";

export function useActionTabProps(getModeler, loader) {

    const actionTabProps = {
        file: {
            create: () => {
                const modeler = getModeler();
                modeler?.createDiagram();
            },

            load: loader,
        },
        export: {
            toJson: async () => {
                const modeler = getModeler();

                if (modeler) {
                    const { xml } = await modeler.saveXML({ format: true });
                    const json = xmlToJson(xml);
                    downloadJSON(JSON.stringify(json, null, 4));
                }
            },

            toBpmn: async () => {
                const modeler = getModeler();

                if (modeler) {
                    const { xml } = await modeler.saveXML({ format: true });
                    downloadXML(xml);
                }
            },

            toSvg: async () => {
                const modeler = getModeler();

                if (modeler) {
                    const { svg } = await modeler.saveSVG();
                    downloadSVG(svg);
                }
            }
        }
    }

    return { actionTabProps };
}