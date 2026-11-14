import mascotAsset from './mascot.png'

const mascotSrc = typeof (mascotAsset as { src?: string } | string) === 'string'
  ? (mascotAsset as unknown as string)
  : mascotAsset.src

interface MascotProps {
  className?: string
}

export const Mascot = ({ className = 'h-24 w-24' }: MascotProps) => (
  // Plain img so the same face ships in the Next app and the CrazyGames build.
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src={mascotSrc}
    alt=""
    width={640}
    height={555}
    aria-hidden="true"
    draggable={false}
    className={`pointer-events-none shrink-0 select-none object-contain ${className}`}
  />
)
