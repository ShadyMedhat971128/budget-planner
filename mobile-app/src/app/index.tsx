import { Redirect } from "expo-router";
import useAuthStore from "@/store/auth-store";

export default function Index() {
  const session = useAuthStore((state) => state.session);

  if (session) return <Redirect href="/(protected)" />;

  return <Redirect href="/(auth)/sign-in" />;
}
