import { dog } from '@/lib/blog/cells'
import { board, list, paragraph, type BlogPost } from '@/lib/blog/types'

export const fillominoVsNonogram: BlogPost = {
  slug: 'fillomino-vs-nonogram',
  title: 'Fillomino, a nonogram alternative',
  description:
    'A puzzle like a nonogram, without the picture. Fillomino still fills a grid by logic. The number is a region size inside a cell, not a run length on the edge.',
  published: '2026-11-16',
  keywords: ['nonogram alternative', 'picross alternative', 'games like nonogram', 'fillomino vs nonogram'],
  sections: [
    {
      heading: 'If you like nonograms, try Fillomino',
      blocks: [
        paragraph(
          'If you like nonograms, try Fillomino. You still get a grid, a few numbers, and one intended solution. You still lose when a likely guess paints a cell the rest of the board cannot accept. What changes is where the number sits, and what it counts. A nonogram number lives on the edge and measures a run of ink. A Fillomino number lives in a cell and measures the size of its home.',
        ),
        paragraph(
          'A nonogram, also called picross or a Japanese crossword, asks you to paint some cells and leave others empty until a picture matches every edge clue. Fillomino asks you to fill every cell, so each connected group is exactly as big as the number inside it, and two groups of the same size do not share a side. People who finish nonograms already know how to hold a row and a column in mind at once. Fillomino spends that skill on a shape that can bend. The [[/blog/how-to-solve-fillomino-puzzles|Fillomino tutorial]] walks a 4×4. This page is the translation. The [[/blog/japanese-crossword|nonogram rules]] stay on their own page if the picture is what you came for.',
        ),
      ],
    },
    {
      heading: 'The number sits in a different place',
      blocks: [
        paragraph(
          'On a nonogram, a 4 printed beside a row means four filled cells in a row, somewhere in that line. The four cells are ink. They do not contain the digit 4. The digit already did its job by sitting on the border. Empty cells may sit before the run, after it, and, when the clue has more than one number, between runs.',
        ),
        paragraph(
          'In Fillomino, a 4 is written in the cells themselves. Those four cells are the region. Nothing in that home stays blank, and the home does not have to be a straight line. Crittermino prints an animal instead of the digit, so the count is visible without a second legend. A dog is four cells. The row below is one finished dog home. A nonogram could use a clue of 4 for a run that looks similar, and then leave the rest of a longer line empty. Fillomino has no rest of the line to leave empty. Every cell on the board joins some home.',
        ),
        board(
          'Four dogs in a row, one Fillomino region of size 4.',
          'One home of four. In Fillomino the row is finished and full. In a nonogram a 4 is ink counted from the edge of a line that may still contain empty cells.',
          [[dog(), dog(), dog(), dog()]],
        ),
      ],
    },
    {
      heading: 'A picture, then a home',
      blocks: [
        paragraph(
          'The reward at the end of a nonogram is a picture. You kept going because the clues were tight, and the drawing is how you see that the clues agreed. Fillomino pays you with closed homes. A region becomes one animal of the right size, and the neighboring cell loses an option. There is no hidden cat to reveal. The cat is the region of three.',
        ),
        paragraph(
          'That is why a nonogram habit stalls on the first Fillomino board. The eye looks for a line to shade and a gap to keep. Fillomino does not shade, and it does not keep gaps inside a home. Cells of one home touch along a full side. A corner touch does not connect them, and a corner touch does not separate two homes of the same size either. Two dog homes may touch at a corner. Two dog homes that share a side are one home of eight, or two illegal homes.',
        ),
        paragraph(
          'The animals in Crittermino stop at 6: mouse 2, cat 3, dog 4, panda 5, lion 6. Paper Fillomino also allows a 1 and, on a big grid, a 7 or more. A nonogram clue can be any run that fits the line, including a 1 and a run as long as the whole row. The genres share a count. They do not share a place to write it.',
        ),
      ],
    },
    {
      heading: 'What you are allowed to leave empty',
      blocks: [
        paragraph(
          'A nonogram is finished with empty cells still on the board. Those empties are part of the answer. A clue of 2 1 needs a gap of at least one empty cell between the runs, and the gap is as forced as the ink. Marking an empty cell is a move.',
        ),
        paragraph(
          'Fillomino is finished only when no cell is empty. A blank cell is an unfinished home, not a gap you are protecting. The separation Fillomino cares about is a wall between two homes of the same size. Different sizes may share that wall. A dog home may sit against a cat home for the whole length of a side.',
        ),
        list([
          'Nonogram: some cells stay empty, and those empty cells are the background of the picture.',
          'Fillomino: every cell belongs to a home. Empty means you are not done.',
          'Nonogram: a number on the edge is the length of one ink run, in order.',
          'Fillomino: a number in the cell is the size of the whole home, and the home may bend.',
        ]),
      ],
    },
    {
      heading: 'What feels the same',
      blocks: [
        paragraph(
          'Both puzzles punish a mark that was only likely. Both get tight near the end, when one decided cell removes a possibility and the neighbors follow. If you like the moment a nonogram line collapses because a run no longer fits, you will recognize the moment a Fillomino home closes and the cell next door cannot be that animal.',
        ),
        paragraph(
          'Both reward the same pause. Name the constraint before you write. In a nonogram that sentence is "this row is a 4 in a line of six, so the middle two cells are ink no matter where the run slides." In Fillomino it is "this dog still needs one cell, and only one neighbor keeps it off the other dog." The words change. The habit of speaking the constraint is the part that transfers.',
        ),
        list([
          'One solution, when the puzzle is honest. Published Crittermino levels are built that way.',
          'No language skill required. Word games are a separate hobby.',
          'A short session on a small grid, a longer one on a large grid.',
          'A wrong guess is how the board gets stuck. The repair is undo, then a constraint you can say out loud.',
        ]),
      ],
    },
    {
      heading: 'Where a nonogram habit helps, and where it stalls',
      blocks: [
        paragraph(
          'The habit that helps is overlap. Nonogram players already slide a run along a line and mark the cells that stay filled in every legal position. Fillomino asks a related question about a home that still owes cells: which neighbors are forced, because every other direction is a wall, the border, or a same-size home. The count is doing the work the edge clue used to do.',
        ),
        paragraph(
          'The habit that stalls is the edge. There is no column of clues to read, so scanning the border finds nothing. The other stall is leaving a gap because a picture usually needs one. A gap inside what you hoped was one home splits it into two homes, and then each piece has to be its own legal size. If you meant one dog, the cells have to touch on sides the whole way.',
        ),
      ],
    },
    {
      heading: 'Which grid to open',
      blocks: [
        paragraph(
          'Stay with the picture when the drawing is the reason you sat down. [[https://webpbn.com/|Web Paint-by-Number]] is the long-running free set. [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/pattern.html|Simon Tatham’s Pattern]] is the same genre inside a collection that also includes Fillomino. The [[/blog/japanese-crossword|rules of a Japanese crossword]] are the edge clues on one page.',
        ),
        paragraph(
          'Switch to Fillomino when you want the same deduction and you do not need a picture at the end. [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/filling.html|Simon Tatham’s Filling]] is Fillomino with pencil-style numbers. Crittermino is the same form with animals, a 300-level campaign, and a [[/daily-challenge|daily grid]] that is the same for everyone. Free, in the browser, no account. The [[/how-to-play|rules]] take less than a minute.',
        ),
        paragraph(
          'Neither replaces the other. If the number you already know is a Sudoku digit, the matching page is [[/blog/fillomino-vs-sudoku|Fillomino versus Sudoku]]. If it is a sum, it is [[/blog/fillomino-vs-kakuro|Fillomino versus Kakuro]]. A week of only one grid is how you find out which silence you like.',
        ),
      ],
    },
  ],
  faqs: [
    {
      question: 'What is the difference between Fillomino and a nonogram?',
      answer:
        'A nonogram number sits on the edge and gives the length of an ink run. Some cells stay empty, and the filled cells form a picture. A Fillomino number sits in the cell and gives the size of its region. Every cell is filled, the region may bend, and two regions of the same size cannot share a side.',
    },
    {
      question: 'If I like picross, will I like Fillomino?',
      answer:
        'Often, if what you like is the moment a line becomes forced. Picross pays that moment with a picture. Fillomino pays it with a closed home. The [[/blog/how-to-solve-fillomino-puzzles|tutorial]] is the way in, and Crittermino is that puzzle with animals.',
    },
    {
      question: 'Is a nonogram the same as a Japanese crossword?',
      answer:
        'Yes. Japanese crossword, picross, griddlers, and paint-by-number are names for the same edge-clue picture puzzle. Fillomino is not one of those names. The [[/blog/japanese-crossword|rules page]] covers the picture puzzle. This page is the difference.',
    },
    {
      question: 'Where can I play each one for free?',
      answer:
        'Nonograms: [[https://webpbn.com/|Web Paint-by-Number]]. Numbered Fillomino: [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/filling.html|Simon Tatham’s Filling]]. Fillomino with animals: the [[/|Crittermino home page]], including a [[/daily-challenge|daily puzzle]].',
    },
  ],
}
