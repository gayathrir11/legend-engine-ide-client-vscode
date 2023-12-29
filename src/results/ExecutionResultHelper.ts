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

import { ThemeColor, ThemeIcon, Uri, Webview, commands } from 'vscode';
import {
  SET_CONTEXT_COMMAND_ID,
  SHOW_RESULTS_COMMAND_ID,
  SHOW_RESULTS_COMMAND_TITLE,
  SHOW_EXECUTION_RESULTS,
  TEST_ERROR_COLOR,
  TEST_FAIL_COLOR,
  TEST_FAIL_ICON,
  TEST_PASS_COLOR,
  TEST_PASS_ICON,
  WARNING_ICON,
  IS_EXECUTION_HAPPENNG,
} from '../utils/Const';
import type { LanguageClientProgressResult } from './LanguageClientProgressResult';
import {
  type LegendTreeDataProvider,
  TreeChildNodeData,
  TreeRootNodeData,
  buildTreeNodeId,
} from '../utils/LegendTreeProvider';
import { LegendExecutionResultType } from './LegendExecutionResultType';
import { guaranteeNonNullable } from '../utils/AssertionUtils';
import type { LegendWebViewProvider } from '../utils/LegendWebViewProvider';
import type { PlainObject } from '../utils/SerializationUtils';
import {
  TDSLegendExecutionResult,
  type TabularDataSet,
} from './TDSLegendExecutionResult';

const link1 = 'https://unpkg.com/ag-grid-community/styles/ag-grid.css';
const link2 = 'https://unpkg.com/ag-grid-community/styles/ag-theme-alpine.css';
const link3 = 'https://unpkg.com/ag-grid-community/dist/ag-grid-community.min.noStyle.js';
const link4 = 'https://unpkg.com/ag-grid-react';

const renderTDSResultMessage = (
  tds: TabularDataSet,
  link: Uri,
  webview: Webview,
): string => {
  try {
    // const link1 = `${link}/media/link1.css`;
    // const link2 = `${link}/media/link2.css`;
    // const link3 = `${link}/media/link3.js`;
    // const link4 = `${link}/media/link4.js`;
    const htmlString = `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="${link1}">
      <link rel="stylesheet" href="${link2}">
  </head>
  <body>
      <div id="agGrid" style="height: 500px; width: 100%;" class="ag-theme-alpine"></div>
      <h2>${link1}</h2>
      <script src="${link3}"></script>
      <script src="${link4}"></script>
  
      <script>
          // Your AG-Grid setup code goes here
          var gridOptions = {
              columnDefs: [
                  { headerName: "Make", field: "make" },
                  { headerName: "Model", field: "model" },
                  { headerName: "Price", field: "price" },
              ],
              rowData: [
                  { make: "Toyota", model: "Celica", price: 35000 },
                  { make: "Ford", model: "Mondeo", price: 32000 },
                  { make: "Porsche", model: "Boxster", price: 72000 },
              ],
          };
  
          // Specify the grid container element
          var gridDiv = document.querySelector('#agGrid');
  
          // Create the AG-Grid
          new agGrid.Grid(gridDiv, gridOptions);
      </script>
  </body>
  </html>
  
  `;
    return htmlString;
  } catch (e) {
    return e instanceof Error ? e.message : 'Hello world';
  }
};

const renderResultMessage = (
  mssg: string,
  link: Uri,
  webview: Webview,
): string => {
  try {
    const json = JSON.parse(mssg) as PlainObject<TDSLegendExecutionResult>;
    const result = TDSLegendExecutionResult.serialization.fromJson(json);
    return renderTDSResultMessage(result.result, link, webview);
  } catch (e) {
    return e instanceof Error ? e.message : 'Hello world2';
  }
  // const htmlString = `<html><body><div style="white-space: pre-wrap">${mssg}</div></body></html>`;
  // return htmlString;
};

const showResults = (): void => {
  commands.executeCommand(SET_CONTEXT_COMMAND_ID, SHOW_EXECUTION_RESULTS, true);
};

const showExecutionProgress = (val: boolean): void => {
  commands.executeCommand(SET_CONTEXT_COMMAND_ID, IS_EXECUTION_HAPPENNG, val);
};

