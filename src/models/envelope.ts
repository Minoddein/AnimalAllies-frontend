import { Error } from "./error";

export interface Envelope<T> {
    result: T | null;
    errors: Error[];
    timeGenerated: Date;
}
