import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  projects: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    ownerId: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_owner", ["ownerId"]),

  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("todo"), v.literal("in_progress"), v.literal("completed")),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    projectId: v.optional(v.id("projects")),
    assignedTo: v.id("users"),
    createdBy: v.id("users"),
    dueDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_assigned_to", ["assignedTo"])
    .index("by_created_by", ["createdBy"])
    .index("by_project", ["projectId"])
    .index("by_status", ["status"]),

  comments: defineTable({
    taskId: v.id("tasks"),
    userId: v.id("users"),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_task", ["taskId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
