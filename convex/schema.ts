import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  earthquakes: defineTable({
    id: v.string(),
    magnitude: v.number(),
    place: v.string(),
    time: v.number(),
    updated: v.number(),
    url: v.string(),
    detail: v.string(),
    status: v.string(),
    tsunami: v.number(),
    sig: v.number(),
    net: v.string(),
    code: v.string(),
    ids: v.string(),
    sources: v.string(),
    types: v.string(),
    nst: v.union(v.number(), v.null()),
    dmin: v.union(v.number(), v.null()),
    rms: v.number(),
    gap: v.union(v.number(), v.null()),
    magType: v.string(),
    type: v.string(),
    title: v.string(),
    coordinates: v.object({
      longitude: v.number(),
      latitude: v.number(),
      depth: v.number(),
    }),
    isTest: v.boolean(), // Flag to distinguish test earthquakes
    createdAt: v.number(), // Timestamp when saved
  })
    .index("by_time", ["time"])
    .index("by_magnitude", ["magnitude"])
    .index("by_isTest", ["isTest"]),
});

