import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { PostValidation } from "@/lib/validation";
import { Models } from "appwrite";
import {
  useCreateGame,
  useUpdateGame,
} from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../shared/Loader";

type PostFormProps = {
  game?: Models.Document;
  action: "Create" | "Update";
};

const PostForm = ({ game, action }: PostFormProps) => {
  const { mutateAsync: createGame, isPending: isLoadingCreate } =
    useCreateGame();
  const { mutateAsync: updateGame, isPending: isLoadingUpdate } =
    useUpdateGame();

  const { user } = useUserContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  // 1. Define your form.
  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),
    defaultValues: {
      title: game?.title || "",
      description: game?.description || "",
      file: [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof PostValidation>) {
    if (game && action === "Update") {
      const updatedPost = await updateGame({
        ...values,
        gameId: game.$id,
        imageId: game?.imageId,
        imageUrl: game?.imageUrl,
      });

      if (!updatedPost) {
        return toast({
          title: "Failed to update game",
        });
      }

      return navigate(`/games/${game.$id}`);
    }

    const newGame = await createGame({
      ...values,
      userId: user?.id,
    });
    if (!newGame) {
      return toast({
        title: "Failed to create game",
      });
    }

    navigate("/");
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-9 w-full max-w-5xl"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="God of War"
                  {...field}
                  className="shad-input custom-scrollbar"
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Action, adventure game ..."
                  className="shad-textarea"
                  {...field}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">Add Image</FormLabel>
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={game?.imageUrl}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
          <Button
            type="button"
            className="shad-button_dark_4"
            onClick={() => navigate("/")}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="shad-button_primary whitespace-nowrap"
            disabled={isLoadingCreate || isLoadingUpdate}
          >
            {isLoadingCreate || (isLoadingUpdate && <Loader />)}
            {action} Game
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
