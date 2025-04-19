import { useLoggedIn } from "~/hooks/useLoggedIn";

export default function LoggedIn({
  children,
  fallback = null,
}: {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const loggedIn = useLoggedIn();

  return loggedIn ? <>{children}</> : <>{fallback}</>;
}
