export interface Message {
    code: string;
    expected: string;
    received: string;
    path: string[]
    message: string
}

export interface ErrorMessages {
    message : Message[]
}