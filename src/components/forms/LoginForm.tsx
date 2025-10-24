"use client"

import React, { useState } from "react"
import { emailSchema, passwordSchema } from "@/lib/validations"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signIn } from "next-auth/react"
import { Card } from "../ui/card"
import { FormError } from "./FormError"
import { FormField } from "./FormField"
import { Button } from "../ui/button"
import Link from "next/link"
import { Routes } from "@/app/routes"

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

type LoginFormData = z.infer<typeof loginSchema>

export const LoginForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get("callbackUrl") || "/"

  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormData) => {
    setError(null)
    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })
      if (result?.error) {
        if (result.error !== "CredentialsSignin") {
          setError(result.error)
        }
        setError("Invalid email or password")
        return
      }
      router.push(callbackUrl)
      router.refresh()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-start justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Client & Product Manager
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>
          <div className="text-sm text-center mt-8 w-full flex justify-end gap-2">
            {" "}
            <p>Don&apos;t have an account? </p>
            <Link
              href={Routes.SIGN_UP}
              className="text-blue-500 underline italic"
            >
              Sign up
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
