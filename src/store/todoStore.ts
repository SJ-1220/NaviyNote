import { create } from 'zustand'
import { Todo } from '@/components/ToDo/todosServer'
interface TodoStore {
  todolist: Todo[]
  setTodosStore: (updater: Todo[] | ((prev: Todo[]) => Todo[])) => void
  clearTodosStore: () => void
}
const useTodoStore = create<TodoStore>((set) => ({
  todolist: [],
  setTodosStore: (updater) => {
    set((state) => {
      const newTodos =
        typeof updater === 'function' ? updater(state.todolist) : updater
      return { todolist: newTodos }
    })
  },
  clearTodosStore: () => set({ todolist: [] }),
}))

export default useTodoStore
