import { UserType } from "@/types/user";
import CloseSettings from "../CloseSettings";
import { useForm } from "react-hook-form";
import { userProfileSchema } from "@/lib/validations/userProfile";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import PrimaryButton from "../buttons/PrimaryButton";
import EditAvatarModal from "../modals/user-settings/EditAvatarModal";
import { ChangeEvent, useState } from "react";
import { toBase64 } from "@/utils/helpers/toBase64";
import ProfilePreview from "./ProfilePreview";
import { updateProfile } from "@/lib/actions/settings/updateProfile";
import { getUser } from "@/lib/db/getUser";

type UserProfileProps = {
  user: UserType;
  onClose: () => void;
  handleUserUpdate: (updatedUser: UserType) => void;
};

const UserProfile = ({ user, onClose, handleUserUpdate }: UserProfileProps) => {
  const form = useForm<z.infer<typeof userProfileSchema>>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: { displayName: user.displayName, avatar: null },
  });

  const [previewImage, setPreviewImage] = useState<string | null>(user.avatar);

  const onSubmit = async (data: z.infer<typeof userProfileSchema>) => {
    const form = new FormData();
    form.append("displayName", data.displayName || user.username);
    if (data.avatar) {
      form.append("file", data.avatar);
    }
    const updatedDoc = await updateProfile(form, user.id, previewImage == null);

    if (updatedDoc) {
      const fetchedUser = await getUser(user?.id);
      if (fetchedUser) {
        handleUserUpdate(fetchedUser);
      }
    }
  };

  const onAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) {
      console.log(`file ${e.target.files} is empty`);
      return;
    }

    const file = e.target.files[0];

    try {
      const result = (await toBase64(file)) as string;
      setPreviewImage(result);
      form.setValue("avatar", file);
    } catch (err) {
      console.error(err);
    }
  };

  const formState = form.watch();

  return (
    <div
      className="px-10 pb-20 pt-[60px] min-w-[460px] min-h-full flex gap-10"
      role="tabpanel"
    >
      <div className="flex-grow">
        <h2 className="mb-5 text-header-primary text-xl leading-6 font-semibold">
          Profiles
        </h2>
        <div className="flex gap-[35px]">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex gap-[35px]"
            >
              <div className="flex-grow">
                <div className="mb-6 pb-6 border-b-background-modifier-accent border-[1px] border-transparent">
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="font-bold uppercase tracking-wide text-xs text-header-secondary truncate">
                          Display Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            {...field}
                            maxLength={32}
                            className="h-10 bg-input-background text-md rounded-sm placeholder:text-text-normal/50 placeholder:font-medium"
                            placeholder={user.username}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mb-6 pb-6">
                  <h3 className="text-xs font-bold uppercase text-header-secondary tracking-wide truncate mb-2">
                    Avatar
                  </h3>
                  <div className="flex gap-1">
                    <EditAvatarModal onAvatarChange={onAvatarChange}>
                      <PrimaryButton>Change Avatar</PrimaryButton>
                    </EditAvatarModal>
                    <button
                      type="button"
                      className="text-sm leading-4 hover:underline h-8 min-w-[60px] min-h-[32px] py-0.5 px-4"
                      onClick={() => {
                        form.setValue("avatar", null);
                        setPreviewImage(null);
                      }}
                    >
                      Remove Avatar
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-status-positive-background hover:bg-status-positive-background-hover active:bg-status-positive-background-active px-4 py-1 text-sm h-8 min-w-[60px] min-h-[32px] transition duration-200"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </Form>
          <ProfilePreview
            user={user}
            formState={formState}
            previewImage={previewImage}
          />
        </div>
      </div>
      <div className="mr-10 w-[60px] shrink-0">
        <CloseSettings onClose={onClose} />
      </div>
    </div>
  );
};

export default UserProfile;
