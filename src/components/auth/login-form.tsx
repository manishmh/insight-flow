"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { signIn } from 'next-auth/react'
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import { loginSchema } from "@/schemas/input-validation";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { login } from "@/actions/login";

const LoginForm = () => {
  const [error, setError] =  useState("");
  const [success, setSuccess] =  useState("");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast()

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

   const onSubmit = (values: z.infer<typeof loginSchema>) => {
    startTransition(() => {
      login(values)
        .then((data) => {
          if (data.error) {
            toast({ title: "Login Error", description: data.error});
          } else if (data.success) {
            toast({ title: "Logged in Successfully", description: data.success});
          }
        })
    })
   }

   return (
    <div className="flex flex-col gap-3 items-center justify-center sm:h-screen sm:bg-[#5865F2]">
      <div className="flex flex-col gap-3 items-center justify-center px-2 w-full sm:max-w-lg rounded-lg sm:bg-[#313338] py-12 sm:py-8">
        <h1 className="font-bold text-2xl">Welcome back!</h1>
        <h2 className="text-gray-400 font-medium">
          We&apos; so excited to see you again!
        </h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-full gap-3 items-center max-w-md">
            <div className="space-y-3 w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-300">
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
                    <FormMessage className="text-red-400 text-xs"/>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-300">
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
                    <FormMessage className="text-red-400 text-xs"/>
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={isPending}
                className="bg-gray-200 w-full font-semibold text-black"
              >
                Login
              </Button>
              <Link href={'/auth/register'}>
                <div className="text-blue-500 mt-3 font-medium text-sm flex gap-1 self-start">
                  Need an account ?
                  <span className="text-blue-500">Register</span>
                </div>
              </Link>
            </div>
          </form>
        </Form> 
      </div>
    </div>
  );
}

export default LoginForm