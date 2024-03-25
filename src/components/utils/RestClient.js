import axios from 'axios'

export class RestClient {
    constructor(host = 'localhost', port = '8080', endpoint = 'api') {
        this.host = host;
        this.port = port;
        this.endpoint = endpoint;
    }

    async executeDiagram(name, variables, diagram) {
        try {
            const res = await axios.post(`http://${this.host}:${this.port}/${this.endpoint}/execute`, {
                name: name,
                source: diagram,
                variables: variables
            });
            return res;
        } catch (error) {
            throw Error(error.response.data.message);
        }
    }
}