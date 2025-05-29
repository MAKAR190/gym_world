import React, { useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Title,
  Button,
  AlertDialog as DeactivateAccountDialog,
} from "@/client/components";
import { EditProfileFormType } from "@/types/FormModels";
import { EDIT_PROFILE_FORM_MODULE } from "@/utils/constants";
import { auth } from "@/client/hooks";
import { AppErrorCodes, RootStackParamList } from "@/types/AppModels";
import Loading from "../App/Loading";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { deleteUser, updateUser } from "@/server/services/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleError } from "@/utils/helpers";
import EditProfileForm from "@/client/components/Profile/EditProfileForm";

const EditProfile = () => {
  const { user, isLoading } = auth.useSession();
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const queryClient = useQueryClient();
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);

  const { mutate: updateUserMutation, isPending: isUpdatingUser } = useMutation(
    {
      mutationFn: updateUser,
    }
  );

  const { mutate: deleteUserMutation, isPending: isDeletingUser } = useMutation(
    {
      mutationFn: deleteUser,
      onSuccess: () => {
        handleSignOut();
      },
    }
  );

  const { mutate: refreshSessionMutation, isPending: isRefreshingSession } =
    auth.useRefreshSession();

  const { mutate: signOutMutation, isPending: isSigningOut } =
    auth.useSignOut();

  const handleUpdateUser = (data: EditProfileFormType) => {
    updateUserMutation(
      { data },
      {
        onSuccess: async () => {
          refreshSessionMutation();
          await queryClient.invalidateQueries({ queryKey: ["user"] });
          navigation.navigate("Tabs", { screen: "Profile" });
        },
        onError: (error: unknown) => {
          handleError(error as AppErrorCodes);
        },
      }
    );
  };

  const handleSignOut = () => {
    signOutMutation(undefined, {
      onError: (error: unknown) => {
        handleError(error as AppErrorCodes);
      },
    });
  };

  if (
    isLoading ||
    !user ||
    isUpdatingUser ||
    isDeletingUser ||
    isRefreshingSession
  ) {
    return <Loading />;
  }

  return (
    <>
      <DeactivateAccountDialog
        open={deactivateDialogOpen}
        setOpen={setDeactivateDialogOpen}
        title="Deactivate Account"
        description="Are you sure you want to deactivate your account? All of your data will be permanently removed from our servers forever. This action cannot be undone."
        confirmText="Deactivate"
        onConfirm={() => deleteUserMutation()}
      />
      <ScrollView className="p-4 space-y-12 bg-background w-full">
        <View className="mt-10 pb-12 w-full">
          <MaterialIcons
            name="arrow-back-ios"
            size={24}
            color="black"
            style={{ marginBottom: 15 }}
            onPress={() => navigation.goBack()}
          />
          <Title variant="extra-large">Profile Information</Title>
          <Text className="mt-1 text-sm text-gray-600">
            This information will be displayed publicly so be careful what you
            share.
          </Text>
          <EditProfileForm
            defaultValues={EDIT_PROFILE_FORM_MODULE(user).defaultValues}
            validationSchema={EDIT_PROFILE_FORM_MODULE(user).validationSchema}
            onSubmit={handleUpdateUser}
          />
          <View className="w-full flex flex-col gap-4 mt-4">
            <Button
              text="Logout"
              variant="secondary"
              onPress={handleSignOut}
              disabled={isSigningOut}
            />
            <Button
              onPress={() => setDeactivateDialogOpen(true)}
              text="Delete Account"
              disabled={isDeletingUser}
              className="bg-red-500"
            />
            <Text className="text-sm text-gray-600">
              This action cannot be undone.
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default EditProfile;
