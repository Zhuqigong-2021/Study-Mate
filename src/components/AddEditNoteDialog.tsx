import { CreateNoteSchema, createNoteSchema } from "@/lib/validation/note";
import { Note } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import LoadingButton from "./ui/loading-button";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import Link from "next/link";

interface AddEditNoteDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  noteToEdit?: Note;
}
export default function AddEditNoteDialog({
  open,
  setOpen,
  noteToEdit,
}: AddEditNoteDialogProps) {
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const router = useRouter();
  const form = useForm<CreateNoteSchema>({
    resolver: zodResolver(createNoteSchema),
    defaultValues: {
      title: noteToEdit?.title || "",
      description: noteToEdit?.description || "",
    },
  });

  async function deleteNote() {
    if (!noteToEdit) return;
    try {
      const response = await fetch("/api/notes", {
        method: "DELETE",
        body: JSON.stringify({ id: noteToEdit.userId }),
      });
      if (!response.ok) throw Error("Status code:" + response.status);
      setOpen(false);
      toast.success("You have just delted a note!");
    } catch (error) {
      toast.error("something went wrong. Please try again");
    } finally {
      setDeleteInProgress(false);
    }
  }

  async function onSubmit(input: CreateNoteSchema) {
    try {
      if (noteToEdit) {
        const response = await fetch("/api/notes", {
          method: "PUT",
          body: JSON.stringify({ id: noteToEdit.id, ...input }),
        });
        if (!response.ok) {
          throw Error("Status code:" + response.status + "edit");
        }
        router.push(`/notes/${noteToEdit.id}`);
      } else {
        const response = await fetch("/api/notes", {
          method: "POST",
          body: JSON.stringify(input),
        });
        if (!response.ok) {
          throw Error("Status code:" + response.status + "post");
        }
        form.reset();
      }
      router.refresh();
      setOpen(false);
    } catch (error) {
      toast("something went wrong. Please  try again");
    }
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{noteToEdit ? "Edit Note" : "Add Note"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
                    <Input placeholder="Note description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-1 sm:gap-0">
              {noteToEdit && (
                <LoadingButton
                  variant="destructive"
                  loading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={deleteNote}
                  type="button"
                >
                  Delete note
                </LoadingButton>
              )}
              {noteToEdit && (
                <Button asChild variant="outline">
                  <Link href={`/notes/${noteToEdit.id}/review`}>Review</Link>
                </Button>
              )}
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
                disabled={deleteInProgress}
              >
                {noteToEdit ? "Update" : "Submit"}
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
