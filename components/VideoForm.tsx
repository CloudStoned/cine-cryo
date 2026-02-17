"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100, "Title cannot exceed 100 characters"),
  video_link: z.string().url("Please enter a valid URL").max(200, "Link is too long"),
  sheet_name: z.enum(["Links", "Prompts", "Projects"]),
});

const sheetOptions = [
  { value: "Links", label: "links" },
  { value: "Prompts", label: "prompts" },
  { value: "Projects", label: "projects" },
];

export function VideoForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      video_link: "",
      sheet_name: "Links",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    const loadingToast = toast.loading("Submitting Video...", {
      position: "bottom-right",
    });

    try {
      const res = await fetch("/api/sheetHandler", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to submit video");
      }

      toast.success("Video Submitted!", {
        id: loadingToast,
        description: "Your video was saved successfully!",
        position: "bottom-right",
      });
    } catch (error: any) {
      toast.error(error.message || "Something went wrong", {
        id: loadingToast,
        position: "bottom-right",
      });
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Upload Video</CardTitle>
        <CardDescription>Uploaded video will be saved to google sheet</CardDescription>
      </CardHeader>

      <CardContent>
        <form id="submit-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="title">Video Title</FieldLabel>
                  <Input {...field} id="title" placeholder="Coding" aria-invalid={fieldState.invalid} />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="video_link"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="video_link">Link</FieldLabel>
                  <Input
                    {...field}
                    id="video_link"
                    placeholder="https://example.com/video"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            <Controller
              name="sheet_name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="w-52">
                  <FieldLabel htmlFor="sheet_name">Target Sheet</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select a sheet" />
                    </SelectTrigger>
                    <SelectContent>
                      {sheetOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <Field orientation="horizontal">
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="submit-form">
            Submit
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
