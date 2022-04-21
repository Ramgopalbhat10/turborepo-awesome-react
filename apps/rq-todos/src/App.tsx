import React, { useRef } from "react";
import {
  useQuery,
  useMutation,
  QueryClientProvider,
  QueryClient,
} from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import axios from "axios";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./api/todos";
import { Todo } from "./types";

const queryClient = new QueryClient();
export const axiosClient = axios.create({
  baseURL: "http://localhost:4000",
});

function TodoApp() {
  const textRef = useRef<HTMLInputElement>(null);

  // const { data: todos } = useQuery<Todo[]>("todos", getTodos, {
  //   initialData: [],
  // });
  const { data: todos } = useQuery<Todo[]>(
    "todos",
    async () => (await axiosClient.get<Todo[]>("/todos")).data,
    { initialData: [] }
  );

  // const createMutation = useMutation(createTodo, {
  //   onSuccess: () => queryClient.invalidateQueries("todos"),
  // });
  const createMutation = useMutation<Response, unknown, { text: string }>(
    (data) => axiosClient.post("/todos", data),
    {
      onSettled: () => {
        queryClient.invalidateQueries("todos");
        textRef.current!.value ?? "";
      },
    }
  );

  // const updateMutation = useMutation(updateTodo, {
  //   onSuccess: () => queryClient.invalidateQueries("todos"),
  // });
  const updateMutation = useMutation<Response, unknown, Todo>(
    (todo) => axiosClient.put(`/todos/${todo.id}`, todo),
    {
      onSettled: () => queryClient.invalidateQueries("todos"),
    }
  );

  // const deleteMutation = useMutation(deleteTodo, {
  //   onSuccess: () => queryClient.invalidateQueries("todos"),
  // });
  const deleteMutation = useMutation<Response, unknown, Todo>(
    ({ id }) => axiosClient.delete(`/todos/${id}`),
    {
      onSettled: () => queryClient.invalidateQueries("todos"),
    }
  );

  return (
    <div className="App">
      <h2>React Query</h2>
      <div className="todos">
        {todos?.map((todo) => (
          <React.Fragment key={todo.id}>
            <div>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => {
                  updateMutation.mutate({ ...todo, done: !todo.done });
                }}
              />
              <span>{todo.text}</span>
            </div>
            <button
              onClick={() => {
                deleteMutation.mutate(todo);
              }}
            >
              Delete
            </button>
          </React.Fragment>
        ))}
      </div>
      <div className="add">
        <input type="text" ref={textRef} />
        <button
          onClick={() => {
            createMutation.mutate({ text: textRef.current!.value ?? "" });
            textRef.current!.value = "";
          }}
        >
          Add
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoApp />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}

export default App;
