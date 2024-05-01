import { Todo, TodoID, TodoUpdate } from '../types/Todo';
import { client } from '../utils/fetchClient';

export class ApiClient {
  public USER_ID: string;

  public URL_PATH: string;

  constructor(userId: string) {
    this.USER_ID = userId;
    this.URL_PATH = `/todos?userId=${userId}`;
  }

  getTodos() {
    return client.get<Todo[]>(this.URL_PATH);
  }

  addTodo(newTodo: Omit<Todo, 'id'>) {
    return client.post<Todo>(this.URL_PATH, newTodo);
  }

  deleteTodo(todoID: TodoID) {
    return client.delete(`/todos/${todoID}?userId=${this.USER_ID}`);
  }

  updateTodo(todo: TodoUpdate) {
    return client.patch<Todo>(`/todos/${todo.id}?userId=${this.USER_ID}`, todo);
  }
}
