import { useMatches } from "@remix-run/react";
import type { Chunk } from '~/utils/types';

export function useChunks(): Chunk[] {
  const matches = useMatches();
  const rootData = matches.find(m => m.id === "root")?.data;
  return rootData?.chunks || [];
}
