'use strict';

var inherits = require('inherits');

var PropertiesActivator = require('bpmn-js-properties-panel/lib/PropertiesActivator');

var asyncCapableHelper = require('bpmn-js-properties-panel/lib/helper/AsyncCapableHelper'),
    ImplementationTypeHelper = require('bpmn-js-properties-panel/lib/helper/ImplementationTypeHelper');

var is = require('bpmn-js/lib/util/ModelUtil').is;

// bpmn properties
var processProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/ProcessProps'),
    eventProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/EventProps'),
    linkProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/LinkProps'),
    documentationProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/DocumentationProps'),
    idProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/IdProps'),
    nameProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/NameProps'),
    executableProps = require('bpmn-js-properties-panel/lib/provider/bpmn/parts/ExecutableProps');

// activiti properties
var serviceTaskDelegateProps = require('./activiti/parts/ServiceTaskDelegateProps'),
    userTaskProps = require('./activiti/parts/UserTaskProps'),
    asynchronousContinuationProps = require('./activiti/parts/AsynchronousContinuationProps'),
    callActivityProps = require('./activiti/parts/CallActivityProps'),
    multiInstanceProps = require('./activiti/parts/MultiInstanceLoopProps'),
    conditionalProps = require('./activiti/parts/ConditionalProps'),
    scriptProps = require('./activiti/parts/ScriptTaskProps'),
    errorProps = require('./activiti/parts/ErrorEventProps'),
    formProps = require('./activiti/parts/FormProps'),
    startEventInitiator = require('./activiti/parts/StartEventInitiator'),
    variableMapping = require('./activiti/parts/VariableMappingProps'),
    versionTag = require('./activiti/parts/VersionTagProps');

var listenerProps = require('./activiti/parts/ListenerProps'),
    listenerDetails = require('./activiti/parts/ListenerDetailProps'),
    listenerFields = require('./activiti/parts/ListenerFieldInjectionProps');

var elementTemplateChooserProps = require('./activiti/element-templates/parts/ChooserProps'),
    elementTemplateCustomProps = require('./activiti/element-templates/parts/CustomProps');

// Input/Output
var inputOutput = require('./activiti/parts/InputOutputProps'),
    inputOutputParameter = require('./activiti/parts/InputOutputParameterProps');

// Connector
var connectorDetails = require('./activiti/parts/ConnectorDetailProps'),
    connectorInputOutput = require('./activiti/parts/ConnectorInputOutputProps'),
    connectorInputOutputParameter = require('./activiti/parts/ConnectorInputOutputParameterProps');

// properties
var properties = require('./activiti/parts/PropertiesProps');

// job configuration
var jobConfiguration = require('./activiti/parts/JobConfigurationProps');

// history time to live
var historyTimeToLive = require('./activiti/parts/HistoryTimeToLiveProps');

// candidate starter groups/users
var candidateStarter = require('./activiti/parts/CandidateStarterProps');

// tasklist
var tasklist = require('./activiti/parts/TasklistProps');

// external task configuration
var externalTaskConfiguration = require('./activiti/parts/ExternalTaskConfigurationProps');

// field injection
var fieldInjections = require('./activiti/parts/FieldInjectionProps');

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    eventDefinitionHelper = require('bpmn-js-properties-panel/lib/helper/EventDefinitionHelper'),
    implementationTypeHelper = require('bpmn-js-properties-panel/lib/helper/ImplementationTypeHelper');

// helpers ////////////////////////////////////////

var isExternalTaskPriorityEnabled = function(element) {
  var businessObject = getBusinessObject(element);

  // show only if element is a process, a participant ...
  if (is(element, 'bpmn:Process') || is(element, 'bpmn:Participant') && businessObject.get('processRef')) {
    return true;
  }

  var externalBo = ImplementationTypeHelper.getServiceTaskLikeBusinessObject(element),
      isExternalTask = ImplementationTypeHelper.getImplementationType(externalBo) === 'external';

  // ... or an external task with selected external implementation type
  return !!ImplementationTypeHelper.isExternalCapable(externalBo) && isExternalTask;
};

