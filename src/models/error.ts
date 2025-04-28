import { ErrorType } from "./errorType";

export interface Error {
    errorCode: string;
    errorMessage: string;
    type: ErrorType;
    invalidField: string;
}
