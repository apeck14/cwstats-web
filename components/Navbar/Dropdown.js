import { useState } from "react"
import { BiCaretDown, BiCaretUp } from "react-icons/bi"
import Link from 'next/link'
import { useRouter } from "next/router"
import styled from "styled-components"
import { gray, pink } from "../../public/static/colors"

const Main = styled.div({
	height: "100%",
	position: "relative",
})

const DropdownContent = styled.div({
	"fontFamily": "SansPro600",
	"position": "absolute",
	"backgroundColor": gray["75"],
	"left": 0,
	"right": 0,
	"textAlign": "center",

	"& li": {
		padding: "20px",
	},

	"& a": {
		color: gray["0"],
		textDecoration: "none",
		fontSize: "1.1rem",

	},

	"& a:hover, & a:active": {
		color: pink,
	},
})

const MenuHeader = styled.a({
	"textDecoration": "none",
	"fontFamily": "SansPro700",
	"display": "inline-flex",
	"alignItems": "center",
	"fontSize": "1.1rem",
	"padding": "0px 20px",
	"height": "100%",
	"color": gray["0"],

	"&:hover": {
		color: pink,
		cursor: "pointer",
	},
})

export default function Dropdown({ header, items, icon }) {
	const [isActive, setIsActive] = useState(false)
	const router = useRouter()

	const handleOnBlur = (e) => {
		if (e?.relatedTarget?.pathname)
			router.push(e.relatedTarget.pathname)

		setIsActive(false)
	}

	return (
		<Main onBlur={handleOnBlur}>
			<MenuHeader className="noselect" tabIndex={0} onClick={() => setIsActive(!isActive)}>
				{icon}
				{header}
				{isActive ? <BiCaretUp /> : <BiCaretDown />}
			</MenuHeader>
			<DropdownContent style={isActive ? {
				borderTop: `1px solid ${pink}`
			} : null}>
				{
					items.map((i, index) => (
						<li key={index} style={{
							display: isActive ? "block" : "none"
						}}>
							<Link href={`${i.url}`}>{i.title}</Link>
						</li>
					))
				}
			</DropdownContent>
		</Main>
	)
}