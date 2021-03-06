import { GetCombinedStatusForRef } from '../types';
import { NOT_PRESENT } from '../constants';
import { Inputs } from '../interfaces/Inputs';
import { Octokit } from '@octokit/rest';

export function statusesHasFailure(failureStates: string[], currentStatuses: CheckStatus): boolean {
    let props = Object.getOwnPropertyNames(currentStatuses);
    if (props.find(propName => failureStates.includes(currentStatuses[propName]))) {
        return true;
    }
    return false;
}

export function statusesHasInterrupted(interruptedStates: string[], currentStatuses: CheckStatus): boolean {
    let props = Object.getOwnPropertyNames(currentStatuses);
    if (props.find(propName => interruptedStates.includes(currentStatuses[propName]))) {
        return true;
    }
    return false;
}

export function statusesAllComplete(completeStates: string[], currentStatuses: CheckStatus) {
    let props = Object.getOwnPropertyNames(currentStatuses);
    if (props.find(propName => !completeStates.includes(currentStatuses[propName]))) {
        return false;
    }
    return true;
}

export function statusesAllPresent(currentStatuses: CheckStatus) {
    let props = Object.getOwnPropertyNames(currentStatuses);
    if (props.find(propName => currentStatuses[propName] == NOT_PRESENT)) {
        return false;
    }
    return true;
}

export function updateCurrentStatuses(currentStatuses: CheckStatus, data: GetCombinedStatusForRef): CheckStatus {
    let result: CheckStatus = {};
    Object.assign(result, currentStatuses);
    for (let i = 0; i < data.statuses.length; i++) {
        const status = data.statuses[i];
        if (result.hasOwnProperty(status.context)) {
            result[status.context] = status.state;
        }
    }
    return result;
}

export async function getCurrentStatuses(inputs: Inputs, octokit: Octokit, currentStatuses: CheckStatus) {
    return updateCurrentStatuses(currentStatuses,
        (await octokit.repos.getCombinedStatusForRef({
            owner: inputs.owner,
            repo: inputs.repository,
            ref: inputs.ref
        })).data);
}

export function newCurrentStatuses(contexts: string[]): CheckStatus {
    let checkStatus: CheckStatus = {};
    contexts.forEach(x => checkStatus[x] = NOT_PRESENT);
    return checkStatus;
}