var isJobConfigEnabled = function(element) {
  var businessObject = getBusinessObject(element);

  if (is(element, 'bpmn:Process') || is(element, 'bpmn:Participant') && businessObject.get('processRef')) {
    return true;
  }

  // async behavior
  var bo = getBusinessObject(element);
  if (asyncCapableHelper.isAsyncBefore(bo) || asyncCapableHelper.isAsyncAfter(bo)) {
    return true;
  }

  // timer definition
  if (is(element, 'bpmn:Event')) {
    return !!eventDefinitionHelper.getTimerEventDefinition(element);
  }

  return false;
};

var getInputOutputParameterLabel = function(param, translate) {

  if (is(param, 'camunda:InputParameter')) {
    return translate('Input Parameter');
  }

  if (is(param, 'camunda:OutputParameter')) {
    return translate('Output Parameter');
  }

  return '';
};

var getListenerLabel = function(param, translate) {

  if (is(param, 'camunda:ExecutionListener')) {
    return translate('Execution Listener');
  }

  if (is(param, 'camunda:TaskListener')) {
    return translate('Task Listener');
  }

  return '';
};

var PROCESS_KEY_HINT = 'This maps to the process definition key.';
var TASK_KEY_HINT = 'This maps to the task definition key.';

function createGeneralTabGroups(element, canvas, bpmnFactory,elementRegistry, elementTemplates, translate) {
  // refer to target element for external labels
  element = element.labelTarget || element;

  var generalGroup = {
    id: 'general',
    label: translate('General'),
    entries: []
  };

  var idOptions;
  var processOptions;

  if (is(element, 'bpmn:Process')) {
    idOptions = { description: PROCESS_KEY_HINT };
  }

  if (is(element, 'bpmn:UserTask')) {
    idOptions = { description: TASK_KEY_HINT };
  }

  if (is(element, 'bpmn:Participant')) {
    processOptions = { processIdDescription: PROCESS_KEY_HINT };
  }

  idProps(generalGroup, element, translate, idOptions);
  nameProps(generalGroup, element, bpmnFactory, canvas, translate);
  processProps(generalGroup, element, translate, processOptions);
  versionTag(generalGroup, element, translate);
  executableProps(generalGroup, element, translate);
  elementTemplateChooserProps(generalGroup, element, elementTemplates, translate);

  var customFieldsGroups = elementTemplateCustomProps(element, elementTemplates, bpmnFactory, translate);

  var detailsGroup = {
    id: 'details',
    label: translate('Details'),
    entries: []
  };
  serviceTaskDelegateProps(detailsGroup, element, bpmnFactory, translate);
  userTaskProps(detailsGroup, element, translate);
  scriptProps(detailsGroup, element, bpmnFactory, translate);
  linkProps(detailsGroup, element, translate);
  callActivityProps(detailsGroup, element, bpmnFactory, translate);
  eventProps(detailsGroup, element, bpmnFactory, elementRegistry, translate);
  errorProps(detailsGroup, element, bpmnFactory, translate);
  conditionalProps(detailsGroup, element, bpmnFactory, translate);
  startEventInitiator(detailsGroup, element, translate); // this must be the last element of the details group!

  var multiInstanceGroup = {
    id: 'multiInstance',
    label: translate('Multi Instance'),
    entries: []
  };
  multiInstanceProps(multiInstanceGroup, element, bpmnFactory, translate);

  var asyncGroup = {
    id : 'async',
    label: translate('Asynchronous Continuations'),
    entries : []
  };
  asynchronousContinuationProps(asyncGroup, element, bpmnFactory, translate);

  var jobConfigurationGroup = {
    id : 'jobConfiguration',
    label : translate('Job Configuration'),
    entries : [],
    enabled: isJobConfigEnabled
  };
  jobConfiguration(jobConfigurationGroup, element, bpmnFactory, translate);

  var externalTaskGroup = {
    id : 'externalTaskConfiguration',
    label : translate('External Task Configuration'),
    entries : [],
    enabled: isExternalTaskPriorityEnabled
  };
  externalTaskConfiguration(externalTaskGroup, element, bpmnFactory, translate);


  var candidateStarterGroup = {
    id: 'candidateStarterConfiguration',
    label: translate('Candidate Starter Configuration'),
    entries: []
  };
  candidateStarter(candidateStarterGroup, element, bpmnFactory, translate);

  var historyTimeToLiveGroup = {
    id: 'historyConfiguration',
    label: translate('History Configuration'),
    entries: []
  };
  historyTimeToLive(historyTimeToLiveGroup, element, bpmnFactory, translate);

  var tasklistGroup = {
    id: 'tasklist',
    label: translate('Tasklist Configuration'),
    entries: []
  };
  tasklist(tasklistGroup, element, bpmnFactory, translate);

  var documentationGroup = {
    id: 'documentation',
    label: translate('Documentation'),
    entries: []
  };
  documentationProps(documentationGroup, element, bpmnFactory, translate);

  var groups = [];
  groups.push(generalGroup);
  customFieldsGroups.forEach(function(group) {
    groups.push(group);
  });
  groups.push(detailsGroup);
  groups.push(externalTaskGroup);
  groups.push(multiInstanceGroup);
  groups.push(asyncGroup);
  groups.push(jobConfigurationGroup);
  groups.push(candidateStarterGroup);
  groups.push(historyTimeToLiveGroup);
  groups.push(tasklistGroup);
  groups.push(documentationGroup);

  return groups;
}

