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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import FileUploader from "../shared/FileUploader";
import { EditPostValidation } from "@/lib/validation";
import { Models } from "appwrite";
// import { useUpdateGame } from "@/lib/react-query/queriesAndMutations";
// import { useUserContext } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Loader from "../shared/Loader";
import { useUpdateOwnGame } from "@/lib/react-query/queriesAndMutations";

type GameFormProps = {
  game?: Models.Document;
};

const EditPost = ({ game }: GameFormProps) => {
  const { mutateAsync: updateGame, isPending: isLoadingUpdate } =
    useUpdateOwnGame();

  // const { user } = useUserContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  // 1. Define your form.
  const form = useForm<z.infer<typeof EditPostValidation>>({
    resolver: zodResolver(EditPostValidation),
    defaultValues: {
      title: game?.game.title || "",
      description: game?.game.description || "",
      file: game?.game.imageUrl,
      State: game?.State || "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof EditPostValidation>) {
    if (game) {
      const updatedPost = await updateGame({
        ...values,
        gameId: game.$id,
        imageId: game?.game.imageId,
        imageUrl: game?.game.imageUrl,
        State: values.State,
      });

      if (!updatedPost) {
        return toast({
          title: "Failed to update game",
        });
      }

      return navigate(`/ownGames/${game.$id}`);
    }

    // const newGame = await createGame({
    //   ...values,
    //   userId: user?.id,
    // });
    // if (!newGame) {
    //   return toast({
    //     title: "Failed to create game",
    //   });
    // }

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
                  disabled
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
                  disabled
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
              <FormControl>
                <FileUploader
                  fieldChange={field.onChange}
                  mediaUrl={game?.game.imageUrl}
                  disabled={true}
                />
              </FormControl>
              <FormMessage className="shad-form_message" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="State"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shad-form_label">State</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full border border-dark-4">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="saved">Saved</SelectItem>
                  <SelectItem value="playing">Playing</SelectItem>
                  <SelectItem value="finished">Finished</SelectItem>
                </SelectContent>
              </Select>
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
            disabled={isLoadingUpdate}
          >
            {isLoadingUpdate && <Loader />}
            Update Game
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default EditPost;
