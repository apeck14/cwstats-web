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
        fill={fill}
        fit={fit || "contain"}
        height={height}
        hiddenFrom={hiddenFrom}
        onError={onError}
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
