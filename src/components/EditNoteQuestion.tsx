import React from "react";
import { NoteType } from "./ReviewNoteQuestion";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogFooter } from "./ui/dialog";
import toast from "react-hot-toast";
import { UpdateNoteSchema, updateNoteSchema } from "@/lib/validation/note";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import LoadingButton from "./ui/loading-button";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "./ui/form";
import { Input } from "./ui/input";
import { Trash2 } from "lucide-react";
import { Textarea } from "./ui/textarea";
interface questionDataProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteToEdit: NoteType;
}
const EditNoteQuestion = ({ open, setOpen, noteToEdit }: questionDataProps) => {
  const router = useRouter();
  const form = useForm<NoteType>({
    resolver: zodResolver(updateNoteSchema),
    defaultValues: {
      id: Number(noteToEdit?.id),
      title: noteToEdit?.title || "",
      description: noteToEdit?.description || "",
      questions:
        noteToEdit?.questions.map((question) => ({
          id: Number(question.id) || 0,
          questionTitle: question.questionTitle || "",
          noteId: Number(question.noteId) || 0, // Set default value based on existing questionTitle
          choices: question.choices.map((choice) => ({
            id: Number(choice.id) || 0,
            content: choice.content || "",
            answer: choice.answer || false,
          })),
        })) || [],
    },
  });
  async function onSubmit(input: UpdateNoteSchema) {
    try {
      if (noteToEdit) {
        const response = await fetch("/api/notes", {
          method: "PUT",
          body: JSON.stringify({ ...input }),
        });
        if (!response.ok) {
          throw Error("Status code: " + response.status + "edit");
        }

        toast.success("A record is updated successfully");
      } else {
        const response = await fetch("/api/notes", {
          method: "POST",
          body: JSON.stringify(input),
        });
        if (!response.ok)
          throw Error("Status code: " + response.status + "post");
        form.reset();
      }

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("something went wrong. Please try again ");
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-h-screen max-w-[800px] overflow-y-scroll py-16">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-3  px-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note title</FormLabel>
                  <FormControl>
                    <Input placeholder="Note title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Note description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormLabel className="mt-4">Questions</FormLabel>
            {noteToEdit.questions.map((question, index) => (
              <FormField
                key={question.id}
                control={form.control}
                name={`questions.${index}`}
                render={({ field }) => {
                  return (
                    <FormField
                      control={form.control}
                      name={`questions.${index}.questionTitle`}
                      render={({ field }) => {
                        return (
                          <>
                            <FormItem
                              className="relative rounded-md border border-teal-600 shadow shadow-gray-500"
                              {...field}
                            >
                              <FormControl>
                                <Input
                                  placeholder="question title"
                                  {...field}
                                />
                              </FormControl>
                              {/* <Trash2
                                className="absolute -right-6 top-0 text-red-400"
                                // onClick={() => {
                                //   deleteQuestion(question.id);
                                // }}
                              /> */}
                              <FormMessage />
                            </FormItem>
                            {noteToEdit.questions[index].choices.map(
                              (choice, i: number) => {
                                return (
                                  <FormField
                                    key={choice.id}
                                    control={form.control}
                                    name={`questions.${index}.choices.${i}.content`}
                                    render={({ field }) => {
                                      return (
                                        <FormItem className="relative">
                                          <FormControl>
                                            <Input
                                              placeholder="question choice"
                                              {...field}
                                            />
                                          </FormControl>
                                          {/* <Trash2
                                            className="absolute -right-6 top-0 text-red-400"
                                            // onClick={() => {
                                            //   deleteChoice(choice.id);
                                            // }}
                                          /> */}

                                          <FormMessage />
                                        </FormItem>
                                      );
                                    }}
                                  />
                                );
                              },
                            )}
                          </>
                        );
                      }}
                    />
                  );
                }}
              />
            ))}
            {noteToEdit.questions.length === 0 && (
              <div className="font-bold text-red-500">
                You have no question for the time beiing{" "}
              </div>
            )}

            <DialogFooter className="gap-1 pt-8 sm:gap-0">
              <Button asChild className="bg-teal-600 text-white">
                <Link href={`/notes/${noteToEdit.id}`}>Add question</Link>
              </Button>
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
                // disabled={deleteInProgress}
              >
                {noteToEdit ? "Update" : "Submit"}
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditNoteQuestion;
