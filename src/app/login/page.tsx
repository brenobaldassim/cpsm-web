/**
 * Login Page
 *
 * User authentication page with email and password form.
 * Redirects to dashboard on successful login.
 */

'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { FormField, FormError } from '@/components/forms'
import { trpc } from '@/lib/trpc'
import { emailSchema, passwordSchema } from '@/lib/validations'

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams?.get('callbackUrl') || '/'

  const [error, setError] = React.useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: () => {
      // Redirect to callback URL or dashboard
      router.push(callbackUrl)
      router.refresh()
    },
    onError: (error) => {
      setError(error.message)
    },
  })

  const onSubmit = (data: LoginFormData) => {
    setError(null)
    loginMutation.mutate(data)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-12 sm:px-6 lg:px-8 bg-red-500">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900">
            Client & Product Manager
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            Sign in to your account
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {error && <FormError message={error} />}

            <FormField
              label="Email"
              type="email"
              registration={register('email')}
              error={errors.email}
              placeholder="admin@example.com"
              autoComplete="email"
              required
            />

            <FormField
              label="Password"
              type="password"
              registration={register('password')}
              error={errors.password}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />

            <Button
              type="submit"
              className="w-full"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-600">
            <p>
              Demo credentials: <strong>admin@example.com</strong> /{' '}
              <strong>password123</strong>
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-neutral-100">
          <div className="text-center">
            <p className="text-neutral-600">Loading...</p>
          </div>
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  )
}
