import ConditionProps from './ConditionProps';
import { is } from 'bpmn-js/lib/util/ModelUtil';


const LOW_PRIORITY = 500;

export default function ConditionPropertiesProvider(propertiesPanel, translate) {

    this.getGroups = function (element) {
        return function (groups) {
            if (is(element, 'bpmn:SequenceFlow')) {
                groups.push(createConditionGroup(element, translate));
            }
            return groups;
        };
    };

    propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

ConditionPropertiesProvider.$inject = ['propertiesPanel', 'translate'];

function createConditionGroup(element, translate) {

    const conditionGroup = {
        id: 'condition',
        label: translate('Condition'),
        entries: ConditionProps(element)
    };

    return conditionGroup;
}
