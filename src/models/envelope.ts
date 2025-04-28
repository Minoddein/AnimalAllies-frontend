import { Error } from "./error";

export interface Envelope {
    result: object | null;
    errors: Error[];
    timeGenerated: Date;
}
