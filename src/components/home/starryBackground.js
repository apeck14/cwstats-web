import { Container, Flex, Stack, Text, ThemeIcon, Title } from "@mantine/core"
import { IconBrandDiscord, IconClockBolt, IconTools } from "@tabler/icons-react"

import { CWSTATS_DESC } from "@/static/constants"

import classes from "./Home.module.css"

const features = [
  {
    icon: <IconBrandDiscord />,
    subTitle: "Bring the analytics you love directly to your Discord servers",
    title: "Discord Bot",
  },
  {
    icon: <IconClockBolt />,
    subTitle: "Foster quick, informed decisions to maximize your clan's success",
    title: "Real-Time Data",
  },
  {
    icon: <IconTools />,
    subTitle: "Unlock innovative tools to give your clan the edge",
    title: "CW2 Tools",
  },
]

export default function StarryBackground() {
  return (
    <div className={classes.starryBackground}>
      <div className={classes.stars} />
      <div className={classes.stars2} />
      <div className={classes.stars3} />
      <div className={classes.stars4} />

      <Container component={Stack} gap="xl" size="lg" w="100%">
        <Title className={classes.title}>
          The trusted source for everything <span className="gradientText">Clan Wars</span>
        </Title>
        <Title c="gray.2" className={classes.subTitle}>
          {CWSTATS_DESC}
        </Title>

        <Flex className={classes.featureGrid} gap="xl" pt="xl">
          {features.map((f) => (
            <Flex className={classes.feature} gap="md" key={f.title}>
              <ThemeIcon size="xl" variant="gradient">
                {f.icon}
              </ThemeIcon>
              <Flex className={classes.featureContent}>
                <Title className={classes.featureTitle}>{f.title}</Title>
                <Text c="gray.1" className={classes.featureSubTitle}>
                  {f.subTitle}
                </Text>
              </Flex>
            </Flex>
          ))}
        </Flex>
      </Container>
    </div>
  )
}
