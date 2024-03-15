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
                    jsonString += `${indent}"${attribute.nodeName}": "${attribute.nodeValue}"`;
                    if (i < node.attributes.length - 1) {
                        jsonString += ',\n';
                    }
                }
                updateIndent(-2);
                jsonString += `\n${indent}}`;
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

export function jsonToXml(json) {
    function convertNodeToXml(node, nodeName, depth) {
        let xml = '';

        if (typeof node === 'object') {
            xml += `<${removeUniqueId(nodeName)}`;
            if (node._attributes) {
                for (const attrName in node._attributes) {
                    xml += ` ${attrName}="${node._attributes[attrName]}"`;
                }
            }
            xml += `>`;

            for (const key in node) {
                if (key === '_attributes') continue;
                if (key === '#text') {
                    xml += `${node[key]}`;
                } else {
                    xml += convertNodeToXml(node[key], key, depth + 1);
                }
            }
            xml += `</${removeUniqueId(nodeName)}>`;
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
