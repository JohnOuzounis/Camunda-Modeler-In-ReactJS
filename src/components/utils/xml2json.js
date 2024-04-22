import { removeUniqueId } from "./JParser";

export function xmlToJson(xml) {
    let jsonString = '{\n';

    if (typeof xml === 'string') {
        const parser = new DOMParser();
        xml = parser.parseFromString(xml, 'text/xml');

        const filterEmptyTextNodes = (node) => {
            const childNodes = node.childNodes;
            for (let i = childNodes.length - 1; i >= 0; i--) {
                const childNode = childNodes[i];
                if (childNode.nodeType === Node.TEXT_NODE && !childNode.nodeValue.trim()) {
                    node.removeChild(childNode);
                } else if (childNode.nodeType === Node.ELEMENT_NODE) {
                    filterEmptyTextNodes(childNode);
                }
            }
        }
        filterEmptyTextNodes(xml);
    }

    if (!(xml instanceof XMLDocument)) {
        return jsonString + '}';
    }

    const parseNode = (node, depth) => {
        let indent = '  '.repeat(depth);
        function updateIndent(val) {
            depth += val;
            depth = (depth <= 0) ? 0 : depth;
            indent = '  '.repeat(depth);
        };

        if (node.nodeType === Node.ELEMENT_NODE) {
            jsonString += `${indent}"${node.nodeName}": {\n`;

            if (node.attributes.length > 0) {
                updateIndent(2);
                jsonString += `${indent}"_attributes": {\n`;
                updateIndent(2);
                for (let i = 0; i < node.attributes.length; i++) {
                    const attribute = node.attributes[i];
                    if (node.nodeName === 'bpmn:sequenceFlow' &&
                        (attribute.nodeName === "conditions:condition" ||
                            attribute.nodeName === "conditions:variable" ||
                            attribute.nodeName === "conditions:value"))
                        continue;
                    jsonString += `${indent}"${attribute.nodeName}": "${attribute.nodeValue}"`;
                    if (i < node.attributes.length - 1 &&
                        (node.attributes[i + 1].nodeName !== "conditions:condition" &&
                            node.attributes[i + 1].nodeName !== "conditions:variable" &&
                            node.attributes[i + 1].nodeName !== "conditions:value")) {
                        jsonString += ',\n';
                    }
                }

                updateIndent(-2);
                jsonString += `\n${indent}}`;
                if (node.nodeName === 'bpmn:sequenceFlow' && node.attributes['conditions:condition']) {
                    jsonString += ',\n';
                    jsonString += `${indent}"bpmn:conditionExpression": {\n`;
                    updateIndent(2);
                    jsonString += `${indent}"_attributes": {\n`;
                    updateIndent(2);
                    jsonString += `${indent}"xsi:type": "bpmn:tFormalExpression"`;
                    updateIndent(-2);
                    jsonString += `\n${indent}},\n`;
                    jsonString += `${indent}"#text": "\${environment.services.${node.attributes['conditions:condition'].nodeValue}(environment.variables.${node.attributes['conditions:variable'].nodeValue}, ${node.attributes['conditions:value'].nodeValue})}"`;
                    updateIndent(-2);
                    jsonString += `\n${indent}}`;
                }
                updateIndent(-2);
            }

            if (node.childNodes.length > 0) {
                if (node.attributes.length > 0) {
                    jsonString += ',\n';
                }
                for (let i = 0; i < node.childNodes.length; i++) {
                    const childNode = node.childNodes[i];
                    parseNode(childNode, depth + 2);
                    if (i < node.childNodes.length - 1) {
                        jsonString += ',\n';
                    }
                }
            }

            jsonString += `\n${indent}}`;
        }
        else if (node.nodeType === Node.TEXT_NODE) {
            const textValue = node.nodeValue.trim();
            if (textValue) {
                jsonString += `${indent}"#text": "${textValue}"`;
            }
        }
    };
    parseNode(xml.documentElement, 2);
    jsonString += '\n}';

    return jsonString;
}

export function jsonToXml(json, forModeler) {
    function convertNodeToXml(node, nodeName, depth) {
        let xml = '';
        const indent = '    '.repeat(depth);
        const nodeNameStripped = removeUniqueId(nodeName);


        if (typeof node === 'object') {
            if (forModeler && nodeNameStripped === 'bpmn:conditionExpression') return xml;
            xml += `${indent}<${removeUniqueId(nodeName)}`;
            if (node._attributes) {
                for (const attrName in node._attributes) {
                    xml += ` ${attrName}="${node._attributes[attrName]}"`;
                }
            }
            if (forModeler && nodeNameStripped === 'bpmn:sequenceFlow') {
                const cond = node['bpmn:conditionExpression'];
                if (cond) {
                    const serviceNameStartIndex = cond["#text"].indexOf('services.') + 'services.'.length;
                    const serviceNameEndIndex = cond["#text"].indexOf('(');
                    const condition = cond["#text"].substring(serviceNameStartIndex, serviceNameEndIndex);

                    // Extracting variable
                    const variableStartIndex = cond["#text"].indexOf('variables.') + 'variables.'.length;
                    const variableEndIndex = cond["#text"].indexOf(',', variableStartIndex);
                    const variable = cond["#text"].substring(variableStartIndex, variableEndIndex).trim();

                    // Extracting value
                    const valueStartIndex = variableEndIndex + 1;
                    const valueEndIndex = cond["#text"].lastIndexOf(')');
                    const value = cond["#text"].substring(valueStartIndex, valueEndIndex).trim();

                    xml += ` conditions:condition="${condition}"`;
                    xml += ` conditions:variable="${variable}"`;
                    xml += ` conditions:value="${value}"`;
                }
            }
            xml += `>${(nodeNameStripped === 'bpmn:conditionExpression') ? '' : '\n'}`;

            for (const key in node) {
                if (key === '_attributes') continue;
                if (key === '#text') {
                    if (nodeNameStripped === 'bpmn:conditionExpression')
                        xml += `${node[key]}`;
                    else
                        xml += `${'    '.repeat(depth + 1)}${node[key]}\n`;
                } else {
                    xml += convertNodeToXml(node[key], key, depth + 1);
                }
            }
            xml += `${(nodeNameStripped === 'bpmn:conditionExpression') ? '' : indent}</${removeUniqueId(nodeName)}>\n`;
        }
        return xml;
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;

    for (const key in json) {
        if (key === '_declaration') continue;
        xml += convertNodeToXml(json[key], key, 1);
    }

    return xml;
}
