/**
 * WorkflowBuilder module exports
 * 
 * This file centralizes exports from the WorkflowBuilder module
 * to simplify imports for consumers.
 */

// Main component
import WorkflowBuilder from './WorkflowBuilder';

// Provider and context
import { 
  WorkflowBuilderProvider, 
  useWorkflowBuilderContext 
} from './WorkflowBuilderProvider';

// Core components
import StartPoint from './WorkflowElements/StartPoint';
import EndPoint from './WorkflowElements/EndPoint';
import ConditionBlock from './WorkflowElements/ConditionBlock';
import AddButton from './WorkflowElements/AddButton';
import ConditionRow from './Dialogs/ConditionRow';

// Dialog components
import ConditionEditor from './Dialogs/ConditionEditor';
import ApproverSelector from './Dialogs/ApproverSelector';
import FieldSelector from './Dialogs/FieldSelector';
import DeleteConfirmation from './Dialogs/DeleteConfirmation';

// Hooks
import useConditionState from './hooks/useConditionState';
import useApproverState from './hooks/useApproverState';
import useFieldSelection from './hooks/useFieldSelection';

// Utilities
import conditionHelpers from './utils/conditionHelpers';
import approverHelpers from './utils/approverHelpers';
import formattingUtils from './utils/formattingUtils';

// Main export
export default WorkflowBuilder;

// Named exports for advanced usage
export {
  // Context and provider
  WorkflowBuilderProvider,
  useWorkflowBuilderContext,
  
  // Core components
  StartPoint,
  EndPoint,
  ConditionBlock,
  AddButton,
  ConditionRow,
  
  // Dialog components
  ConditionEditor,
  ApproverSelector,
  FieldSelector,
  DeleteConfirmation,
  
  // Hooks
  useConditionState,
  useApproverState,
  useFieldSelection,
  
  // Utilities
  conditionHelpers,
  approverHelpers,
  formattingUtils
};