import { SignIn } from "@/lib/auth-action";
import { Button } from "@nextui-org/react";
import { FcGoogle } from "react-icons/fc";

export default function GoogleLoginButton() {
    return(
        <div className="text-slate-500 font-semibold w-1/2 flex">
        <Button
          onClick={() => {
            SignIn();
          }}
        >
          <FcGoogle className="m-1" />
          Sign in with Google
        </Button>
      </div>
    )
}