export interface FieldSummary {
  id: string,
  label: string,
}

export interface Field extends FieldSummary {
  helpText: string,
}