const getResultIcon = (resultType: LegendExecutionResultType): string => {
  switch (resultType) {
    case LegendExecutionResultType.SUCCESS:
      return TEST_PASS_ICON;
    case LegendExecutionResultType.ERROR:
      return TEST_FAIL_ICON;
    case LegendExecutionResultType.FAILURE:
      return TEST_FAIL_ICON;
    case LegendExecutionResultType.WARNING:
      return WARNING_ICON;
    default:
      return '';
  }
};

const getResultIconColor = (resultType: LegendExecutionResultType): string => {
  switch (resultType) {
    case LegendExecutionResultType.SUCCESS:
      return TEST_PASS_COLOR;
    case LegendExecutionResultType.ERROR:
      return TEST_ERROR_COLOR;
    case LegendExecutionResultType.FAILURE:
      return TEST_FAIL_COLOR;
    case LegendExecutionResultType.WARNING:
      return TEST_ERROR_COLOR;
    default:
      return '';
  }
};

export const resetExecutionTab = (
  resultsTreeDataProvider: LegendTreeDataProvider,
  resultsViewprovider: LegendWebViewProvider,
): void => {
  showResults();
  resultsTreeDataProvider.resetTreeData();
  resultsTreeDataProvider.refresh();
  showExecutionProgress(true);
  resultsViewprovider.updateView('');
};

export const renderTestResults = (
  result: LanguageClientProgressResult,
  resultsTreeDataProvider: LegendTreeDataProvider,
  uri: Uri,
  webview: Webview,
): void => {
  showExecutionProgress(false);
  resultsTreeDataProvider.resetTreeData();
  result.value.forEach((r) => {
    const icon = getResultIcon(r.type);
    const color = getResultIconColor(r.type);
    const themeIcon = new ThemeIcon(icon, new ThemeColor(color));
    const viewResultCommand = {
      title: SHOW_RESULTS_COMMAND_TITLE,
      command: SHOW_RESULTS_COMMAND_ID,
      arguments: [renderResultMessage(r.message, uri, webview)],
    };
    if (r.ids.length === 2) {
      const testId = guaranteeNonNullable(r.ids[1]);
      resultsTreeDataProvider.addRootNode(
        new TreeRootNodeData(testId, testId, themeIcon, viewResultCommand),
      );
    } else if (r.ids.length > 2) {
      const testSuiteId = guaranteeNonNullable(r.ids[1]);
      const testId = guaranteeNonNullable(r.ids[2]);
      const assertionId = r.ids[3];
      const rootNode = new TreeRootNodeData(
        testSuiteId,
        testSuiteId,
        themeIcon,
      );
      resultsTreeDataProvider.addRootNode(rootNode);
      const testIdNode = new TreeChildNodeData(
        guaranteeNonNullable(rootNode.id),
        buildTreeNodeId([testSuiteId, testId]),
        testId,
        themeIcon,
      );
      resultsTreeDataProvider.addChildNode(
        guaranteeNonNullable(rootNode.id),
        testIdNode,
      );
      if (r.type !== LegendExecutionResultType.SUCCESS) {
        // Update testSuite and test node icons when we encounter failures
        resultsTreeDataProvider.updateNodeIcon(
          guaranteeNonNullable(rootNode.id),
          themeIcon,
        );
        resultsTreeDataProvider.updateNodeIcon(
          guaranteeNonNullable(testIdNode.id),
          themeIcon,
        );
      }
      if (assertionId) {
        const assertionNode = new TreeChildNodeData(
          guaranteeNonNullable(rootNode.id),
          buildTreeNodeId([testSuiteId, testId, assertionId]),
          assertionId,
          themeIcon,
          viewResultCommand,
        );
        resultsTreeDataProvider.addChildNode(
          guaranteeNonNullable(testIdNode.id),
          assertionNode,
        );
      }
    } else {
      const entityPath = guaranteeNonNullable(r.ids[0]);
      resultsTreeDataProvider.addRootNode(
        new TreeRootNodeData(
          entityPath,
          entityPath,
          themeIcon,
          viewResultCommand,
        ),
      );
    }
  });
  // Refresh the tree view to reflect the changes
  resultsTreeDataProvider.refresh();
};
