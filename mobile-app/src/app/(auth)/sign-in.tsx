import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import useAuthStore from "@/store/auth-store";

interface FormErrors {
  email: string;
  password: string;
  general: string;
}

export default function SignIn() {
  const { signIn } = useAuthStore();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({
    email: "",
    password: "",
    general: "",
  });

  function clearError(field: keyof FormErrors) {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  }

  function validate(): boolean {
    const newErrors: FormErrors = { email: "", password: "", general: "" };
    let valid = true;

    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  }

  async function handleSignIn() {
    setErrors({ email: "", password: "", general: "" });
    if (!validate()) return;

    setLoading(true);
    try {
      await signIn(email, password);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setErrors((prev) => ({ ...prev, general: message }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1 justify-center px-8 bg-surface">
      <Text className="text-3xl font-bold text-center text-text-primary mb-2">
        Budget Planner
      </Text>
      <Text className="text-base text-center text-text-muted mb-10">
        Sign in to manage your finances
      </Text>

      <Text className="text-sm font-medium text-text-primary mb-1">
        Email
      </Text>
      <TextInput
        className={`border rounded-lg px-4 py-3 text-text-primary ${
          errors.email ? "border-error" : "border-gray-300"
        }`}
        placeholder="your@email.com"
        placeholderTextColor="#9ca3af"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          clearError("email");
          clearError("general");
        }}
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        editable={!loading}
      />
      {errors.email ? (
        <Text className="text-error text-sm mt-1">{errors.email}</Text>
      ) : null}

      <Text className="text-sm font-medium text-text-primary mb-1 mt-5">
        Password
      </Text>
      <TextInput
        className={`border rounded-lg px-4 py-3 text-text-primary ${
          errors.password ? "border-error" : "border-gray-300"
        }`}
        placeholder="Enter your password"
        placeholderTextColor="#9ca3af"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          clearError("password");
          clearError("general");
        }}
        secureTextEntry
        autoComplete="password"
        editable={!loading}
      />
      {errors.password ? (
        <Text className="text-error text-sm mt-1">{errors.password}</Text>
      ) : null}

      {errors.general ? (
        <View className="bg-error-bg border border-error-border rounded-lg p-3 mt-6">
          <Text className="text-error text-sm">{errors.general}</Text>
        </View>
      ) : null}

      <TouchableOpacity
        className={`rounded-lg py-4 mt-6 items-center ${
          loading ? "bg-gray-300" : "bg-primary"
        }`}
        onPress={handleSignIn}
        disabled={loading}
        activeOpacity={0.8}
      >
        <Text className="text-white text-center font-bold text-lg">
          {loading ? "Signing In..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      <View className="flex-row justify-center mt-8">
        <Text className="text-text-muted">Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push("/(auth)/sign-up")}>
          <Text className="text-primary font-medium">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
