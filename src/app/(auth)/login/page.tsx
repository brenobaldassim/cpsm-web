/**
 * Login Page
 *
 * User authentication page with email and password form.
 * Redirects to dashboard on successful login.
 */

"use client"

import * as React from "react"
import { LoginForm } from "@/components/forms/LoginForm"
import { Loading } from "@/components/loading/Loading"

const LoginPage = () => {
  return (
    <React.Suspense fallback={<Loading />}>
      <LoginForm />
    </React.Suspense>
  )
}

export default LoginPage
