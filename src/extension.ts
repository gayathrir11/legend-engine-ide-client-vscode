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

import * as path from 'path';
import {
  workspace,
  type ExtensionContext,
  languages,
  window,
  commands,
  ViewColumn,
  Uri,
} from 'vscode';
import {
  LanguageClient,
  type LanguageClientOptions,
  type Executable,
  type ServerOptions,
} from 'vscode-languageclient/node';
import { LegendTreeDataProvider } from './utils/LegendTreeProvider';
import { LanguageClientProgressResult } from './results/LanguageClientProgressResult';
import type { PlainObject } from './utils/SerializationUtils';
import {
  PROGRESS_NOTIFICATION_ID,
  RESULTS_WEB_VIEW,
  SHOW_RESULTS_COMMAND_ID,
  EXECUTION_TREE_VIEW,
  EXEC_FUNCTION_WITH_PARAMETERS_ID,
  LEGEND_COMMAND_WITH_INPUTS_ID,
} from './utils/Const';
import { LegendWebViewProvider } from './utils/LegendWebViewProvider';
import {
  renderTestResults,
  resetExecutionTab,
} from './results/ExecutionResultHelper';
import { error } from 'console';
import { isPlainObject } from './utils/AssertionUtils';
import type { Variable } from './model/VariableExpression';

let client: LanguageClient;

export function createClient(context: ExtensionContext): LanguageClient {
  languages.setLanguageConfiguration('legend', {
    wordPattern:
      // eslint-disable-next-line prefer-named-capture-group
      /(-?\d*\.\d\w*)|([^`~!@#%^$&*()\-=+[{\]}\\|;:'",.<>/?\s][^`~!@#%^&*()\-=+[{\]}\\|;:'",.<>/?\s]*)/,
    comments: {
      lineComment: '//',
      blockComment: ['/*', '*/'],
    },
  });

  // const serverOptions: Executable = {
  //   command: 'java',
  //   args: [
  //     '-jar',
  //     context.asAbsolutePath(path.join('jars', 'language-server.jar')),
  //   ],
  // };

  const serverOptionsRun: Executable = {
    command: 'java',
    args: [
      '-jar',
      context.asAbsolutePath(path.join('jars', 'language-server.jar')),
    ],
  };

  const serverOptionsDebug: Executable = {
    command: 'java',
    args: [
      '-agentlib:jdwp=transport=dt_socket,server=y,quiet=y,suspend=y,address=*:11285',
      '-jar',
      context.asAbsolutePath(path.join('jars', 'language-server.jar')),
    ],
  };

  const serverOptions: ServerOptions = {
    run: serverOptionsRun,
    debug: serverOptionsDebug,
  };

  const clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: 'file', language: 'legend' }],
    synchronize: { fileEvents: workspace.createFileSystemWatcher('**/*.pure') },
  };

  client = new LanguageClient('Legend', 'Legend', serverOptions, clientOptions);
  // Initialize client
  client.start();
  return client;
}

export function registerComamnds(context: ExtensionContext): void {
  const executeFunctionWithParametersCommand = commands.registerCommand(
    LEGEND_COMMAND_WITH_INPUTS_ID,
    async (...args: unknown[]) => {
      console.log(args);
      const commandId = args[3] as string;
      if (commandId === EXEC_FUNCTION_WITH_PARAMETERS_ID) {
        const rawParams = args[5] as Map<string, Variable>;
        // const params =
        const userInput = window.createWebviewPanel(
          'Function',
          'Function inputs',
          ViewColumn.One,
          {
            enableScripts: true,
          },
        );
        const webviewScriptPath = Uri.file(
          path.join(
            context.extensionPath,
            'lib',
            'components',
            'ParametersEditorRenderer.js',
          ),
        );

        const webviewScript = userInput.webview.asWebviewUri(webviewScriptPath);

        userInput.webview.html = `<!-- webview/index.html -->
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>React Webview</title>
        </head>
        <body>
          <div id="root" data-input-parameters=${JSON.stringify(args)}></div>
          <script src=${webviewScript}></script>
        </body>
        </html>
        `;
        const myFunction = (message: string): void => {
          console.log(message);
        };
        userInput.webview.postMessage({
          command: 'setFunctionProp',
          propFunction: myFunction.toString(),
        });
      }
    },
  );
  context.subscriptions.push(executeFunctionWithParametersCommand);
}

export function registerClientViews(context: ExtensionContext): void {
  // Register views
  const resultsTreeDataProvider = new LegendTreeDataProvider();
  window.registerTreeDataProvider(EXECUTION_TREE_VIEW, resultsTreeDataProvider);

  const resultsViewprovider = new LegendWebViewProvider();
  const resultsView = window.registerWebviewViewProvider(
    RESULTS_WEB_VIEW,
    resultsViewprovider,
  );
  context.subscriptions.push(resultsView);

  // Create views
  window.createTreeView(EXECUTION_TREE_VIEW, {
    treeDataProvider: resultsTreeDataProvider,
  });

  // Register commands
  const showResultsCommand = commands.registerCommand(
    SHOW_RESULTS_COMMAND_ID,
    (errorMssg: string) => {
      resultsViewprovider.updateView(errorMssg);
    },
  );
  context.subscriptions.push(showResultsCommand);

  // Listen to progress notifications
  client.onNotification(
    PROGRESS_NOTIFICATION_ID,
    (objectResult: PlainObject<LanguageClientProgressResult>) => {
      try {
        if (
          isPlainObject(objectResult.value) &&
          objectResult.value.kind !== 'end'
        ) {
          resetExecutionTab(resultsTreeDataProvider, resultsViewprovider);
        }
        const result =
          LanguageClientProgressResult.serialization.fromJson(objectResult);
        renderTestResults(result, resultsTreeDataProvider);
      } catch (e) {
        if (error instanceof Error) {
          window.showErrorMessage(error.message);
        }
      }
    },
  );
}

export function activate(context: ExtensionContext): void {
  createClient(context);
  registerComamnds(context);
  registerClientViews(context);
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}
