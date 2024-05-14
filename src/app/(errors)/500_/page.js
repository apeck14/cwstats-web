import ErrorPage from "@/components/error-page"

export default function Page500() {
  return (
    <ErrorPage
      code={500}
      description="Something went wrong behind the scenes. If this issue persists, please join the Support Server."
      title="Unexpected error."
    />
  )
}
