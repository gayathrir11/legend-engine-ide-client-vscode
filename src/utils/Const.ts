/**
 * Copyright (c) 2023-present, Goldman Sachs
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Views
export const EXECUTION_TREE_VIEW = 'executionView';
export const RESULTS_WEB_VIEW = 'resultsView';

// Vscode theme icons
export const TEST_PASS_ICON = 'check';
export const TEST_FAIL_ICON = 'error';
export const WARNING_ICON = 'warning';

// Vscode theme colors
export const TEST_PASS_COLOR = 'testing.iconPassed';
export const TEST_FAIL_COLOR = 'testing.iconFailed';
export const TEST_ERROR_COLOR = 'testing.iconErrored';

// Commands
export const SHOW_RESULTS_COMMAND_ID = 'showResults';
export const SHOW_RESULTS_COMMAND_TITLE = 'Results';
export const SET_CONTEXT_COMMAND_ID = 'setContext';
export const LEGEND_COMMAND_WITH_INPUTS_ID = 'legend.command.withInputs';
export const EXEC_FUNCTION_WITH_PARAMETERS_ID =
  'legend.pure.executeFunctionWithParameters';

// Context variables
export const SHOW_EXECUTION_RESULTS = 'showExecutionResults';
export const IS_EXECUTION_HAPPENNG = 'isExecutionHappening';

// Notification ids
export const PROGRESS_NOTIFICATION_ID = '$/progress';

// Primitive types
export enum PRIMITIVE_TYPE {
  STRING = 'String',
  BOOLEAN = 'Boolean',
  BINARY = 'Binary',
  NUMBER = 'Number', // `Number` is the supper type of all other numeric types
  INTEGER = 'Integer',
  FLOAT = 'Float',
  DECIMAL = 'Decimal',
  DATE = 'Date', // `Date` is the supper type of all other temporal types
  STRICTDATE = 'StrictDate', // just date, without time
  DATETIME = 'DateTime',
  STRICTTIME = 'StrictTime', // NOTE: not a sub-type of Date, this is used to measure length of time, not pointing at a particular moment in time like Date
  // NOTE: `LatestDate` is a special type that is used for milestoning in store so its used in the body of function and lamdba but never should be exposed to users
  // as such, if there is a day we want to have `LatestDate` in the graph but not exposed to the users
  LATESTDATE = 'LatestDate',
  BYTE = 'Byte',
}
