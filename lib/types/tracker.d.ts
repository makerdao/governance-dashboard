export enum Impact {
  Low = 'LOW',
  Medium = 'MEDIUM',
  High = 'HIGH',
}

export enum ActivityStatus {
  Pending = 'Pending',
  Active = 'Active',
  Archived = 'Archived',
}

export enum Status {
  Executive = 'EXECUTIVE',
  OnChainPoll = 'ON-CHAIN POLL',
  OffChainPoll = 'OFF-CHAIN POLL',
  Notification = 'NOTIFICATION',
  InformalPoll = 'INFORMAL POLL',
  ForumDiscussion = 'FORUM DISCUSSION',
  PLANNED = 'PLANNED',
}

export type ExecutiveProposal = {
  title: string
  impact: Impact
  activityStatus: ActivityStatus
  status: Status
  endDate: Date
  class: string
  forum: string
  poll: string
  executive: string
}
