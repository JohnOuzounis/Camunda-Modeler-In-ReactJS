export function xmlToJson(xmlString) {
    let parser = new DOMParser();
    let xmlDoc = parser.parseFromString(xmlString, "text/xml");
    const filterEmptyTextNodes = (node) => {
        const childNodes = node.childNodes;
        for (let i = childNodes.length - 1; i >= 0; i--) {
            const childNode = childNodes[i];
            if (childNode.nodeType === 3 && !childNode.nodeValue.trim()) {
                node.removeChild(childNode);
            } else if (childNode.nodeType === 1) {
                filterEmptyTextNodes(childNode);
            }
        }
    }
    filterEmptyTextNodes(xmlDoc);

    function parseNode(xml) {
        let obj = {};

        if (xml.nodeType === 1) { // element
            if (xml.attributes.length > 0) {
                obj["@attributes"] = {};
                for (let j = 0; j < xml.attributes.length; j++) {
                    let attribute = xml.attributes.item(j);
                    obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
                }
            }
        } else if (xml.nodeType === 3) { // text
            obj = xml.nodeValue;
        }

        if (xml.hasChildNodes()) {
            for (let i = 0; i < xml.childNodes.length; i++) {
                let item = xml.childNodes.item(i);
                let nodeName = item.nodeName;
                if (typeof (obj[nodeName]) === "undefined") {
                    obj[nodeName] = parseNode(item);
                } else {
                    if (typeof (obj[nodeName].push) === "undefined") {
                        let old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(parseNode(item));
                }
            }
        }

        return obj;
    }

    let jsonResult = parseNode(xmlDoc.documentElement);
    return { "bpmn:definitions": jsonResult };
}

export function jsonToXml(json, forModeler) {
    function convertNodeToXml(node, nodeName, depth) {
        let xml = '';
        const indent = '    '.repeat(depth);

        if (Array.isArray(node)) {
            node.forEach(item => {
                xml += convertNodeToXml(item, nodeName, depth);
            });
        } else if (typeof node === 'object') {
            xml += `${indent}<${nodeName}`;

            if (node["@attributes"]) {
                for (const attrName in node["@attributes"]) {
                    if (!(!forModeler && nodeName.includes("sequenceFlow") && attrName.includes("condition")))
                        xml += ` ${attrName}="${node["@attributes"][attrName]}"`;
                }
            }
            xml += '>\n';

            if (!forModeler && nodeName.includes("sequenceFlow")) {
                const cond = node["@attributes"]["conditions:condition"];
                const variable = node["@attributes"]["conditions:variable"];
                const value = node["@attributes"]["conditions:value"];

                if (cond) {
                    let condition = "<bpmn:conditionExpression>\${environment.services." + cond;
                    condition += "(environment.variables." + variable + "," + value + ")}</bpmn:conditionExpression>";
                    xml += condition + "\n"
                }
            }

            for (const key in node) {
                if (key === '@attributes') continue;
                if (key === '#text') {
                    if (nodeName === 'bpmn:text')
                        xml += `${node[key]}`;
                    else
                        xml += `${'    '.repeat(depth + 1)}${node[key]}\n`;
                } else {
                    xml += convertNodeToXml(node[key], key, depth + 1);
                }
            }
            xml += `${indent}</${nodeName}>\n`;
        } else {
            xml += `${indent}<${nodeName}>${node}</${nodeName}>\n`;
        }

        return xml;
    }

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;

    for (const key in json) {
        xml += convertNodeToXml(json[key], key, 1);
    }

    return xml;
}
