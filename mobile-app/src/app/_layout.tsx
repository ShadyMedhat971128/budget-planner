import { Stack } from "expo-router";
import "../../global.css";
import { useEffect } from "react";
import useAuthStore from "@/store/auth-store"; 
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function RootLayout() {

  const {isLoading , initialize} = useAuthStore();

  // to init the auth state
  useEffect(()=>{
    initialize();
  },[])

  if (isLoading)
  {
    return (
      <SafeAreaView className="flex-1 items-center justify-center">
            <Text>
                Loading ...
            </Text>
      </SafeAreaView>
    )
  }
    return <Stack screenOptions={{ headerShown: false }}/>;
}
