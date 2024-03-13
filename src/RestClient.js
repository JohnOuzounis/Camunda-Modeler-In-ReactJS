export class RestClient {
    constructor(host = 'localhost', port = '8080', endpoint = 'engine-rest') {
        this.host = host;
        this.port = port;
        this.endpoint = endpoint;
    }

    createDeployment(name, tenantID, data) {
        const binaryData = new TextEncoder().encode(data);
        const base64String = btoa(String.fromCharCode.apply(null, binaryData));

        let body = {}
        body['tenant-ID'] = tenantID;
        body['deployment-name'] = name;
        body['data'] = base64String;

        fetch(`http://${this.host}:${this.port}/${this.endpoint}/deployment/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Deployment successful:', data);
            })
            .catch(error => {
                console.error('Error during deployment:', error);
            });
    }
}