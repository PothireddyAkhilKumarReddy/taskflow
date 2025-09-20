import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all tasks for the current user
export const getUserTasks = query({
  args: {
    status: v.optional(v.union(v.literal("todo"), v.literal("in_progress"), v.literal("completed"))),
    projectId: v.optional(v.id("projects")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    let tasks;
    
    if (args.status) {
      tasks = await ctx.db.query("tasks").withIndex("by_status", (q) => q.eq("status", args.status!)).collect();
    } else {
      tasks = await ctx.db.query("tasks").withIndex("by_assigned_to", (q) => q.eq("assignedTo", userId)).collect();
    }
    
    // Filter by project if specified and user ownership
    let filteredTasks = tasks.filter(task => task.assignedTo === userId || task.createdBy === userId);
    
    if (args.projectId) {
      filteredTasks = filteredTasks.filter(task => task.projectId === args.projectId);
    }

    // Get project names for tasks
    const tasksWithProjects = await Promise.all(
      filteredTasks.map(async (task) => {
        let projectName = null;
        if (task.projectId) {
          const project = await ctx.db.get(task.projectId);
          projectName = project?.name || null;
        }
        
        const assignedUser = await ctx.db.get(task.assignedTo);
        const createdByUser = await ctx.db.get(task.createdBy);
        
        return {
          ...task,
          projectName,
          assignedToName: assignedUser?.name || assignedUser?.email || "Unknown",
          createdByName: createdByUser?.name || createdByUser?.email || "Unknown",
        };
      })
    );

    return tasksWithProjects.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Create a new task
export const createTask = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    projectId: v.optional(v.id("projects")),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const now = Date.now();
    
    return await ctx.db.insert("tasks", {
      title: args.title,
      description: args.description,
      status: "todo",
      priority: args.priority,
      projectId: args.projectId,
      assignedTo: userId,
      createdBy: userId,
      dueDate: args.dueDate,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a task
export const updateTask = mutation({
  args: {
    taskId: v.id("tasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.union(v.literal("todo"), v.literal("in_progress"), v.literal("completed"))),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    dueDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.assignedTo !== userId && task.createdBy !== userId) {
      throw new Error("Not authorized to update this task");
    }

    const updates: any = { updatedAt: Date.now() };
    
    if (args.title !== undefined) updates.title = args.title;
    if (args.description !== undefined) updates.description = args.description;
    if (args.status !== undefined) updates.status = args.status;
    if (args.priority !== undefined) updates.priority = args.priority;
    if (args.dueDate !== undefined) updates.dueDate = args.dueDate;

    await ctx.db.patch(args.taskId, updates);
  },
});

// Delete a task
export const deleteTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.createdBy !== userId) {
      throw new Error("Not authorized to delete this task");
    }

    // Delete associated comments
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .collect();
    
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    await ctx.db.delete(args.taskId);
  },
});

// Get task statistics
export const getTaskStats = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_assigned_to", (q) => q.eq("assignedTo", userId))
      .collect();

    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === "todo").length,
      inProgress: tasks.filter(t => t.status === "in_progress").length,
      completed: tasks.filter(t => t.status === "completed").length,
      overdue: tasks.filter(t => t.dueDate && t.dueDate < Date.now() && t.status !== "completed").length,
    };

    return stats;
  },
});
