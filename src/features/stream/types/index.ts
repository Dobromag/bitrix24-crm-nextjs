export type StreamStatus = "live" | "offline" | "scheduled" | "ended";

export interface StreamStats {
  activeOrders: number;
  onlineEmployees: number;
  viewers: number;
}

export interface StreamData {
  title: string;
  description: string;
  status: StreamStatus;
  thumbnailUrl: string;
  streamUrl?: string;
  stats: StreamStats;
  startedAt?: string;
}
