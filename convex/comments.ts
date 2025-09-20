import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

// Get comments for a task
export const getTaskComments = query({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_task", (q) => q.eq("taskId", args.taskId))
      .collect();

    // Get user info for each comment
    const commentsWithUsers = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          ...comment,
          userName: user?.name || user?.email || "Unknown User",
        };
      })
    );

    return commentsWithUsers.sort((a, b) => a.createdAt - b.createdAt);
  },
});

// Add a comment to a task
export const addComment = mutation({
  args: {
    taskId: v.id("tasks"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Verify task exists and user has access
    const task = await ctx.db.get(args.taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    if (task.assignedTo !== userId && task.createdBy !== userId) {
      throw new Error("Not authorized to comment on this task");
    }

    return await ctx.db.insert("comments", {
      taskId: args.taskId,
      userId,
      content: args.content,
      createdAt: Date.now(),
    });
  },
});

// Delete a comment
export const deleteComment = mutation({
  args: {
    commentId: v.id("comments"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const comment = await ctx.db.get(args.commentId);
    if (!comment) {
      throw new Error("Comment not found");
    }

    if (comment.userId !== userId) {
      throw new Error("Not authorized to delete this comment");
    }

    await ctx.db.delete(args.commentId);
  },
});
