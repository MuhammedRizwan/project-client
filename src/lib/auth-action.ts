
import { signIn } from "@/lib/auth"

export async function SignIn() {
   return  await signIn('google',{redirectTo:'/google'})
}