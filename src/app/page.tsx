import { LoginForm } from "@/components/login-form";
import { Logo } from "@/components/icons";

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-col justify-center items-center px-6 py-12 lg:px-8 bg-background">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center text-primary">
          <Logo className="h-12 w-auto" />
        </div>
        <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
          CredentiaLink
        </h1>
        <h2 className="mt-2 text-center text-lg leading-9 tracking-tight text-muted-foreground">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <LoginForm />
      </div>
    </div>
  );
}
