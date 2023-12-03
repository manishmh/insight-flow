"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginSchema } from "@/schemas/input-validation";
import { useFormik } from "formik";
import Link from "next/link";
import React, { useState } from "react";
import { TypeOf } from "zod";
import { toFormikValidationSchema } from "zod-formik-adapter";

type registerSchemaType = TypeOf<typeof loginSchema>;

const LoginForm = () => {
  const [error, setError] = useState("");

  const formik = useFormik<registerSchemaType>({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: toFormikValidationSchema(loginSchema),
    onSubmit: async (values) => {
      try {
      } catch (error) {}
    },
  });

  return (
    <div className="flex flex-col gap-3 items-center justify-center sm:h-screen">
      <div className="flex flex-col gap-3 items-center justify-center px-2 w-full sm:max-w-lg rounded-lg sm:bg-black sm:bg-opacity-20 py-12 sm:py-8">
        <h1 className="font-bold text-2xl">Welcome back!</h1>
        <h2 className="text-gray-400 font-medium">
          We&apos; so excited to see you again!
        </h2>
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col w-full gap-3 items-center max-w-md"
        >
          <div className="w-full">
            <Label htmlFor="email" className="font-semibold text-gray-300">
              EMAIL OR PHONE NUMBER
              <span className="text-red-500"> *</span>
            </Label>
            <Input
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              className="mt-1.5 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 bg-primary-input border-none"
            />
            {formik.touched.email && formik.errors.email && (
              <span className="text-red-500 text-sm">
                {formik.touched.email && formik.errors.email}
              </span>
            )}
          </div>
          <div className="w-full">
            <Label htmlFor="password" className="font-semibold text-gray-300">
              PASSWORD
              <span className="text-red-500"> *</span>
            </Label>
            <Input
              type="password"
              id="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              className="mt-1.5 rounded-sm focus-visible:ring-0 focus-visible:ring-offset-0 bg-primary-input border-none"
            />
            {formik.touched.password && formik.errors.password && (
              <span className="text-red-500 text-sm">
                {formik.errors.password}
              </span>
            )}
            <div>
              <Link href="/forgot-password" className="text-sm text-blue-500">
                Forgot your password?
              </Link>
            </div>
          </div>
          <Button
            type="submit"
            className="bg-primary-blue_button w-full font-semibold"
          >
            Log In
          </Button>
          <div className="text-gray-400 font-medium text-sm flex gap-1 self-start">
            Need an account?
            <span className="text-blue-500">Register</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
