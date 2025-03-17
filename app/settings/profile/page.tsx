"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
const Page = () => {
  return (
    <>
      <div className="w-full sm:max-w-xs sm:order-2 flex items-start justify-center   ">
        <Image
          alt="profile picture"
          src={"https://avatars.githubusercontent.com/u/159754157?v=4"}
          width={144}
          height={144}
          className="rounded-full bg-accent border-2 border-light sm:w-36 sm:h-36 h-24 w-24"
        />
      </div>
      <MyForm />
    </>
  );
};

export default Page;

const formSchema = z.object({
  name_2448424455: z.string().min(1).min(3).max(255).optional(),
  name_8032755122: z.string().min(1).min(3).optional(),
  name_4738375018: z.string().optional(),
  name_9416757953: z.string().optional(),
});

export function MyForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values);
      toast(
        <pre className="mt-2  rounded-md p-4">
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
        className="space-y-8 max-w-xl sm:px-6 px-3   w-full "
      >
        <FormField
          control={form.control}
          name="name_2448424455"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="John" disabled type="text" {...field} />
              </FormControl>
              <FormDescription>
                Your name on github will be displayed here.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name_8032755122"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  placeholder="sujiiiiit"
                  disabled
                  type="text"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Your github username will be displayed here
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name_4738375018"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="name@example.com"
                  disabled
                  type="email"
                  {...field}
                />
              </FormControl>
              <FormDescription>Its private.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name_9416757953"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Placeholder"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                You can @mention other users and organizations.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
