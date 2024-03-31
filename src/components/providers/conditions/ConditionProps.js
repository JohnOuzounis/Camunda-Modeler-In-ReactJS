import { html } from 'htm/preact';

import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

export default function ConditionPropsModule(element) {

    return [
        {
            id: 'condition',
            element,
            component: Condition,
            isEdited: isTextFieldEntryEdited
        }
    ];
}

function Condition(props) {
    const { element, id } = props;

    const modeling = useService('modeling');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const getValue = () => {
        return element.businessObject.condition || '';
    };

    const setValue = value => {
        return modeling.updateProperties(element, {
            condition: value
        });
    };

    return html`<${TextFieldEntry}
    id=${id}
    element=${element}
    description=${translate('Add condition')}
    label=${translate('Condition Expression')}
    tooltip=${translate('Example: myVariable === someValue')}
    getValue=${getValue}
    setValue=${setValue}
    debounce=${debounce}
  />`;
}
