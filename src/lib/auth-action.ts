'use server'
import { signIn } from "@/auth"


export async function SignIn() {
   return  await signIn('google',{redirectTo:'/google'})
}