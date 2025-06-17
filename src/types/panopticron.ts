// src/types/panopticron.ts

// Describes a single entry in the project's priority history
export interface ProjectPriorityHistoryEntry {
    timestamp: string; // ISO date string
    final_priority_sort_key: number | null;
    calculated_priority_score: number | null;
    manual_override_value_at_event: number | null;
    reason_for_change: string | null;
  }
  
  // You can add other custom types here as your application grows