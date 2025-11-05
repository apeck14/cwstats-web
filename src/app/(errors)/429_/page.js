import ErrorPage from '@/components/error-page'

export default function Page429() {
  return (
    <ErrorPage
      code={429}
      description="You didn't do anything wrong. Please wait a moment and try again."
      title='API Limit Exceeded.'
    />
  )
}
