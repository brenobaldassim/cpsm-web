import { SignUpForm } from "@/components/forms/SignUpForm"
import { Loading } from "@/components/loading/Loading"
import React from "react"

const SignUpPage = () => {
  return (
    <React.Suspense fallback={<Loading />}>
      <SignUpForm />
    </React.Suspense>
  )
}

export default SignUpPage
