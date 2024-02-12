
export function xmlToJson(xml) {
    let jsonString = '{'; // Initialize an empty string to store the JSON

    // Check if the input is a string, if so, parse it to an XML document
    if (typeof xml === 'string') {
        const parser = new DOMParser();
        xml = parser.parseFromString(xml, 'text/xml');
    }

    // If the input is not an XML document, return an empty string
    if (!(xml instanceof XMLDocument)) {
        return jsonString + '}';
    }

    // Convert XML nodes to JSON recursively
    const parseNode = (node, depth) => {
        let indent = '  '.repeat(depth); // Indentation for formatting

        // If the node is an element, process its child nodes
        if (node.nodeType === Node.ELEMENT_NODE) {
            jsonString += `\n${indent}"${node.nodeName}": {`;

            // Process attributes
            if (node.attributes.length > 0) {
                jsonString += '"_attributes": {';
                for (let i = 0; i < node.attributes.length; i++) {
                    const attribute = node.attributes[i];
                    jsonString += `"${attribute.nodeName}": "${attribute.nodeValue}"`;
                    if (i < node.attributes.length - 1 || node.childNodes.length > 0) {
                        jsonString += ', ';
                    }
                }
                jsonString += '}';
            }

            // Process child nodes
            if (node.childNodes.length > 0) {
                if (node.attributes.length > 0) {
                    jsonString += ', '; // Add comma if there are both attributes and child nodes
                }
                for (let i = 0; i < node.childNodes.length; i++) {
                    const childNode = node.childNodes[i];
                    parseNode(childNode, depth + 1); // Recursively process child nodes
                    if (i < node.childNodes.length - 1) {
                        jsonString += ', '; // Add comma if there are more child nodes
                    }
                }
            }

            jsonString += '}';
        }

        // If the node is a text node, append its value
        else if (node.nodeType === Node.TEXT_NODE) {
            const textValue = node.nodeValue.trim(); // Remove leading/trailing whitespace
            if (textValue) {
                jsonString += `"#text": "${textValue}"`; // Append text value if not empty
            }
        }
    };

    // Start parsing from the root element of the XML document
    parseNode(xml.documentElement, 1);

    jsonString += '}';
    // Remove trailing comma if exists
    jsonString = jsonString.replace(/,\s*}/g, '}').replace(/,\s*,/g, ',');

    return jsonString;
}

export function jsonToXml(json) {
    function removeUniqueId(input) {
        return input.replace(/@!_\d+/g, '');
    }

    function convertNodeToXml(node, nodeName, depth) {
        let xml = '';
        const indent = '    '.repeat(depth); // Four spaces for each indentation level
        // If the node is an object, convert it to XML attributes or elements
        if (typeof node === 'object') {
            if (Array.isArray(node)) {
                node.forEach((item, index) => {
                    xml += `${indent}<${removeUniqueId(nodeName)} id="${item._attributes.id}">\n`;
                    xml += convertNodeToXml(item, nodeName, depth + 1);
                    xml += `${indent}</${removeUniqueId(nodeName)}>\n`;
                });
            } else {
                xml += `${indent}<${removeUniqueId(nodeName)}`;
                if (node._attributes) {
                    for (const attrName in node._attributes) {
                        xml += ` ${attrName}="${node._attributes[attrName]}"`;
                    }
                }
                xml += `>\n`;
                // Recursively convert child nodes to XML
                for (const key in node) {
                    if (key === '_attributes') continue;
                    if (key === '#text') {
                        if (Array.isArray(node[key])) {
                            xml += `${node[key].map(text => `${indent}${'    '.repeat(depth + 1)}${text}`).join('\n')}\n`;
                        } else {
                            xml += `${indent}${'    '.repeat(depth + 1)}${node[key]}\n`;
                        }
                    } else {
                        xml += convertNodeToXml(node[key], key, depth + 1);
                    }
                }
                xml += `${indent}</${removeUniqueId(nodeName)}>\n`;
            }
        } else {
            // If the node is a text value, return it as XML text content
            xml += `${indent}<${removeUniqueId(nodeName)}>${node}</${removeUniqueId(nodeName)}>\n`;
        }
        return xml;
    }


    // Convert the JSON object to XML format
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;

    // Convert each property of the JSON object to XML elements
    for (const key in json) {
        if (key === '_declaration') continue; // Skip the _declaration property
        xml += convertNodeToXml(json[key], key);
    }

    return xml;
}
