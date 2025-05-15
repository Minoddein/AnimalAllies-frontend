import { ErrorList } from "./errorList";

export interface Result {
    Errors: ErrorList;
    isSuccess: boolean;
    IsFailure: boolean;
}

export interface ResultWithValue<T> extends Result {
    Value: T;
}
