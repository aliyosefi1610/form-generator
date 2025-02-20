export interface IFormData {
  id: string,
  form: IForm,
  steps: number,
  current: number,
  fieldErrors: {},
  errors: Array<string>
}


export interface IForm {
  name: string,
  title: string,
  submitLabel: string,
  nestedFormShowType: string,
  fieldDescriptionShowType?: string,
  fields: Array<IFormDataFields>,
  forms: Array<IForm>
}

export interface IFormDataFields {
  name: string,
  title: string,
  description: string,
  errorMessage: string,
  required: true,
  minLength: number,
  maxLength: number
  type: string;
  regex: string;
  info: string;
  showConfirmPassword: boolean
}

