import { Stack , Tabs } from "expo-router";
import { Text } from "react-native";
export default function ProtectedLayout() {
  return <Tabs screenOptions={{ headerShown: false }}>
    <Tabs.Screen name="index" 
        options={{ title: "Home" ,
        tabBarIcon: () => <Text>🏠</Text> }} />
    <Tabs.Screen name="cards" 
        options={{ title: "Cards" ,
        tabBarIcon: () => <Text>💳</Text> }} />
    <Tabs.Screen name="analysis" 
        options={{ title: "Analysis" , 
        tabBarIcon: () => <Text>📊</Text> }} />
    <Tabs.Screen name="profile" 
        options={{ title: "Profile" , 
        tabBarIcon: () => <Text>👤</Text> }} />

  </Tabs>;
}
