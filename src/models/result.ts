import { ErrorList } from "./errorList";

export interface Result {
    Errors: ErrorList;
    isSuccess: boolean;
    IsFailure: boolean;
}

export interface ResultWith<T> {
    Errors: ErrorList;
    isSuccess: boolean;
    IsFailure: boolean;
    value?: T;
}
