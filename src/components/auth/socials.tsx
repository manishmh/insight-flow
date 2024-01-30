'use client'

import { Button } from "@/components/ui/button";
import React from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signIn } from 'next-auth/react'
import { DEFAULT_LOGIN_REDIRECT_URL } from "@/server/routes";

const Socials = ({ disabled }: { disabled: boolean }) => {
  const onClick = (provider: "google" | "github") => {
    signIn(provider, {
        callbackUrl: DEFAULT_LOGIN_REDIRECT_URL,
    });
  }
  return (
    <div className="flex gap-x-2 w-full items-center">
      <Button 
        size="lg" 
        className="w-full focus:bg-gray-300 " 
        variant="outline" 
        disabled={disabled}
        onClick={() => {onClick("google")}}
      >
      <FcGoogle className="h-5 w-5" />
      </Button>
      <Button 
        size="lg" 
        className="w-full focus:bg-gray-600" 
        variant="outline" 
        disabled={disabled}
        onClick={() => {onClick("github")}}
      >
        <FaGithub className="h-5 w-5 " />
      </Button>
    </div>
  );
};

export default Socials;
