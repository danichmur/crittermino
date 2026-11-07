import { richText } from '@/components/Content/RichText'
import type { ArticleSection } from '@/lib/blog'

const headingId = (heading: string): string =>
  heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export const ArticleBody = ({ sections }: { sections: readonly ArticleSection[] }) => (
  <div className="mt-8 grid gap-8">
    {sections.map((section) => (
      <section key={section.heading} aria-labelledby={headingId(section.heading)}>
        <h2 id={headingId(section.heading)} className="font-display text-2xl font-bold">
          {section.heading}
        </h2>
        {section.blocks.map((block, index) => {
          if (block.kind === 'ul') {
            return (
              <ul key={`${section.heading}-list-${index}`} className="mt-3 grid list-disc gap-2 pl-5 text-[#3D2C29]">
                {block.items?.map((item) => (
                  <li key={item}>{richText(item)}</li>
                ))}
              </ul>
            )
          }
          return (
            <p key={`${section.heading}-p-${index}`} className="mt-3 leading-relaxed text-[#3D2C29]">
              {richText(block.text ?? '')}
            </p>
          )
        })}
      </section>
    ))}
  </div>
)
