"use client";

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
import { newPasswordSchema } from "@/schemas/input-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import NewPassoword from "@/actions/new-password";
import { toast } from "sonner";

const NewPasswordForm = () => {
  const [isPending, startTransition] = useTransition();
  const searchParam = useSearchParams();
  const token = searchParam.get('token');

  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: z.infer<typeof newPasswordSchema>) => {
    startTransition(async () => {
      try {
        const data = await NewPassoword(values, token);
        const { success, message } = data;

        if (!success) {
          toast.error(message)
          console.error(message);
        } else if (success) {
          toast.success(message)
          form.reset();
        }
      } catch (error: any) {
        console.error(error);
        toast.error(error)
      }
    });
  };

  return (
    <div className="flex flex-col items-center justify-center sm:h-screen ">
      <div
        className={`flex flex-col gap-3 items-center justify-center px-2 w-full sm:border border-gray-300 sm:shadow-md sm:max-w-lg rounded-lg  py-12 sm:py-8 ${
          isPending ? "pointer-events-none opacity-80" : "pointer-events-auto"
        } `}
      >
        <h1 className="font-bold text-2xl">Welcome back!</h1>
        <h2 className="text-gray-400 font-medium">
          We&apos; so excited to see you again!
        </h2>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full items-center max-w-md"
          >
            <div className="space-y-3 w-full">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-400">
                      Password
                      <span className="text-red-500"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="password"
                        placeholder="********"
                        className="mt-1.5 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 bg-primary-input"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-400">
                      Confirm password
                      <span className="text-red-500"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="password"
                        placeholder="********"
                        className="mt-1.5 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 bg-primary-input"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isPending}
                className="bg-gray-200 w-full font-semibold text-black hover:bg-white transition-colors duration-300"
              >
                Reset password
              </Button>
            </div>
          </form>
        </Form>
        <Button className="max-w-md" disabled={isPending}>
          <Link
            href={"/auth/login"}
            className="text-blue-500 mt-3 font-medium text-sm flex gap-1 self-start"
          >
            Back to login page
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NewPasswordForm;
