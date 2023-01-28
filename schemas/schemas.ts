export interface Pause {
  id: number
  start: string
  end: string
  blockID: number
}

export interface Block {
  id: number
  start: string
  end: string
  pauses: Pause[]
  activityID: number
}

export interface Activity {
  id: number
  name: string
  blocks: Block[]
  userID: number
}
