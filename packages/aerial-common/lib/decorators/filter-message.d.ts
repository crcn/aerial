/**
 * Used for actors that need to filter for particular messages. Usage:
 *
 * @filterMessage(sift({ $type: DSEvent }))
 * update(message:UpdateEvent) { }
 */
export declare function filterMessage(filter: Function): (proto: any, name: any, inf: any) => void;
