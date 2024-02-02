import { Image as MantineImage } from "@mantine/core"
import NextImage from "next/image"

export default function Image({
  alt,
  circle,
  className,
  fill,
  fit,
  height,
  hiddenFrom,
  onError,
  onLoad,
  priority,
  radius,
  src,
  unoptimized,
  width,
}) {
  return (
    <MantineImage
      alt={alt}
      className={className || ""}
      component={NextImage}
      fill={fill}
      fit={fit || "contain"}
      height={height}
      hiddenFrom={hiddenFrom}
      onError={onError}
      onLoad={onLoad}
      priority={priority}
      radius={radius}
      src={src}
      style={circle ? { borderRadius: "50%" } : {}}
      unoptimized={unoptimized}
      width={circle ? height : width || height}
    />
  )
}
