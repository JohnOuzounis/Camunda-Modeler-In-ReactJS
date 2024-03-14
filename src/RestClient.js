export class RestClient {
    constructor(host = 'localhost', port = '8080', endpoint = 'engine-rest') {
        this.host = host;
        this.port = port;
        this.endpoint = endpoint;
    }

    async createDeployment(name, tenantID, data) {
        const form = new FormData();
        form.append('tenant-id', ((!tenantID.trim()) ? '' : tenantID));
        form.append('deployment-source', '');
        form.append('deploy-changed-only', 'false');
        form.append('enable-duplicate-filtering', 'false');
        form.append('deployment-name', name);
        form.append('deployment-activation-time', '');
        form.append('data', new File([data], (name + '.bpmn')));

        const response = await fetch(`http://${this.host}:${this.port}/${this.endpoint}/deployment/create`, {
            method: 'POST',
            headers: {
                'accept': 'application/json'
            },
            body: form
        })
            .then(async response => {
                if (!response.ok) {
                    try {
                        const errorData = await response.json();
                        throw new Error(JSON.stringify(errorData));
                    } catch (error) {
                        throw new Error(error);
                    }
                }
                return response.json();
            })
            .then(data => {
                console.log('Deployment successful:', data);
            })
            .catch(error => {
                throw error;
            });

        return response;
    }
}