"use client";
import React from "react";
import { idProps } from "@/app/notes/[id]/page";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import {
  CreateQuestionSchema,
  createQuestionSchema,
} from "@/lib/validation/note";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Eye, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import LoadingButton from "./ui/loading-button";
import toast from "react-hot-toast";
type FormValues = {
  id: number;
  questionTitle: string;
  choices: {
    content: string;
    answer: boolean;
  }[];
};
const CreateQuestion = ({ params }: idProps) => {
  const { id } = params;
  const router = useRouter();
  const {
    register,
    reset,
    formState: { errors },
    handleSubmit,
    watch,
    control,
  } = useForm<FormValues>({
    defaultValues: {
      questionTitle: "",
      choices: [{ content: "", answer: false }],
    },
  });
  const { fields, append, prepend, remove } = useFieldArray({
    name: "choices",
    control,
    rules: {
      required: "Please append at least 1 choice",
    },
  });

  const form = useForm<CreateQuestionSchema>({
    resolver: zodResolver(createQuestionSchema),
    defaultValues: {
      questionTitle: "",
      choices: [
        {
          content: "",
          answer: false,
        },
      ],
    },
  });

  async function onSubmit(data: CreateQuestionSchema) {
    // alert(JSON.stringify(data));
    try {
      const response = await fetch("/api/notes", {
        method: "PUT",
        body: JSON.stringify({
          id: Number(id),
          questions: [{ ...data }],
        }),
      });
      toast.success("You have submitted this question");
      reset();
      router.refresh();
      if (!response.ok) throw Error("Status code: " + response.status);
    } catch (error) {
      console.error(error);
      toast.error("Something went wront. Please try again .");
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create A New Question</CardTitle>
        <CardDescription>
          Create your next question in one-click. Click Submit when you
          finish!!!
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <CardContent>
            <FormField
              control={form.control}
              name="questionTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Input your question"
                      {...register(`questionTitle`, {
                        required: true,
                      })}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="choices"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Choices</FormLabel>
                  {fields.map((field, index) => {
                    return (
                      <section
                        key={field.id}
                        className="my-4 flex items-end space-x-2"
                      >
                        <label className="flex w-full flex-col">
                          <span>choice {index + 1}</span>
                          <Input
                            {...register(`choices.${index}.content`, {
                              required: true,
                            })}
                          />
                        </label>
                        <label className="flex flex-col items-center justify-center">
                          <Input
                            type="checkbox"
                            className="relative "
                            defaultChecked={false}
                            {...register(`choices.${index}.answer`)}
                          />
                        </label>
                        <Trash2
                          type="button"
                          size={15}
                          className="mb-3 scale-105 text-red-500"
                          onClick={() => remove(index)}
                        />
                      </section>
                    );
                  })}
                  <FormMessage />
                </FormItem>
              )}
            />
            <button
              type="button"
              className="mt-4 flex h-10 w-10 items-center justify-center rounded-full bg-teal-400 text-white shadow-sm hover:opacity-95"
              onClick={() => {
                append({
                  content: "",
                  answer: false,
                });
              }}
            >
              <Plus />
            </button>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                router.back();
              }}
            >
              Cancel
            </Button>
            <div className="flex gap-2">
              <LoadingButton
                className="via-green-700"
                type="submit"
                loading={form.formState.isSubmitting}
              >
                Next
              </LoadingButton>
              <Button
                type="button"
                onClick={() => router.push(`/notes/${id}/review`)}
              >
                <Eye size={20} />
              </Button>
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default CreateQuestion;
