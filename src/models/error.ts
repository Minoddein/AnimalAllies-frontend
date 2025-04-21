import { ErrorType } from "./errorType";

export interface Error {
    code: string;
    message: string;
    type: ErrorType;
    invalidField: string;
}
