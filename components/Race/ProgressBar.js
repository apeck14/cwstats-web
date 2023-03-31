import styled from "styled-components"
import { gray, orange, pink } from "../../public/static/colors"

const Main = styled.div({
	"backgroundColor": gray["50"],
	"width": "100%",
	"height": "1rem",
	"borderRadius": "0.25rem",
	"position": "relative",

	"@media (max-width: 650px)": {
		height: "0.75rem"
	},
})

const Projected = styled.div({
	"position": 'absolute',
	"borderRadius": "0.25rem",
	"height": "1rem",
	"backgroundColor": orange,

	"@media (max-width: 650px)": {
		height: "0.75rem"
	},
})

const Progress = styled(Projected)({
	backgroundColor: pink
})

export default function ProgressBar({ fame, projectedFame, isColosseum }) {
	const maxFame = isColosseum ? 180000 : 45000
	const famePerc = (fame / maxFame) * 100
	const projFamePerc = (projectedFame / maxFame) * 100

	return (
		<Main>
			<Projected style={{
				width: `${projFamePerc > 100 ? 100 : projFamePerc}%`
			}}>
			</Projected>
			<Progress style={{
				width: `${famePerc > 100 ? 100 : famePerc}%`
			}}></Progress>
		</Main>
	)
}