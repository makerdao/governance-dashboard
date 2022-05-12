export enum Impact {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
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

export type Proposal = {
  title: string
  impact: Impact
  type: string
  activityStatus: ActivityStatus
  status: Status
  endDate: string
  class: string
  forum: string
  poll: string
  executive: string
}
