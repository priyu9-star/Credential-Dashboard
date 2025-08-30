import { LoginForm } from "@/components/login-form";
import { Logo } from "@/components/icons";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-col justify-center items-center px-6 py-12 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-foreground">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
