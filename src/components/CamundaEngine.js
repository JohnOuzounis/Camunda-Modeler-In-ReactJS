import Bpmn from 'bpmn-engine'

export class Engine {
    constructor(bpmnXml, camundaModdle) {
        this.engine = new Bpmn.Engine({
            source: bpmnXml,
            moddleOptions: {
                camunda: camundaModdle
            }
        });
    }

    getEngine() {
        return this.engine;
    }
}