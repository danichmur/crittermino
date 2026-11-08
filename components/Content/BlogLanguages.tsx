import Link from 'next/link'
import { LOCALE_LABEL, LOCALES, localizeHref, type Locale } from '@/lib/locale'

/** Visible links between the English, Russian, and Spanish copies of one blog URL. */
export const BlogLanguages = ({ path, locale }: { path: string; locale: Locale }) => (
  <nav aria-label="Languages" className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold">
    {LOCALES.map((item) =>
      item === locale ? (
        <span key={item} aria-current="page" className="text-[#E84B7F]">
          {LOCALE_LABEL[item]}
        </span>
      ) : (
        <Link
          key={item}
          href={localizeHref(item, path)}
          hrefLang={item}
          className="text-[#3D2C29] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-[#FF6B9D]"
        >
          {LOCALE_LABEL[item]}
        </Link>
      ),
    )}
  </nav>
)
