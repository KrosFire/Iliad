import { emit as tauriEmit, listen as tauriListen } from '@tauri-apps/api/event'
import { Events } from '~/types'

export const emit = async <E extends keyof Events, P extends Events[E]['payload']>(
  event: E,
  payload: P,
): Promise<void> => {
  await tauriEmit(event, payload)
}

type UnslistenFn = () => void

export const listen = async <E extends keyof Events, P extends Events[E]['payload']>(
  event: E,
  cb: (payload: P) => void,
): Promise<UnslistenFn> => tauriListen<P>(event, event => cb(event.payload))
