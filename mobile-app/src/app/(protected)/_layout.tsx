import { Tabs, Redirect } from "expo-router";
import { Text } from "react-native";
import useAuthStore from "@/store/auth-store";

export default function ProtectedLayout() {
  const session = useAuthStore((state) => state.session);

  if (!session) return <Redirect href="/(auth)/sign-in" />;

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => <Text>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="cards"
        options={{
          title: "Cards",
          tabBarIcon: () => <Text>💳</Text>,
        }}
      />
      <Tabs.Screen
        name="analysis"
        options={{
          title: "Analysis",
          tabBarIcon: () => <Text>📊</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: () => <Text>👤</Text>,
        }}
      />
    </Tabs>
  );
}
