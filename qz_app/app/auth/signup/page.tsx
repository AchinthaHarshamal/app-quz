"use client";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { signIn } from "next-auth/react";
import { GalleryVerticalEnd } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";

const formSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(2).max(20),
    confirmPassword: z.string().min(2).max(20),
    userName: z.string().min(2).max(20),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

const SignUpPage = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      userName: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          userName: values.userName,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      alert("Sign Up successful!");

      await signIn("credentials", {
        email: values.email,
        password: values.password,
        callbackUrl: "/new/upload-csv",
      });
    } catch (error) {
      console.error("Sign Up failed:", error);
      alert("Sign Up failed: " + (error as Error).message);
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-md flex-col gap-6">
        <a href="/" className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Quiz My Brain
        </a>
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Create an account</CardTitle>
              <CardDescription>Sign up with your email</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid gap-6">
                    <div className="flex flex-col gap-4">
                      <Button variant="outline" className="w-full" type="button" onClick={() => signIn("google", { callbackUrl: '/' })}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <path
                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                            fill="currentColor"
                          />
                        </svg>
                        Sign up with Google
                      </Button>
                    </div>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                      <span className="relative z-10 bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                    <div className="grid gap-6">
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="userName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Username</FormLabel>
                              <FormControl>
                                <Input placeholder="Username" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="Email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <PasswordInput placeholder="Password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Confirm Password</FormLabel>
                              <FormControl>
                                <PasswordInput placeholder="Confirm Password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button type="submit" className="w-full">
                        Sign Up
                      </Button>
                    </div>
                    <div className="text-center text-sm">
                      Already have an account?{" "}
                      <a href="/auth/login" className="underline underline-offset-4">
                        Login
                      </a>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
            By clicking continue, you agree to our <a href="/">Terms of Service</a> and <a href="/">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
