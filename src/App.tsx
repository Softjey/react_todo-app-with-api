/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import TodoApp from './components/TodoApp';
import { TodosProvider } from './contexts/TodosContext';

export const App: React.FC = () => (
  <TodosProvider>
    <TodoApp />
  </TodosProvider>
);
