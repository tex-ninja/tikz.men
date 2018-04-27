declare module 'latex' {
    import { Stream } from "stream";
    export function latex(latex: string | string[] | Buffer | Stream): Stream
}