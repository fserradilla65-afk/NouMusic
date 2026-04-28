import { ElectronAPI } from '@electron-toolkit/preload'
import 'noumusic/content/types'

declare global {
  interface Window {
    electron: ElectronAPI
    api: unknown
  }
}
