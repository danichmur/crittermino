import type { AnchorHTMLAttributes } from 'react'

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }

const Link = ({ href, ...props }: LinkProps) => <a href={href} {...props} />

export default Link
