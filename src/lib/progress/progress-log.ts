// as sveltekit doesn't support eventstream yet, long polling is the only practical option
// to stream out updates to client side. This structure allows a long running server side process
// to respond with a progress ID, and then subsequent requests can ask for the next update until
// the process is complete.
// notably used in /admin/indexes/.../build
import { nanoid } from 'nanoid'

type ProgressReport = {
  id: string, // unique string to identify which progress stream
  progress: number, // from 0.0 to 1.0
  logs: {timestamp: number, things: any[]}[], // line strings since previous update
  finished: boolean, // when this turns true, the stream is finished and consumer should unsubscribe
  index?: number, // incrementing index for report
}

type ProgressReporter = ({ progress: ProgressSet, log: ProgressLog }) => Promise<any>
type ProgressUpdate = {
  timestamp: number,
  log?: any[],
  progress?: number,
  finished?: true,
}
type SubscriptionCB = () => void

const inProgress: { [id: string]: ProgressUpdate[] } = {}
const subscribers: { [id: string]: SubscriptionCB[] } = {}

export function createProgressLog (cb: ProgressReporter): ProgressReport {
  const id = nanoid()
  inProgress[id] = [{ timestamp: Date.now() }]
  subscribers[id] = []

  const setProgress = (progress: number) => {
    if (inProgress[id]) inProgress[id].push({ timestamp: Date.now(), progress })
    if (subscribers[id]) while (subscribers[id].length > 0) subscribers[id].shift()()
  }

  const doLog = (...things: any[]) => {
    if (inProgress[id]) inProgress[id].push({ timestamp: Date.now(), log: things })
    if (subscribers[id]) while (subscribers[id].length > 0) subscribers[id].shift()()
  }

  const output = cb({ progress: setProgress, log: doLog })
  if (output && typeof output === 'object' && typeof output.then === 'function') {
    output.then(() => {
      if (inProgress[id]) inProgress[id].push({ timestamp: Date.now(), progress: 1.0, finished: true })
      if (subscribers[id]) while (subscribers[id].length > 0) subscribers[id].shift()()
    })
  } else {
    if (inProgress[id]) inProgress[id].push({ timestamp: Date.now(), progress: 1.0, finished: true })
  }

  return sliceUpdates(id, 0)
}

function sliceUpdates (id: string, index: number): ProgressReport {
  let report = { id, index, progress: undefined, logs: [], finished: false }
  if (id in inProgress) {
    for (const entry of inProgress[id].slice(index)) {
      if ('log' in entry) report.logs.push({ timestamp: entry.timestamp, log: entry.log })
      if ('progress' in entry) report.progress = entry.progress
      if ('finished' in entry) {
        report.finished = true
        setTimeout(() => {
          delete inProgress[id]
          if (subscribers[id]) {
            while (subscribers[id].length > 0) subscribers[id].shift()()
            delete subscribers[id]
          }
        })
      }
      report.index += 1
    }
  } else {
    report.progress = 1
    report.finished = true
  }
  return report
}

export async function nextUpdate (id: string, index: number): Promise<ProgressReport> {
  if (inProgress[id]) {
    if (inProgress[id].length <= index) {
      await new Promise(resolve => {
        if (subscribers[id]) {
          subscribers[id].push(() => resolve(undefined))
        } else {
          resolve(undefined)
        }
      })
    }
    return sliceUpdates(id, index)
  } else {
    return { id, progress: 1, logs: [], finished: true }
  }
}