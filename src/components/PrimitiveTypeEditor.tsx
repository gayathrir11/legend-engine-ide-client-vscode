import * as React from 'react';
import '../../style/index.css';
import { PRIMITIVE_TYPE } from '../utils/Const';

export const BooleanPrimitiveTypeEditor: React.FC<{
  value: boolean;
  onChange: (value: boolean) => void;
}> = ({ value, onChange }) => (
  <div>
    <input
      type="checkbox"
      checked={value}
      onChange={(e) => onChange(e.target.checked)}
    />
  </div>
);

export const StringPrimitiveTypeEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <div>
    <input
      spellCheck={false}
      placeholder={value === '' ? '(empty)' : undefined}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export const NumberPrimitiveTypeEditor: React.FC<{
  value: number;
  onChange: (value: number) => void;
}> = ({ value, onChange }) => (
  <div>
    <input
      type="number"
      spellCheck={false}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </div>
);

export const DatePrimitiveTypeEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <div>
    <input
      type="date"
      spellCheck={false}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export const DateTimePrimitiveTypeEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
}> = ({ value, onChange }) => (
  <div>
    <input
      // Despite its name this would actually allow us to register time in UTC
      // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#setting_timezones
      type="datetime-local"
      // Configure the step to show seconds picker
      // See https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/datetime-local#step
      step="1"
      spellCheck={false}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export const PrimitiveTypeEditor: React.FC<{
  type: string;
  value: unknown;
  onChange: (val: unknown) => void;
}> = ({ type, value, onChange }) => {
  switch (type) {
    case PRIMITIVE_TYPE.STRING:
      return (
        <StringPrimitiveTypeEditor
          value={value as string}
          onChange={onChange}
        />
      );
    case PRIMITIVE_TYPE.BOOLEAN:
      return (
        <BooleanPrimitiveTypeEditor
          value={value as boolean}
          onChange={onChange}
        />
      );
    case PRIMITIVE_TYPE.NUMBER:
    case PRIMITIVE_TYPE.INTEGER:
    case PRIMITIVE_TYPE.DECIMAL:
    case PRIMITIVE_TYPE.FLOAT:
    case PRIMITIVE_TYPE.BINARY:
    case PRIMITIVE_TYPE.BYTE:
      return (
        <NumberPrimitiveTypeEditor
          value={value as number}
          onChange={onChange}
        />
      );
    case PRIMITIVE_TYPE.STRICTDATE:
      return (
        <DatePrimitiveTypeEditor value={value as string} onChange={onChange} />
      );
    case PRIMITIVE_TYPE.DATE:
    case PRIMITIVE_TYPE.DATETIME:
      return (
        <DateTimePrimitiveTypeEditor
          value={value as string}
          onChange={onChange}
        />
      );
    default:
      return null;
  }
};
