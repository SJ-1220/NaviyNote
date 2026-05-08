import {
  create,
  findLinkedMemo,
  getAll,
  getConnectable,
  getWithTodo,
  linkMemoInTodo,
  remove,
  unlinkMemoFromTodo,
  unlinkTodo,
  update,
} from '@/src/services/memoService'
import { Memo } from '@/src/types/memo'

export const fetchMemos = async (userEmail: string) => {
  if (!userEmail) throw new Error('User email is required')
  return getAll(userEmail)
}

export const fetchMemoWithTodo = async (memoId: string, userEmail: string) => {
  if (!userEmail) throw new Error('User email is required')
  return getWithTodo(memoId, userEmail)
}

export const fetchConnectMemo = async (userEmail: string) => {
  if (!userEmail) throw new Error('User email is required')
  return getConnectable(userEmail)
}

export const addMemo = async (memo: Omit<Memo, 'id'>, userEmail: string) => {
  if (!userEmail) throw new Error('User email is required')

  let memosUpdate: Memo | null = null

  // 1. 새 메모와 연결할 todo_id와 기존에 연결된 메모가 있나? 있다면 그걸 prevMemo라고 정의
  if (memo.todo_id) {
    const prevMemo = await findLinkedMemo(memo.todo_id, userEmail)

    // 2. prevMemo가 있다면 해당 메모의 todo_id를 NULL로 update
    if (prevMemo) {
      await unlinkTodo(prevMemo.id, userEmail)
      memosUpdate = { ...prevMemo, todo_id: null }
    }
  }
  // 3. 추가할 메모 Insert
  const newMemo = await create(memo, userEmail)

  // 4. todo_id가 있다면, todo table에서 해당 todo의 memo_id를 update
  if (newMemo.todo_id) {
    await linkMemoInTodo(newMemo, userEmail)
  }

  return { newMemo, memosUpdate }
}

export const deleteMemo = async (memoId: string, userEmail: string) => {
  if (!userEmail) throw new Error('User email is required')
  await remove(memoId, userEmail)
}

export const updateMemo = async (
  memoId: string,
  updates: Partial<Memo>,
  userEmail: string
) => {
  if (!userEmail) throw new Error('User email is required')

  const memosUpdate: Memo[] = []

  // 1.todo_id가 달라졌다면, 달라진 todo_id와 기존에 연결된 메모가 있나? 있다면 그걸 prevMemo라고 정의
  if (updates.todo_id) {
    const prevMemo = await findLinkedMemo(updates.todo_id, userEmail, memoId)

    // 2.memo를 찾아서 해당 memo의 todo_id를 NULL로 update
    if (prevMemo) {
      const prevMemoNull = await unlinkTodo(prevMemo.id, userEmail)
      if (prevMemoNull) {
        memosUpdate.push(prevMemoNull)
      }
    }
  }

  // 3. 업데이트할 메모 Update
  const updatedMemo = await update(memoId, updates, userEmail)
  if (updatedMemo) {
    memosUpdate.push(updatedMemo)
  }

  // 4. todo_id가 달라졌다면, todo table에서 해당 todo의 memo_id를 null로 update
  if (updatedMemo) {
    await unlinkMemoFromTodo(memoId, updatedMemo, userEmail)

    // 5. todo_id가 달라졌다면, todo table에서 해당 todo의 memo_id를 update
    if (updatedMemo.todo_id) {
      await linkMemoInTodo(updatedMemo, userEmail)
    }
  }
  return memosUpdate
}
