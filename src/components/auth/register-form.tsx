"use client";

import { register } from "@/actions/register";
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
import { registerSchema } from "@/schemas/input-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { FaExclamationTriangle } from "react-icons/fa";
import * as z from "zod";
import Socials from "./socials";
import { toast } from "sonner";

const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const searchParam = useSearchParams();
  const urlError =
    searchParam.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with different provider"
      : "";

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof registerSchema>) => {
    startTransition(async () => {
      try {
        const res = await register(values);
        const { success, message } = res;

        if (!success) {
          toast.error(message)
          console.error(message);
        }

        if (success) {
          toast.success(message)
          form.reset();
        }
      } catch (error: any) {
        toast.error(error)
        console.error(error);
      }
    });
  };

  return (
    <div className="flex flex-col gap-3 items-center justify-center sm:h-screen ">
      <div
        className={`flex flex-col gap-3 items-center justify-center px-2 w-full sm:max-w-lg rounded-lg bg-white shadow-2xl dark:sm:bg-[#141517] py-12 sm:py-8 ${
          isPending ? "pointer-events-none opacity-80" : "pointer-events-auto"
        } `}
      >
        <h1 className="font-bold text-2xl">Create an account</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full gap-3 items-center max-w-md"
          >
            <div className="space-y-3 w-full">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-500 dark:text-gray-300">
                      Name
                      <span className="text-red-500"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="text"
                        placeholder="Your name"
                        className="mt-1.5 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 bg-primary-input border-none"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-500 dark:text-gray-300">
                      Email
                      <span className="text-red-500"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="email"
                        placeholder="manish@gmail.com"
                        className="mt-1.5 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 bg-primary-input border-none"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-500 dark:text-gray-300">
                      Password
                      <span className="text-red-500"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="password"
                        placeholder="********"
                        className="mt-1.5 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 bg-primary-input border-none"
                      />
                    </FormControl>
                    <FormMessage className="text-red-400 text-xs" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isPending}
                className="bg-gray-500 dark:bg-gray-200 text-white dark:text-black dark:hover:bg-white w-full font-semibold "
              >
                Register
              </Button>
            </div>
          </form>
        </Form>
        <div className="w-full sm:px-6">
          <Socials disabled={isPending} />
        </div>
        <Link href={"/auth/login"}>
          <div className="text-blue-500 mt-3 font-medium text-sm flex gap-1 self-start">
            Already have an account ?
            <span className="text-blue-500">Login</span>
          </div>
        </Link>
        {urlError && (
          <div className="text-red-600 bg-red-200 mt-4 rounded-md py-3 px-4 flex gap-4 items-center text-sm">
            <FaExclamationTriangle />
            {urlError}
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterForm;
