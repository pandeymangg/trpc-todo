import React, { useState } from "react";
import { trpc } from "./utils/trpc";

const TodoItem = ({ todo }: { todo: { id: number; title: string } }) => {
  const ctx = trpc.useContext();
  const [todoTitle, setTodoTitle] = useState(todo.title);
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: deleteTodoMutation } = trpc.deleteTodo.useMutation({
    onSuccess: () => {
      ctx.getTodos.invalidate();
    },
  });
  const { mutate: updateTodoMutation } = trpc.updateTodo.useMutation({
    onSuccess: () => {
      ctx.getTodos.invalidate();
    },
  });
  return (
    <div
      style={{
        width: 300,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {isEditing ? (
        <div
          style={{
            display: "flex",
          }}
        >
          <input
            type="text"
            value={todoTitle}
            onChange={(e) => setTodoTitle(e.target.value)}
            style={{
              border: "1px solid black",
            }}
          />

          <span
            style={{
              cursor: "pointer",
            }}
            onClick={() => {
              updateTodoMutation({
                id: todo.id,
                title: todoTitle,
              });
              setIsEditing(false);
            }}
          >
            Save
          </span>
        </div>
      ) : (
        <p onClick={() => setIsEditing(true)}>{todoTitle}</p>
      )}

      {!isEditing ? (
        <button
          onClick={() =>
            deleteTodoMutation({
              id: todo.id,
            })
          }
        >
          Delete
        </button>
      ) : null}
    </div>
  );
};

export default TodoItem;
