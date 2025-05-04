import { supabase } from "@/lib/supabase";
import { AppErrorCodes } from "@/types/AppModels";
import { EditProfileFormType } from "@/types/FormModels";
import { decode } from "@/utils/helpers";
import * as FileSystem from "expo-file-system";

export const deleteProfilePicture = async (url: string) => {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!url || !sessionData.session?.user.id) return;

  const fileName = url.split("/").pop()?.split("?")[0];
  if (!fileName) return;

  const userIdFromFileName = fileName.split("_")[0];
  if (userIdFromFileName !== sessionData.session.user.id) return;

  if (url.includes("profile-pictures")) {
    await supabase.storage.from("profile-pictures").remove([fileName]);
  }
};

export const updateUser = async ({
  data: formData,
}: {
  data: EditProfileFormType;
}) => {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session?.user.id) return { user: null };

  const { data: currentUser } = await supabase
    .from("users")
    .select("profile_picture")
    .eq("id", sessionData.session.user.id)
    .single();

  let profilePictureUrl = formData.profile_picture;

  if (
    formData.profile_picture &&
    formData.profile_picture.startsWith("file://")
  ) {
    if (currentUser?.profile_picture) {
      await deleteProfilePicture(currentUser.profile_picture);
    }

    const fileInfo = await FileSystem.getInfoAsync(formData.profile_picture, {
      size: true,
    });
    if (!fileInfo.exists) {
      throw AppErrorCodes.FILE_NOT_FOUND;
    }

    if (fileInfo.size && fileInfo.size > 25 * 1024 * 1024) {
      throw AppErrorCodes.FILE_TOO_LARGE;
    }

    const base64 = await FileSystem.readAsStringAsync(
      formData.profile_picture,
      {
        encoding: FileSystem.EncodingType.Base64,
      }
    );

    const fileExtension = formData.profile_picture.split(".").pop();
    const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!fileExtension || !allowedExtensions.includes(fileExtension.toLowerCase())) {
      throw AppErrorCodes.INVALID_FILE_TYPE;
    }
    const fileName = `${sessionData.session.user.id}_${Date.now()}.${fileExtension}`;

    await supabase.storage
      .from("profile-pictures")
      .upload(fileName, decode(base64), {
        contentType: `image/${fileExtension}`,
        upsert: true,
      });

    const {
      data: { publicUrl },
    } = supabase.storage.from("profile-pictures").getPublicUrl(fileName);

    profilePictureUrl = publicUrl;
  }

  const { data, error } = await supabase
    .from("users")
    .update({
      ...formData,
      profile_picture: profilePictureUrl,
      notifications: formData.notifications,
    })
    .eq("id", sessionData.session.user.id);

  if (error) throw AppErrorCodes.UPDATE_USER_FAILED;
  return data;
};

export const deleteUser = async () => {
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session?.user.id) return { user: null };

  const { data: currentUser } = await supabase
    .from("users")
    .select("profile_picture")
    .eq("id", sessionData.session.user.id)
    .single();

  await deleteProfilePicture(currentUser?.profile_picture);

  const { error } = await supabase.auth.admin.deleteUser(
    sessionData.session.user.id
  );
  if (error) throw AppErrorCodes.DELETE_USER_FAILED;
  return { user: null };
};
