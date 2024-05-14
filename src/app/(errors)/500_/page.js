import Link from "next/link"

import ErrorPage from "@/components/error-page"

export default function Page500() {
  return (
    <ErrorPage
      code={500}
      description={
        <>
          Something went wrong behind the scenes. If this issue persists, please join the{" "}
          <Link className="pinkText" href="/support">
            Support Server
          </Link>
          .
        </>
      }
      title="Unexpected error."
    />
  )
}
