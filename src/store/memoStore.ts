import { create } from 'zustand'
import { Memo } from '@/components/Memo/memosServer'
interface MemoStore {
  memolist: Memo[]
  setMemosStore: (updater: Memo[] | ((prev: Memo[]) => Memo[])) => void
  clearMemosStore: () => void
}

const useMemoStore = create<MemoStore>((set, get) => ({
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
