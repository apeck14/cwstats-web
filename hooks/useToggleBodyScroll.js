import { useEffect } from "react"

export default function useToggleBodyScroll(allowScroll) {
    useEffect(() => {
        if (allowScroll) document.body.style.overflow = "visible"
        else document.body.style.overflow = "hidden"
    }, [allowScroll])
}
