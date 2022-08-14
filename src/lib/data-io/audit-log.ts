import { bytesToString } from '$lib/functions/string-encode'
import { nanoid } from 'nanoid'
import { listFilenames, readFile, writeFile } from './data-io'

export type AuditLogID = {
  time: Date, // timestamp when the action happened
  actionType: AuditActionType, // one of the possible action types
  actor: string, // person who did the action, their username in the search/users accounts
  filename: string, // filename of the audit log entry
}

export type AuditLogEntry = {
  time: Date, // timestamp when the action happened
  actionType: AuditActionType, // one of the possible action types
  actor: string, // person who did the action, their username in the search/users accounts
  message: string
  extra?: AuditExtraData
}


export type AuditActionType =
  'add-user' | 'edit-user' | 'delete-user' |
  'update-index' | 'rebuild-index' |
  'override-search-data-entry'


export type AuditExtraData = {
  publicURL?: string,
  adminURL?: string,
}

export async function writeAuditLog (actor: string, actionType: AuditActionType, message: string, extra?: AuditExtraData) {
  const logEntry = {
    actor,
    actionType,
    time: Date.now(),
    message,
    extra
  }

  const random = nanoid()
  const filename = [logEntry.time, logEntry.actionType, logEntry.actor, random, 'json'].map(encodeURIComponent).join('.')

  await writeFile(`audit-log/${filename}`, JSON.stringify(logEntry))
}

export async function listAuditLogs (): Promise<AuditLogID[]> {
  const files = await listFilenames('audit-log')
  return files.map(filename => {
    const [timestamp, actionType, actor] = filename.split('.').map(decodeURIComponent)
    return {
      time: new Date(parseInt(timestamp)),
      timeMs: parseInt(timestamp),
      actionType: actionType as AuditActionType,
      actor,
      filename
    }
  }).sort((a,b) => a.timeMs - b.timeMs)
}

export async function readAuditLog (id: AuditLogID): Promise<AuditLogEntry> {
  const data = await readFile(`audit-log/${id.filename}`)
  if (data) {
    const string = bytesToString(data)
    const object = JSON.parse(string)
    return { ...id, ...object }
  }
}
