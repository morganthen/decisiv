import ToDoClientShell from "@/components/todos/ToDoClientShell";

import { getToDos } from "@/lib/data";

export default async function ToDo() {
  const todos = await getToDos();

  return <ToDoClientShell todos={todos} />;
}
