import { ErrorList } from "./errorList";

export interface Result {
    Errors: ErrorList;
    IsSucess: boolean;
    IsFailure: boolean;
}

export interface ResultWithValue<T> extends Result {
    Value: T;
}
