type BrandLogoProps = {
  className?: string
  iconClassName?: string
  textClassName?: string
}

export function BrandLogo({
  className = "",
  iconClassName = "h-16 w-16 rounded-[12px]",
  textClassName = "h-24 w-auto",
}: BrandLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img src="/baylan-logo.svg" alt="Baylan logo" className={iconClassName} />
      <img
        src="/baylan-text.svg"
        alt="Baylan"
        className={`baylan-wordmark ${textClassName}`}
      />
    </div>
  )
}
