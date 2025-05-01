import { create } from 'zustand'
import { Todo } from '@/components/ToDo/todosServer'
interface TodoStore {
  todolist: Todo[]
  setTodosStore: (todolist: Todo[]) => void
  clearTodosStore: () => void
}
const useTodoStore = create<TodoStore>((set) => {
  return {
    todolist: [],
    setTodosStore: (todolist: Todo[]) => set({ todolist }),
    clearTodosStore: () => set({ todolist: [] }),
  }
})

export default useTodoStore
