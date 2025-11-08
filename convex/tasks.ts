import { query, mutation } from "./_generated/server";

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

// Public mutation to add a task to the `tasks` table.
export const add = mutation(async (ctx, task) => {
  // Insert the incoming task object as-is. `task` can be any JSON-serializable object
  // (e.g., { text: 'hello' }). Returns the inserted document.
  return await ctx.db.insert("tasks", task as any);
});