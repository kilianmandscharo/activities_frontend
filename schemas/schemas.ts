export interface Pause {
  id: number
  startTime: string
  endTime: string
  blockId: number
}

export interface Block {
  id: number
  startTime: string
  endTime: string
  pauses: Pause[] | null
  activityId: number
}

export interface Activity {
  id: number
  name: string
  blocks: Block[] | null
  userId: number
}
