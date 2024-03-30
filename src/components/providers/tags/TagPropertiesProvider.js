import TagProps from './TagsProps';
import { is } from 'bpmn-js/lib/util/ModelUtil';


const LOW_PRIORITY = 500;

export default function TagPropertiesProvider(propertiesPanel, translate) {

  this.getGroups = function (element) {
    return function (groups) {
      if (!is(element, 'bpmn:Process')) {
        groups.push(createTagGroup(element, translate));
      }
      return groups;
    };
  };

  propertiesPanel.registerProvider(LOW_PRIORITY, this);
}

TagPropertiesProvider.$inject = ['propertiesPanel', 'translate'];

function createTagGroup(element, translate) {

  const tagGroup = {
    id: 'tags',
    label: translate('Tag Properties'),
    entries: TagProps(element)
  };

  return tagGroup;
}
