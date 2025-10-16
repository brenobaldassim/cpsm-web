"use client"

import React, { useState } from "react"
import { emailSchema, passwordSchema } from "@/lib/validations"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signIn } from "next-auth/react"
import { Card } from "../ui/card"
import { FormError } from "./FormError"
import { FormField } from "./FormField"
import { Button } from "../ui/button"
import Link from "next/link"
import { trpc } from "@/lib/trpc"

const signupSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  })

type SignUpFormData = z.infer<typeof signupSchema>

export const SignUpForm = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/"

  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  const signupMutation = trpc.auth.signup.useMutation({
    onError: (err) => {
      setError(err.message || "An error occurred during sign up.")
    },
  })

  const onSubmit = async (data: SignUpFormData) => {
    setError(null)
    try {
      const result = await signupMutation.mutateAsync({
        email: data.email,
        password: data.password,
      })

      await signIn("credentials", {
        email: result.email,
        password: data.password,
        redirect: true,
        callbackUrl: callbackUrl,
      })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {}
  }

  return (
    <div className="flex min-h-screen items-start justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Client & Product Manager
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create an account to get started
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <FormError message={error} />}

            <FormField
              label="Email"
              type="email"
              registration={register("email")}
              error={errors.email}
              placeholder="admin@example.com"
              autoComplete="email"
              required
            />

            <FormField
              label="Password"
              type="password"
              registration={register("password")}
              error={errors.password}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

            <FormField
              label="Confirm Password"
              type="password"
              registration={register("confirmPassword")}
              error={errors.confirmPassword}
              placeholder="Confirm your password"
              autoComplete="confirm-password"
              required
            />

            <Button
              type="submit"
              className="w-full"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "Signing up..." : "Sign up"}
            </Button>
          </form>
          <div className="text-sm text-center mt-8 w-full flex justify-end gap-2">
            {" "}
            <p>Already have an account? </p>
            <Link href="/login" className="text-blue-500 underline italic">
              Sign in
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
