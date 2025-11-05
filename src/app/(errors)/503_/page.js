import ErrorPage from '@/components/error-page'

export default function Page503() {
  return (
    <ErrorPage
      code={503}
      description='Supercell servers are undergoing maintenance. Please try again when the break is over.'
      title='Maintenance break.'
    />
  )
}
