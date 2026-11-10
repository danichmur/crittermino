interface PortalRouter {
  push: (href: string) => void
}

/** The portal bundle is a single page, so route changes are ignored. */
export const useRouter = (): PortalRouter => ({ push: () => undefined })
