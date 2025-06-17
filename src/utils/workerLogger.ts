// src/utils/workerLogger.ts
import type { SupabaseClient } from "@supabase/supabase-js";

export interface WorkerRunLog {
  id: string;
  // Add other fields if you need to pass them around, but id is key
}

export class WorkerLogger {
  private supabaseAdmin: SupabaseClient;
  private workerName: string;
  private currentRunId: string | null = null;

  constructor(supabaseAdmin: SupabaseClient, workerName: string) {
    if (!supabaseAdmin) {
      throw new Error(
        `WorkerLogger: Supabase client cannot be null for worker ${workerName}`
      );
    }
    this.supabaseAdmin = supabaseAdmin;
    this.workerName = workerName;
  }

  async startRun(): Promise<string | null> {
    try {
      const { data, error } = await this.supabaseAdmin
        .from("worker_runs")
        .insert({ worker_name: this.workerName, status: "Started" })
        .select("id")
        .single();

      if (error || !data) {
        console.error(
          `WORKER_LOG (${this.workerName}): Failed to log start of run:`,
          error
        );
        this.currentRunId = null;
        return null;
      }
      this.currentRunId = data.id;
      console.log(
        `WORKER_LOG (${this.workerName}): Run started. ID: ${this.currentRunId}`
      );
      return this.currentRunId;
    } catch (e: any) {
      console.error(
        `WORKER_LOG (${this.workerName}): Exception during startRun:`,
        e.message
      );
      this.currentRunId = null;
      return null;
    }
  }

  async finishRun(
    status: "Success" | "Partial Success" | "Failure" | "No Action Needed",
    summaryMessage: string,
    errorDetails?: { message: string; stack?: string; [key: string]: any }
  ): Promise<void> {
    if (!this.currentRunId) {
      console.warn(
        `WORKER_LOG (${this.workerName}): No currentRunId to finish. Attempting to log final status without ID.`
      );
      // Attempt to insert a new record if startRun failed to get an ID
      try {
        await this.supabaseAdmin.from("worker_runs").insert({
          worker_name: this.workerName,
          status,
          summary_message: summaryMessage,
          error_details: errorDetails || null,
          started_at: new Date().toISOString(), // Best guess for start
          ended_at: new Date().toISOString(),
        });
        console.log(
          `WORKER_LOG (${this.workerName}): Final status logged without initial run ID.`
        );
      } catch (e: any) {
        console.error(
          `WORKER_LOG (${this.workerName}): Exception during fallback finishRun logging:`,
          e.message
        );
      }
      return;
    }

    try {
      const updatePayload: any = {
        ended_at: new Date().toISOString(),
        status,
        summary_message: summaryMessage,
      };
      if (errorDetails) {
        updatePayload.error_details = errorDetails;
      }

      const { error } = await this.supabaseAdmin
        .from("worker_runs")
        .update(updatePayload)
        .eq("id", this.currentRunId);

      if (error) {
        console.error(
          `WORKER_LOG (${this.workerName}): Failed to update end of run ${this.currentRunId}:`,
          error
        );
      } else {
        console.log(
          `WORKER_LOG (${this.workerName}): Run ${this.currentRunId} finished. Status: ${status}. Summary: ${summaryMessage}`
        );
      }
    } catch (e: any) {
      console.error(
        `WORKER_LOG (${this.workerName}): Exception during finishRun for ${this.currentRunId}:`,
        e.message
      );
    } finally {
      this.currentRunId = null; // Reset for potential next run in same instance (though unlikely for serverless)
    }
  }
}
