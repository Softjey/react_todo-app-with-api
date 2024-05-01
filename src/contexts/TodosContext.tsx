// eslint-disable-next-line object-curly-newline
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Todo, TodoID, TodoUpdate } from '../types/Todo';
import { TodosFilterQuery } from '../constants';
import getPreparedTodos from '../utils/getPreparedTodos';
import { ApiClient } from '../api/todos';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface TodosContextType {
  userId: string | null;
  todos: Todo[],
  activeTodos: Todo[],
  completedTodos: Todo[],
  preparedTodos: Todo[],
  query: TodosFilterQuery,
  error: string,
  tempTodo: null | Todo,
  setUserId: (newUserId: string) => void,
  addTodo: ((newTodo: Todo) => Promise<void>) | null,
  deleteTodo: ((todoID: TodoID) => Promise<void>) | null,
  updateTodo: ((todo: TodoUpdate) => Promise<void>) | null,
  setQuery: React.Dispatch<React.SetStateAction<TodosFilterQuery>>,
  setError: React.Dispatch<React.SetStateAction<string>>,
}

export const TodosContext = React.createContext<TodosContextType>({
  userId: null,
  todos: [],
  activeTodos: [],
  completedTodos: [],
  preparedTodos: [],
  query: TodosFilterQuery.all,
  error: '',
  tempTodo: null,
  addTodo: null,
  deleteTodo: null,
  updateTodo: null,
  setUserId: () => { },
  setQuery: () => { },
  setError: () => { },
});

export const TodosProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useLocalStorage('userId');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [query, setQuery] = useState(TodosFilterQuery.all);
  const [error, setError] = useState('');
  const apiClient = useRef<ApiClient | null>(null);

  useEffect(() => {
    if (!userId) {
      return;
    }

    apiClient.current = new ApiClient(userId);

    apiClient.current.getTodos()
      .then(setTodos)
      .catch(() => setUserId(null));
  }, [userId, setUserId]);

  const preparedTodos = useMemo(
    () => getPreparedTodos(todos, query),
    [todos, query],
  );

  const { active: activeTodos, completed: completedTodos } = useMemo(() => (
    todos.reduce<{ active: Todo[]; completed: Todo[] }>(
      (sortedTodos, todo) => {
        if (todo.completed) {
          sortedTodos.completed.push(todo);
        } else {
          sortedTodos.active.push(todo);
        }

        return sortedTodos;
      }, { active: [], completed: [] },
    )
  ), [todos]);

  const addTodo = (newTodo: Todo) => {
    setTempTodo(newTodo);

    return apiClient.current!.addTodo(newTodo)
      .then((newTodoFromServer) => {
        setTodos(prevTodos => [...prevTodos, newTodoFromServer]);
      })
      .finally(() => setTempTodo(null));
  };

  const updateTodo = (todoToUpdate: TodoUpdate) => {
    return apiClient.current!.updateTodo(todoToUpdate)
      .then(updatedTodo => {
        setTodos(prevTodos => (
          prevTodos.map(todo => (
            todo.id === updatedTodo.id ? updatedTodo : todo
          ))));
      })
      .catch(() => setError('Unable to update a todo'));
  };

  const deleteTodo = (todoID: TodoID) => {
    return apiClient.current!.deleteTodo(todoID)
      .then(() => {
        setTodos(prevTodos => (
          prevTodos.filter(todo => todo.id !== todoID)
        ));
      })
      .catch(() => setError('Unable to delete a todo'));
  };

  const value: TodosContextType = {
    userId,
    todos,
    activeTodos,
    completedTodos,
    preparedTodos,
    query,
    error,
    tempTodo,
    addTodo,
    updateTodo,
    deleteTodo,
    setQuery,
    setError,
    setUserId,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
