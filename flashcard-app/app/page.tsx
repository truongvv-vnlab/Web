import LoginForm from "@/components/login-form"

export default function Home() {
  // Redirect to dashboard if user is authenticated
  // In a real app, you would check the session here
  // const session = await getServerSession();
  // if (session) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background">
      <LoginForm />
    </div>
  )
}

