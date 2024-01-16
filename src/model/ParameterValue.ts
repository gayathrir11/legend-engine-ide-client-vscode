export class Value {
  _type!: string;
  value!: unknown;
}

export class ParameterValue {
  name!: string;
  value!: Value;
}
