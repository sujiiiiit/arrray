"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input-password"; // ✅ Fixed import
import Link from "next/link";

const Page = () => {
  return <KeyForm />;
};


const formSchema = z.object({
  name_6890500917: z.string().min(1).optional(),
});

const KeyForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2 rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full max-w-xl px-3 sm:px-6"
      >
        <FormField
          control={form.control}
          name="name_6890500917"
          render={({ field }) => (
            <FormItem>
              <FormLabel>GOOGLE_API_KEY</FormLabel>
              <FormControl>
                <Input placeholder="XXXXXXXXXXXXX..." type="text" {...field} />
              </FormControl>
              <FormDescription>
                Get your Google API key from{" "}
                <Link
                  target="_blank"
                  href="https://aistudio.google.com/apikey"
                  className="text-blue-500 hover:underline" // ✅ Fixed class
                >
                  here
                </Link>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default Page;

