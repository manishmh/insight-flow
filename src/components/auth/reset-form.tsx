"use client";

import { reset } from "@/actions/reset";
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
import { resetSchema } from "@/schemas/input-validation";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const ResetForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const form = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (values: z.infer<typeof resetSchema>) => {
    startTransition(async () => {
      try {
        const data = await reset(values);
        const { success, message } = data;

        if (!success) {
          toast.error(message);
          console.error(message);
        } else if (success) {
          toast.success(message)
          form.reset();
          router.push("/auth/login");
        }
      } catch (error: any) {
          console.error(error);
        console.error(error);
      }
    });
    console.log(values)
  };

  return (
    <div className="flex flex-col items-center justify-center sm:h-screen sm:bg-[#5865F2]">
      <div className="flex flex-col gap-3 items-center justify-center px-2 w-full sm:max-w-lg rounded-lg sm:bg-[#313338] py-12 sm:py-8">
        <h1 className="font-bold text-xl">Forgot your password?</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full items-center max-w-md"
          >
            <div className="space-y-3 w-full">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-gray-500">
                      Email
                      <span className="text-red-500"> *</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        type="email"
                        placeholder="manish@gmail.com"
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
                className="bg-[#2a3a5e] hover:bg-[#344774] w-full font-semibold text-white transition-colors duration-300"
              >
                Send reset email
              </Button>
            </div>
          </form>
        </Form>
        <Button className="max-w-md" disabled={isPending}>
          <Link href={"/auth/login"} className="text-blue-500 mt-3 font-medium text-sm flex gap-1 self-start">
              Back to login
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ResetForm;
