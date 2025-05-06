import { create } from 'zustand'
import { Memo } from '@/components/Memo/memosServer'
interface MemoStore {
  memolist: Memo[]
  setMemosStore: (memolist: Memo[]) => void
  clearMemosStore: () => void
}

const useMemoStore = create<MemoStore>((set) => {
  return {
    memolist: [],
    setMemosStore: (memolist: Memo[]) => set({ memolist }),
    clearMemosStore: () => set({ memolist: [] }),
  }
})

export default useMemoStore
