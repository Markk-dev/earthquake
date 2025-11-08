import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Save a test earthquake
export const saveTestEarthquake = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    // Check if earthquake with this ID already exists
    const existing = await ctx.db
      .query("earthquakes")
      .withIndex("by_isTest", (q) => q.eq("isTest", true))
      .filter((q) => q.eq(q.field("id"), args.id))
      .first();

    if (existing) {
      // Update existing
      return await ctx.db.patch(existing._id, {
        ...args,
        isTest: true,
        updated: Date.now(),
        createdAt: existing.createdAt,
      });
    }

    // Insert new
    return await ctx.db.insert("earthquakes", {
      ...args,
      isTest: true,
      createdAt: Date.now(),
    });
  },
});

// Get all test earthquakes
export const getTestEarthquakes = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db
      .query("earthquakes")
      .withIndex("by_isTest", (q) => q.eq("isTest", true))
      .collect();
    
    // Sort by time descending (most recent first)
    return all.sort((a, b) => b.time - a.time);
  },
});

// Get test earthquakes by magnitude threshold
export const getTestEarthquakesByMagnitude = query({
  args: {
    minMagnitude: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("earthquakes")
      .withIndex("by_isTest", (q) => q.eq("isTest", true))
      .filter((q) => q.gte(q.field("magnitude"), args.minMagnitude))
      .collect();
  },
});

// Get recent test earthquakes
export const getRecentTestEarthquakes = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit || 50;
    const all = await ctx.db
      .query("earthquakes")
      .withIndex("by_isTest", (q) => q.eq("isTest", true))
      .collect();
    
    // Sort by time descending and take limit
    return all
      .sort((a, b) => b.time - a.time)
      .slice(0, limit);
  },
});

// Delete a test earthquake
export const deleteTestEarthquake = mutation({
  args: {
    id: v.id("earthquakes"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// Clear all test earthquakes
export const clearAllTestEarthquakes = mutation({
  args: {},
  handler: async (ctx) => {
    const testEarthquakes = await ctx.db
      .query("earthquakes")
      .withIndex("by_isTest", (q) => q.eq("isTest", true))
      .collect();

    for (const eq of testEarthquakes) {
      await ctx.db.delete(eq._id);
    }

    return { deleted: testEarthquakes.length };
  },
});

