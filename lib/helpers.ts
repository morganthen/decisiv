import { Task } from "./types";

type fetchPrioritiesType = {
  todos: Pick<Task, "id" | "task">[];
};

export async function fetchPriorities({ todos }: fetchPrioritiesType) {
  const dateObj = new Date();

  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTasks = todos
    .map((todo, idx) => `${idx + 1}. [${todo.id}] ${todo.task}`)
    .join("\n");

  console.log("formatted Tasks", formattedTasks);

  try {
    const response = await fetch(
      "https://api.deepinfra.com/v1/openai/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LLM_API_KEY}`,
        },
        body: JSON.stringify({
          model: "meta-llama/Llama-4-Maverick-17B-128E-Instruct-Turbo",
          messages: [
            {
              role: "user",
              content: `Today is ${formattedDate}. Here is a list of tasks:\n${formattedTasks}\nPlease assign a priority score (1 = highest, N = lowest) to each task. Also assign a short explanation as to why you have decided this sequence of importance. Keep the thinking to yourself and ONLY return a JSON object mapping task ids to scores and their respective explanation. This is the shape of the JSON object i require:\n{
                "id1": { "score": 1, "explanation": "..." },
                "id2": { "score": 2, "explanation": "..." }
                }\nRemember no fluff, JUST the JSON object mapping task ids to scores and their respective explanation.`,
            },
          ],
        }),
      },
    );
    const data = await response.json();
    console.log(data);
    const explanation = data.choices[0].message.content;
    console.log(explanation);
    return explanation;
  } catch (err) {
    console.error(err);
    console.log(err);
  }
}
