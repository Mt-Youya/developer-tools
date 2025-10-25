import { create } from "zustand"

interface ServerStore {
  server: string
  setServer: (server: string) => void

  port: number | string
  setPort: (port: number | string) => void
}

export const ServerStore = create<ServerStore>((set) => ({
  server: "127.0.0.1",
  setServer: (server: string) => set({ server }),

  port: 3030,
  setPort: (port: number | string) => set({ port }),
}))
