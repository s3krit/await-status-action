export interface Inputs {
    authToken: string,
    contexts: string[],
    timeout: number,
    notPresentTimeout: number,
    pollInterval: number,
    completeStates: string[],
    failureStates: string[],
    interruptedStates: string[],
    ref: string,
    owner: string,
    repository: string
}
