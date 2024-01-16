import * as React from 'react';
import '../../style/index.css';

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

export const PrimitiveEditor: React.FC<object> = () => {
  const [b, setB] = React.useState(false);
  const [s, setS] = React.useState('string');
  const [n, setN] = React.useState(0);
  const [d, setD] = React.useState('12-11-2021');
  const [t, setT] = React.useState('12-11-2021');
  return (
    <div className="temp">
      <div>
        <BooleanPrimitiveTypeEditor value={b} onChange={(): void => setB(!b)} />
        <div>Boolean</div>
      </div>
      <div>
        <div>String</div>
        <StringPrimitiveTypeEditor
          value={s}
          onChange={(val: string): void => setS(val)}
        />
      </div>
      <div>
        <div>Number</div>
        <NumberPrimitiveTypeEditor
          value={n}
          onChange={(val: number): void => setN(val)}
        />
      </div>
      <div>
        <div>Date</div>
        <DatePrimitiveTypeEditor
          value={d}
          onChange={(val: string): void => setD(val)}
        />
      </div>
      <div>
        <div>Date Time</div>
        <DateTimePrimitiveTypeEditor
          value={t}
          onChange={(val: string): void => setT(val)}
        />
      </div>
    </div>
  );
};
