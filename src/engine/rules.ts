// src/engine/rules.ts

export type EventMode = "push" | "issue" | "release";

export type RuleDecision = {
  allow: boolean;
  delay?: number; // ms (for batching)
  priority: "high" | "normal" | "low";
  reason?: string;
};

/**
 * CORE RULE ENGINE
 * decides how events should be handled
 */
export function evaluateEventRules(event: any): RuleDecision {
  const type = event.type as EventMode;

  // =========================
  // PUSH → realtime
  // =========================
  if (type === "push") {
    return {
      allow: true,
      delay: 0,
      priority: "high",
      reason: "real-time push event",
    };
  }

  // =========================
  // RELEASE → immediate but separated
  // =========================
  if (type === "release") {
    return {
      allow: true,
      delay: 0,
      priority: "high",
      reason: "release event",
    };
  }

  // =========================
  // ISSUE → batch mode (10 min)
  // =========================
  if (type === "issue") {
    return {
      allow: true,
      delay: 10 * 60 * 1000,
      priority: "normal",
      reason: "batched issue event",
    };
  }

  // =========================
  // fallback
  // =========================
  return {
    allow: false,
    priority: "low",
    reason: "unknown event type",
  };
}