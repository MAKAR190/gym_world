import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";

export default function LoginScreen() {
  return (
    <ScrollView className="flex min-h-full flex-1 flex-col py-12 sm:px-6 lg:px-8">
      <View className="sm:mx-auto sm:w-full sm:max-w-md">
        <Text className="mt-6 text-center text-2xl font-bold tracking-tight text-gray-900">
          Sign in to your account
        </Text>
      </View>

      <View className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <View className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <View className="space-y-6">
            <View>
              <Text className="block text-sm font-medium text-gray-900">
                Email address
              </Text>
              <View className="mt-2">
                <TextInput
                  id="email"
                  autoComplete="email"
                  keyboardType="email-address"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
              </View>
            </View>

            <View>
              <Text className="block text-sm font-medium text-gray-900">
                Password
              </Text>
              <View className="mt-2">
                <TextInput
                  id="password"
                  secureTextEntry
                  autoComplete="current-password"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm"
                />
              </View>
            </View>

            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row gap-3">
                <Text className="text-sm text-gray-900">
                  Remember me
                </Text>
              </View>

              <TouchableOpacity>
                <Text className="text-sm font-semibold text-indigo-600">
                  Forgot password?
                </Text>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 shadow-sm"
              >
                <Text className="text-sm font-semibold text-white">
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View>
            <View className="relative mt-10">
              <View className="absolute inset-0 flex items-center">
                <View className="w-full border-t border-gray-200" />
              </View>
              <View className="relative flex justify-center">
                <Text className="bg-white px-6 text-sm font-medium text-gray-900">
                  Or continue with
                </Text>
              </View>
            </View>

            <View className="mt-6 grid grid-cols-2 gap-4">
              <TouchableOpacity
                className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 shadow-sm"
              >
                <Text className="text-sm font-semibold text-gray-900">Google</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                className="flex w-full items-center justify-center gap-3 rounded-md bg-white px-3 py-2 shadow-sm"
              >
                <Text className="text-sm font-semibold text-gray-900">GitHub</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="mt-10 flex-row justify-center">
          <Text className="text-center text-sm text-gray-500">
            Not a member?{" "}
          </Text>
          <TouchableOpacity>
            <Text className="font-semibold text-indigo-600">
              Start a 14 day free trial
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