function createVariablesTabGroups(element, bpmnFactory, elementRegistry, translate) {
  var variablesGroup = {
    id : 'variables',
    label : translate('Variables'),
    entries: []
  };
  variableMapping(variablesGroup, element, bpmnFactory, translate);

  return [
    variablesGroup
  ];
}

function createFormsTabGroups(element, bpmnFactory, elementRegistry, translate) {
  var formGroup = {
    id : 'forms',
    label : translate('Forms'),
    entries: []
  };
  formProps(formGroup, element, bpmnFactory, translate);

  return [
    formGroup
  ];
}

function createListenersTabGroups(element, bpmnFactory, elementRegistry, translate) {

  var listenersGroup = {
    id : 'listeners',
    label: translate('Listeners'),
    entries: []
  };

  var options = listenerProps(listenersGroup, element, bpmnFactory, translate);

  var listenerDetailsGroup = {
    id: 'listener-details',
    entries: [],
    enabled: function(element, node) {
      return options.getSelectedListener(element, node);
    },
    label: function(element, node) {
      var param = options.getSelectedListener(element, node);
      return getListenerLabel(param, translate);
    }
  };

  listenerDetails(listenerDetailsGroup, element, bpmnFactory, options, translate);

  var listenerFieldsGroup = {
    id: 'listener-fields',
    label: translate('Field Injection'),
    entries: [],
    enabled: function(element, node) {
      return options.getSelectedListener(element, node);
    }
  };

  listenerFields(listenerFieldsGroup, element, bpmnFactory, options, translate);

  return [
    listenersGroup,
    listenerDetailsGroup,
    listenerFieldsGroup
  ];
}

function createInputOutputTabGroups(element, bpmnFactory, elementRegistry, translate) {

  var inputOutputGroup = {
    id: 'input-output',
    label: translate('Parameters'),
    entries: []
  };

  var options = inputOutput(inputOutputGroup, element, bpmnFactory, translate);

  var inputOutputParameterGroup = {
    id: 'input-output-parameter',
    entries: [],
    enabled: function(element, node) {
      return options.getSelectedParameter(element, node);
    },
    label: function(element, node) {
      var param = options.getSelectedParameter(element, node);
      return getInputOutputParameterLabel(param, translate);
    }
  };

  inputOutputParameter(inputOutputParameterGroup, element, bpmnFactory, options, translate);

  return [
    inputOutputGroup,
    inputOutputParameterGroup
  ];
}

function createConnectorTabGroups(element, bpmnFactory, elementRegistry, translate) {
  var connectorDetailsGroup = {
    id: 'connector-details',
    label: translate('Details'),
    entries: []
  };

  connectorDetails(connectorDetailsGroup, element, bpmnFactory, translate);

  var connectorInputOutputGroup = {
    id: 'connector-input-output',
    label: translate('Input/Output'),
    entries: []
  };

  var options = connectorInputOutput(connectorInputOutputGroup, element, bpmnFactory, translate);

  var connectorInputOutputParameterGroup = {
    id: 'connector-input-output-parameter',
    entries: [],
    enabled: function(element, node) {
      return options.getSelectedParameter(element, node);
    },
    label: function(element, node) {
      var param = options.getSelectedParameter(element, node);
      return getInputOutputParameterLabel(param, translate);
    }
  };

  connectorInputOutputParameter(connectorInputOutputParameterGroup, element, bpmnFactory, options, translate);

  return [
    connectorDetailsGroup,
    connectorInputOutputGroup,
    connectorInputOutputParameterGroup
  ];
}

