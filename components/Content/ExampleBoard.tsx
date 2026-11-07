interface ExampleCell {
  glyph: string
  fill: string
  bad?: boolean
}

interface ExampleBoardProps {
  label: string
  caption: string
  rows: readonly (readonly ExampleCell[])[]
}

export const ExampleBoard = ({ label, caption, rows }: ExampleBoardProps) => (
  <figure className="rounded-3xl bg-white p-4 ring-1 ring-[#E5D5C0]">
    <div
      className="grid w-fit gap-1"
      style={{ gridTemplateColumns: `repeat(${rows[0]?.length ?? 1}, 2.75rem)` }}
      role="img"
      aria-label={label}
    >
      {rows.flatMap((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`flex h-11 items-center justify-center rounded-xl text-xl ${cell.bad ? 'ring-2 ring-[#E84B7F]' : 'ring-1 ring-[#E5D5C0]'}`}
            style={{ background: cell.fill }}
          >
            <span aria-hidden="true">{cell.glyph}</span>
          </div>
        )),
      )}
    </div>
    <figcaption className="mt-3 text-sm text-[#8C7468]">{caption}</figcaption>
  </figure>
)
