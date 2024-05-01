/* eslint-disable react/jsx-one-expression-per-line */
import React, { FormEvent, useContext, useRef } from 'react';
import { TodosContext } from './contexts/TodosContext';

export const UserWarning: React.FC = () => {
  const { setUserId } = useContext(TodosContext);
  const userIdInput = useRef<HTMLInputElement>(null);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();

    const value = userIdInput.current?.value;

    if (value) {
      setUserId(userIdInput.current?.value);
    }
  };

  return (
    <section
      className="box is-flex is-flex-direction-column is-align-items-center mt-6"
      style={{ gap: '20px' }}
    >
      <p className="is-size-3 has-text-centered">
        Please get your <b> userId </b> for authorization.
        All requests to the API must be sent with this <b> userId.</b>
      </p>

      <a
        href="https://mate-academy.github.io/react_student-registration"
        target="_blank"
        rel="noreferrer"
        className="button is-link"
      >
        Get UserId here
      </a>

      <form onSubmit={onSubmit} className="is-flex" style={{ gap: '10px' }}>
        <input
          type="text"
          placeholder="Enter your userId"
          className="input is-normal"
          ref={userIdInput}
          required
        />

        <button type="submit" className="button is-success">Save</button>
      </form>
    </section>
  );
};
