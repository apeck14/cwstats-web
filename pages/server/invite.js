import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function ServerInvite() {
	const router = useRouter()

	useEffect(() => {
		router.push("https://discord.com/invite/fFY3cnMmnH")
	})

	return null
}