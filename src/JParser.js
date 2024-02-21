export class JParser {
    constructor(jsonString) {
        this.jsonString = jsonString;
        this.index = 0;
        this.nfirstchars = '-0123456789.';
        this.nchars = '-0123456789.eE';
        this.duplicateKeys = new Map();
    }

    parse() {
        return this.parseValue();
    }

    isWhiteSpace(c) {
        return c === ' ' || c === '\r' || c === '\n' || c === '\t';
    }

    skipWhiteSpace() {
        while (this.index < this.jsonString.length && this.isWhiteSpace(this.jsonString.charAt(this.index))) {
            this.index++;
        }
    }

    parseValue() {
        this.skipWhiteSpace();
        if (this.index === this.jsonString.length) return null;
        const c = this.jsonString.charAt(this.index);
        if (c === '{') return this.parseObject();
        else if (c === '[') return this.parseArray();
        else if (c === '"') return this.parseString('"');
        else if (c === "'") return this.parseString("'");
        else if (this.nfirstchars.indexOf(c) !== -1) return this.parseNumber();
        else if (c === 't') return this.parseLiteral('true', true);
        else if (c === 'f') return this.parseLiteral('false', false);
        else if (c === 'n') return this.parseLiteral('null', null);
        throw new Error('Invalid json');
    }

    parseLiteral(literal, value) {
        if (literal.length > this.jsonString.length - this.index) {
            throw new Error('Expecting ' + literal);
        }
        for (let i = 0; i < literal.length; i++) {
            if (literal.charAt(i) !== this.jsonString.charAt(this.index++)) {
                throw new Error('Expecting ' + literal);
            }
        }
        return value;
    }

    parseNumber() {
        const startIndex = this.index;
        while (this.nchars.indexOf(this.jsonString.charAt(this.index)) !== -1) {
            this.index++;
        }
        return parseFloat(this.jsonString.substring(startIndex, this.index));
    }

    parseString(quote) {
        ++this.index;
        let c;
        let s = '';
        while ((c = this.jsonString.charAt(this.index)) !== quote) {
            if (c === '\\') {
                this.index++;
                c = this.jsonString.charAt(this.index);
                if (c === 'r') s += '\r';
                else if (c === 'n') s += '\n';
                else if (c === 't') s += '\t';
                else if (c === 'f') s += '\f';
                // Note escaped unicode not handled
                else s += c;
            } else s += c;
            this.index++;
        }
        this.index++;
        return s;
    }

    parseObject() {
        this.index++;
        this.skipWhiteSpace();
        if (this.jsonString.charAt(this.index) === '}') {
            this.index++;
            return {};
        }
        const obj = {};
        let c;
        while (true) {
            let name = this.parseValue();
            this.skipWhiteSpace();
            c = this.jsonString.charAt(this.index);
            if (c !== ':') throw new Error('Expecting :');
            this.index++;
            this.skipWhiteSpace();
            const value = this.parseValue();
            this.skipWhiteSpace();
            if (obj[name] !== undefined) {
                // If the key is a duplicate, add a unique identifier
                if (!this.duplicateKeys.has(name)) {
                    this.duplicateKeys.set(name, 0);
                }
                const count = this.duplicateKeys.get(name);
                this.duplicateKeys.set(name, count + 1);
                name += `@!_${count}`;
            }
            obj[name] = value;
            c = this.jsonString.charAt(this.index);
            if (c === ',') {
                this.index++;
                this.skipWhiteSpace();
            } else break;
        }
        if (c !== '}') {
            throw new Error('Expecting }');
        }
        this.index++;
        return obj;
    }

    parseArray() {
        this.index++;
        this.skipWhiteSpace();
        if (this.jsonString.charAt(this.index) === ']') {
            this.index++;
            return [];
        }
        const arr = [];
        let c;
        while (true) {
            arr.push(this.parseValue());
            this.skipWhiteSpace();
            c = this.jsonString.charAt(this.index);
            if (c === ',') {
                this.index++;
                this.skipWhiteSpace();
            } else break;
        }
        if (c !== ']') {
            throw new Error('Expecting ]');
        }
        this.index++;
        return arr;
    }
}

export function removeUniqueId(input) {
    return input.replace(/@!_\d+/g, '');
}
