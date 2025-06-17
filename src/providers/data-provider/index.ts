// src/providers/data-provider/index.ts
import { dataProvider as dataProviderSupabase } from "@refinedev/supabase";
import { supabaseBrowserClient } from "@utils/supabase/client";
import { mockDataProvider } from "@providers/mock-data-provider";
import { DEMO_CONFIG, shouldUseMockData } from "@/demo-config";

// Use mock data provider in demo mode, otherwise use Supabase
export const dataProvider = shouldUseMockData()
  ? mockDataProvider
  : dataProviderSupabase(supabaseBrowserClient);
