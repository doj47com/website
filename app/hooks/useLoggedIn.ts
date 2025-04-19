import { useMatches } from "@remix-run/react";

export function useLoggedIn(): boolean {
  const matches = useMatches();
  const rootData = matches.find(m => m.id === "root")?.data;
  return rootData?.loggedIn === true;
}
