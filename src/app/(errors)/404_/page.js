import ErrorPage from '@/components/error-page'

export default function Page404() {
  return (
    <ErrorPage
      code={404}
      description="We looked everywhere, but what you're looking for was deleted or doesn't exist."
      title='Resource not found.'
    />
  )
}
