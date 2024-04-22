import { html } from 'htm/preact';

import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

export default function ConditionPropsModule(element) {

    return [
        {
            id: 'variable',
            element,
            component: Variable,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: 'condition',
            element,
            component: Condition,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: 'value',
            element,
            component: Value,
            isEdited: isTextFieldEntryEdited
        }
    ];
}

function Variable(props) {
    const { element, id } = props;

    const modeling = useService('modeling');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const getValue = () => {
        return element.businessObject.variable || '';
    };

    const setValue = value => {
        return modeling.updateProperties(element, {
            variable: value
        });
    };

    return html`<${TextFieldEntry}
    id=${id}
    element=${element}
    description=${translate('Add variable name')}
    label=${translate('Variable')}
    getValue=${getValue}
    setValue=${setValue}
    debounce=${debounce}
  />`;
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
    tooltip=${translate('one of the following: isEqual, isNotEqual, isGreater, isLess, isGreaterEqual, isLessEqual)')}
    getValue=${getValue}
    setValue=${setValue}
    debounce=${debounce}
  />`;
}

function Value(props) {
    const { element, id } = props;

    const modeling = useService('modeling');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const getValue = () => {
        return element.businessObject.value || '';
    };

    const setValue = value => {
        return modeling.updateProperties(element, {
            value: value
        });
    };

    return html`<${TextFieldEntry}
    id=${id}
    element=${element}
    description=${translate('Add value')}
    label=${translate('Value')}
    getValue=${getValue}
    setValue=${setValue}
    debounce=${debounce}
  />`;
}
