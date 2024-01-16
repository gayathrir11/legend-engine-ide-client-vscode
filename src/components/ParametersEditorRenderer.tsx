// webview/webview.tsx
import * as ReactDOM from 'react-dom';
import { PrimitiveTypeEditor } from './PrimitiveTypeEditor';
import * as React from 'react';
import { Variable } from '../model/VariableExpression';
import { ParameterValue, Value } from '../model/ParameterValue';
import { type PlainObject, deserializeMap } from '../utils/SerializationUtils';

// ReactDOM.render(<PrimitiveEditor />, document.getElementById('root'));
// webview.tsx

const ParametersEditorRenderer: React.FC<{
  parameters: Variable[];
}> = ({ parameters }) => {
  const [parameterValues] = React.useState(new Map<string, ParameterValue>());
  let propFunction: (arg0: string) => void;
  window.addEventListener('message', (event) => {
    const message = event.data;
    console.log('mssd');
    console.log(message);
    if (message.command === 'setFunctionProp') {
      propFunction = message.propFunction;
      console.log(propFunction);
      console.log(propFunction('dunn'));
    //   // Now 'propFunction' is a function that you can use in your components
    //   // For example, you can pass it as a prop to your React component
    }
  });
  const submit = (): void => {
    console.log('sds');
    propFunction('hello world');
    // commands.executeCommand('legend.command', parameterValues);
  };
  return (
    <div>
      {parameters.map((parameter) => {
        const parameterValue = new ParameterValue();
        parameterValue.name = parameter.name;
        parameterValue.value = new Value();
        parameterValue.value._type = parameter._class;
        parameterValue.value.value = 'string';
        parameterValues.set(parameter.name, parameterValue);
        const [value, setValue] = React.useState<unknown>('');
        return (
          <div>
            <div>{parameter.name}</div>
            <PrimitiveTypeEditor
              type={parameter._class}
              value={value}
              onChange={(val: unknown) => {
                setValue(val);
                parameterValue.value.value = val;
              }}
            />
          </div>
        );
      })}
      <button
        className="value-spec-editor__variable__reset-btn"
        title="Run"
        onClick={submit}
      >
        Run
      </button>
    </div>
  );
};

const rootElement = document.getElementById('root');

if (rootElement) {
  const inputParamtersFromHtml = rootElement.getAttribute(
    'data-input-parameters',
  );
  if (inputParamtersFromHtml) {
    const input = JSON.parse(inputParamtersFromHtml) as unknown[];
    const inputP = input[5] as Record<string, PlainObject<Variable>>;
    const inputParameters = deserializeMap(
      inputP,
      (json: PlainObject<Variable>): Variable =>
        Variable.serialization.fromJson(json),
    );
    ReactDOM.render(
      <ParametersEditorRenderer
        parameters={Array.from(inputParameters.values())}
      />,
      rootElement,
    );
  }
} else {
  console.error('Root element with ID "root" not found in the DOM.');
}
