// BooleanComponent.tsx
import * as React from 'react';

interface BooleanComponentProps {
  value: boolean;
  onChange: (value: boolean) => void;
}


export const HelloWorld: React.FC = () => <h1>Hello, World!</h1>;


export const BooleanComponent: React.FC<BooleanComponentProps> = ({
  value,
  onChange,
}) => (
  <div>
    <label>
      Boolean Value:
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
    </label>
  </div>
);

interface StringComponentProps {
  value: string;
  onChange: (value: string) => void;
}

export const StringComponent: React.FC<StringComponentProps> = ({
  value,
  onChange,
}) => (
  <div>
    <label>
      String Value:
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  </div>
);

interface NumberComponentProps {
  value: number;
  onChange: (value: number) => void;
}

export const NumberComponent: React.FC<NumberComponentProps> = ({
  value,
  onChange,
}) => (
  <div>
    <label>
      Number Value:
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  </div>
);
