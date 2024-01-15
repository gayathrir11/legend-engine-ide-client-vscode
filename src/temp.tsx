import * as React from 'react';
import { BooleanComponent } from './components/PrimitiveTypeEditor';
import * as ReactDOM from 'react-dom';

ReactDOM.render(
  <BooleanComponent
    value={false}
    onChange={function (value: boolean): void {
      throw new Error('Function not implemented.');
    }}
  />,
  document.getElementById('root'),
);
