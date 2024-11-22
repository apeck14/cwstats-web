import LoginContent from "@/components/login/login-content"

export const metadata = {
  description: "Log in with Discord to access all of CWStats!",
  title: "Log in | CWStats",
}

export default function LoginPage({ searchParams }) {
  return <LoginContent searchParams={searchParams} />
}
