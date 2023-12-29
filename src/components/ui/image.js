import { Image as MantineImage } from "@mantine/core"
import NextImage from "next/image"

export default function Image({ alt, fill, height, src, width }) {
  return <MantineImage alt={alt} component={NextImage} fill={fill} height={height} src={src} width={width} />
}
