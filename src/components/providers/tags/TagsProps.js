import { html } from 'htm/preact';

import { TextFieldEntry, isTextFieldEntryEdited } from '@bpmn-io/properties-panel';
import { useService } from 'bpmn-js-properties-panel';

export default function TagsPropsModule(element) {

    return [
        {
            id: 'actionTag',
            element,
            component: ActionTag,
            isEdited: isTextFieldEntryEdited
        },
        {
            id: 'eventTag',
            element,
            component: EventTag,
            isEdited: isTextFieldEntryEdited
        }
    ];
}

function ActionTag(props) {
    const { element, id } = props;

    const modeling = useService('modeling');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const getValue = () => {
        return element.businessObject.actionTag || '';
    };

    const setValue = value => {
        return modeling.updateProperties(element, {
            actionTag: value
        });
    };

    return html`<${TextFieldEntry}
    id=${id}
    element=${element}
    description=${translate('Add action tag to execute')}
    label=${translate('Action Tag')}
    getValue=${getValue}
    setValue=${setValue}
    debounce=${debounce}
  />`;
}

function EventTag(props) {
    const { element, id } = props;

    const modeling = useService('modeling');
    const translate = useService('translate');
    const debounce = useService('debounceInput');

    const getValue = () => {
        return element.businessObject.eventTag || '';
    };

    const setValue = value => {
        return modeling.updateProperties(element, {
            eventTag: value
        });
    };

    return html`<${TextFieldEntry}
    id=${id}
    element=${element}
    description=${translate('Add event tag to post')}
    label=${translate('Event Tag')}
    getValue=${getValue}
    setValue=${setValue}
    debounce=${debounce}
  />`;
}
