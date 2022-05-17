export type OrthagonalIndex = {
  buildTimestamp: number, // epochMs timestamp
  availableColumns: {
    [key: string]: OrthagonalColumn
  }
  loadedColumns: {
    [key: string]: LoadedOrthagonalColumn
  }
}

export type OrthagonalColumn = OrthagonalColumnJSON | OrthagonalColumnBufferListList
export type OrthagonalColumnJSON = { format: 'json' }
export type OrthagonalColumnBufferListList = { format: 'buffer-list-list' }

export type LoadedOrthagonalColumn = LoadedOrthagonalColumnJSON | LoadedOrthagonalColumnLPS
export type LoadedOrthagonalColumnJSON = {
  format: 'json',
  entries: any[]
}

export type LoadedOrthagonalColumnLPS = {
  format: 'buffer-list-list',
  entries: Uint8Array[][]
}