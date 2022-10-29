import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { httpBatchLink } from "@trpc/client";
import {} from "@trpc/react-query";
import React, { useState } from "react";
import ReactDOM from "react-dom";

import "./index.scss";
import TodoItem from "./TodoItem";
import { trpc } from "./utils/trpc";

const AppComp = () => {
  const [title, setTitle] = useState("");
  const { data, isLoading } = trpc.getTodos.useQuery();

  const ctx = trpc.useContext();

  const { mutate } = trpc.addTodo.useMutation({
    onSuccess: () => {
      ctx.getTodos.invalidate();
    },
  });

  if (isLoading) return <h1>Loading...</h1>;

  return (
    <div className="mt-10 text-3xl mx-auto max-w-6xl">
      {data?.map((todo) => (
        <TodoItem todo={todo} />
      ))}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          border: "1px solid black",
        }}
      />
      <button
        onClick={() =>
          mutate({
            title,
          })
        }
      >
        Add
      </button>
    </div>
  );
};

const App = () => {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:8080/trpc",
        }),
      ],
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppComp />
      </QueryClientProvider>
    </trpc.Provider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
