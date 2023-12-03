import { NextAuthOptions } from "next-auth";
import GithubProvider from 'next-auth/providers/github'
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

const headers = {
  "Content-Type": "application/json",
}

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'Username' },
        password: { label: 'Password', type: 'password', placeholder: 'Password'}
      },
      async authorize(credentials, req) {
        try {
          const response = await axios.post('http://localhost:8080/login', credentials, { headers });
          console.log(response)
          return response.data;
        } catch (error) {
            console.error(error)
            return null;
        }
      }
    })
  ],
}

