import Ajv from 'ajv';

export const ajv = new Ajv();
export const compile = ajv.compile.bind(ajv) as <T>(schema: any) => (data: any) => data is T;