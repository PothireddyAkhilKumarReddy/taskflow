import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get all projects for the current user
export const getUserProjects = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const projects = await ctx.db
      .query("projects")
      .withIndex("by_owner", (q) => q.eq("ownerId", userId))
      .collect();

    // Get task counts for each project
    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const tasks = await ctx.db
          .query("tasks")
          .withIndex("by_project", (q) => q.eq("projectId", project._id))
          .collect();

        return {
          ...project,
          taskCount: tasks.length,
          completedTasks: tasks.filter(t => t.status === "completed").length,
        };
      })
    );

    return projectsWithStats.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Create a new project
export const createProject = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const now = Date.now();
    
    return await ctx.db.insert("projects", {
      name: args.name,
      description: args.description,
      ownerId: userId,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Update a project
export const updateProject = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    if (project.ownerId !== userId) {
      throw new Error("Not authorized to update this project");
    }

    const updates: any = { updatedAt: Date.now() };
    
    if (args.name !== undefined) updates.name = args.name;
    if (args.description !== undefined) updates.description = args.description;

    await ctx.db.patch(args.projectId, updates);
  },
});

// Delete a project
export const deleteProject = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const project = await ctx.db.get(args.projectId);
    if (!project) {
      throw new Error("Project not found");
    }

    if (project.ownerId !== userId) {
      throw new Error("Not authorized to delete this project");
    }

    // Delete all tasks in this project
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .collect();

    for (const task of tasks) {
      // Delete comments for each task
      const comments = await ctx.db
        .query("comments")
        .withIndex("by_task", (q) => q.eq("taskId", task._id))
        .collect();
      
      for (const comment of comments) {
        await ctx.db.delete(comment._id);
      }
      
      await ctx.db.delete(task._id);
    }

    await ctx.db.delete(args.projectId);
  },
});
