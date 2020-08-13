export interface OctoprintContinuousPrintQueueAPI {
  queue: [OctoprintContinuousPrintQueueItemAPI];
} 

export interface OctoprintContinuousPrintQueueItemAPI {
    name: string,
    path: string,
    sd: string
}
