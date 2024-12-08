import { Image as MantineImage } from "@mantine/core"
import NextImage from "next/image"

export default function Image({
  alt,
  circle,
  className,
  fallbackSrc,
  fill,
  fit,
  height,
  hiddenFrom,
  onLoad,
  priority,
  radius,
  src,
  style,
  unoptimized,
  visible = true,
  width,
}) {
  if (!visible) return null

  return (
    <div style={{ width: circle ? height : width || height }}>
      <MantineImage
        alt={alt}
        className={className || ""}
        component={NextImage}
        fallbackSrc={fallbackSrc}
        fill={fill}
        fit={fit || "contain"}
        height={height}
        hiddenFrom={hiddenFrom}
        onLoad={onLoad}
        priority={priority}
        radius={radius}
        src={src}
        style={circle ? { ...style, borderRadius: "50%" } : { ...style }}
        unoptimized={unoptimized}
        width={circle ? height : width || height}
      />
    </div>
  )
}