function createFieldInjectionsTabGroups(element, bpmnFactory, elementRegistry, translate) {

  var fieldGroup = {
    id: 'field-injections-properties',
    label: translate('Field Injections'),
    entries: []
  };

  fieldInjections(fieldGroup, element, bpmnFactory, translate);

  return [
    fieldGroup
  ];
}

function createExtensionElementsGroups(element, bpmnFactory, elementRegistry, translate) {

  var propertiesGroup = {
    id : 'extensionElements-properties',
    label: translate('Properties'),
    entries: []
  };
  properties(propertiesGroup, element, bpmnFactory, translate);

  return [
    propertiesGroup
  ];
}

// Actitviti Properties Provider /////////////////////////////////////


/**
 * A properties provider for Actitviti related properties.
 *
 * @param {EventBus} eventBus
 * @param {Canvas} canvas
 * @param {BpmnFactory} bpmnFactory
 * @param {ElementRegistry} elementRegistry
 * @param {ElementTemplates} elementTemplates
 * @param {Translate} translate
 */
function ActitvitiPropertiesProvider(eventBus, canvas, bpmnFactory,elementRegistry, elementTemplates, translate) {

  PropertiesActivator.call(this, eventBus);

  this.getTabs = function(element) {

    var generalTab = {
      id: 'general',
      label: translate('General'),
      groups: createGeneralTabGroups(
        element, canvas, bpmnFactory,
        elementRegistry, elementTemplates, translate)
    };

    var variablesTab = {
      id: 'variables',
      label: translate('Variables'),
      groups: createVariablesTabGroups(element, bpmnFactory, elementRegistry, translate)
    };

    var formsTab = {
      id: 'forms',
      label: translate('Forms'),
      groups: createFormsTabGroups(element, bpmnFactory, elementRegistry, translate)
    };

    var listenersTab = {
      id: 'listeners',
      label: translate('Listeners'),
      groups: createListenersTabGroups(element, bpmnFactory, elementRegistry, translate),
      enabled: function(element) {
        return !eventDefinitionHelper.getLinkEventDefinition(element)
          || (!is(element, 'bpmn:IntermediateThrowEvent')
          && eventDefinitionHelper.getLinkEventDefinition(element));
      }
    };

    var inputOutputTab = {
      id: 'input-output',
      label: translate('Input/Output'),
      groups: createInputOutputTabGroups(element, bpmnFactory, elementRegistry, translate)
    };

    var connectorTab = {
      id: 'connector',
      label: translate('Connector'),
      groups: createConnectorTabGroups(element, bpmnFactory, elementRegistry, translate),
      enabled: function(element) {
        var bo = implementationTypeHelper.getServiceTaskLikeBusinessObject(element);
        return bo && implementationTypeHelper.getImplementationType(bo) === 'connector';
      }
    };

    var fieldInjectionsTab = {
      id: 'field-injections',
      label: translate('Field Injections'),
      groups: createFieldInjectionsTabGroups(element, bpmnFactory, elementRegistry, translate)
    };

    var extensionsTab = {
      id: 'extensionElements',
      label: translate('Extensions'),
      groups: createExtensionElementsGroups(element, bpmnFactory, elementRegistry, translate)
    };

    return [
      generalTab,
      variablesTab,
      connectorTab,
      formsTab,
      listenersTab,
      inputOutputTab,
      fieldInjectionsTab,
      extensionsTab
    ];
  };

}

ActitvitiPropertiesProvider.$inject = [
  'eventBus',
  'canvas',
  'bpmnFactory',
  'elementRegistry',
  'elementTemplates',
  'translate'
];

inherits(ActitvitiPropertiesProvider, PropertiesActivator);

module.exports = ActitvitiPropertiesProvider;