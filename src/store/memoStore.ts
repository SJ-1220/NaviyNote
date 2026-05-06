import { Memo } from '@/src/types/memo'
import { create } from 'zustand'
interface MemoStore {
  memolist: Memo[]
  setMemosStore: (updater: Memo[] | ((prev: Memo[]) => Memo[])) => void
  clearMemosStore: () => void
}

const useMemoStore = create<MemoStore>((set) => ({
  memolist: [],
  setMemosStore: (updater) => {
    set((state) => {
      const newMemos =
        typeof updater === 'function' ? updater(state.memolist) : updater
      return { memolist: newMemos }
    })
  },
  clearMemosStore: () => set({ memolist: [] }),
}))

export default useMemoStore
