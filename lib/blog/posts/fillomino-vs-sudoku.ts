import { dog } from '@/lib/blog/cells'
import { board, list, paragraph, type BlogPost } from '@/lib/blog/types'

export const fillominoVsSudoku: BlogPost = {
  slug: 'fillomino-vs-sudoku',
  title: 'Fillomino, a Sudoku alternative',
  description:
    'A puzzle like Sudoku, with different rules. Fillomino keeps the quiet grid. The number is a region size, not a digit that must stay unique.',
  published: '2026-11-08',
  updated: '2026-11-10',
  keywords: ['sudoku alternative', 'puzzles like sudoku', 'games like sudoku', 'fillomino vs sudoku'],
  sections: [
    {
      heading: 'If you like Sudoku, try Fillomino',
      blocks: [
        paragraph(
          'If you like Sudoku, try Fillomino. You still get a grid, a few printed clues, and one intended solution. You still lose when a "likely" guess paints you into a corner. What changes is the job of the number. That job is the Fillomino Sudoku difference, and it is the reason a strong Sudoku habit can feel lost for the first ten minutes.',
        ),
        paragraph(
          'Sudoku asks you to place digits so each row, column, and box contains each digit once. Fillomino asks you to grow regions so the number in a cell is the size of its region. People who have played Sudoku for years already know how to hold three constraints at once. Fillomino spends that skill on shape instead of on lines. The [[/blog/how-to-solve-fillomino-puzzles|Fillomino tutorial]] is the method, with a 4×4 you can finish by hand. This page is the translation.',
        ),
      ],
    },
    {
      heading: 'The number means a different thing',
      blocks: [
        paragraph(
          'In Sudoku, a 4 is the value four. It appears once in the row, once in the column, and once in the box. Seeing a second 4 in that row means the line is wrong. In Fillomino, a 4 is a size. Every cell in that region is a 4, and the region contains four cells. A straight run of four 4s is a finished, legal region. It is the ordinary way a size-4 home looks when it has room.',
        ),
        paragraph(
          'Crittermino makes the size an animal so you do not have to remember that the digit is a count. A dog is four cells. Two dog homes still cannot share a wall. That wall is Fillomino’s version of "this digit is already used." The picture below is one dog home. In Sudoku the same row of fours would be the mistake the rules exist to prevent.',
        ),
        board(
          'Four dogs in a row, one Fillomino region of size 4.',
          'One home of four. In Fillomino this is finished and legal. In Sudoku, four 4s in a row breaks the line.',
          [[dog(), dog(), dog(), dog()]],
        ),
        paragraph(
          'The animals in Crittermino stop at 6: mouse 2, cat 3, dog 4, panda 5, lion 6. Paper Fillomino also allows a 1 and, on a big grid, a 7 or more. Sudoku is fixed at 1 through 9, usually in nine rows and nine boxes. Fillomino grids come in many sizes. A 4×4 is a real puzzle. A 10×10 is a longer one. The rule does not get new pieces as the grid grows. The regions just have more room to bend.',
        ),
      ],
    },
    {
      heading: 'Lines, then shapes',
      blocks: [
        paragraph(
          'Sudoku bans repeats inside a line and a box. The shape of a region barely matters, as long as the digit sits in a legal cell. You can solve a lot of Sudoku by scanning: which digits are missing from this row, and which of those the box can still accept. The pencil marks live in the cells, and the constraint lives in the lines.',
        ),
        paragraph(
          'Fillomino barely cares about rows. It cares that a region is one piece, that the piece has the right number of cells, and that another piece of that size does not share a side. Cells join along an edge. A corner does not connect them, and a corner does not separate two equal regions either. Two homes of size 4 may touch at a corner and both be legal. The same two homes sharing a side are one home of eight, or two illegal homes, and either reading fails.',
        ),
        paragraph(
          'That is why the first session feels slow. Scanning a row for a missing digit does nothing, because a row is allowed to be full of the same number when those cells are one region, and it is also allowed to hold several numbers with no set to complete. You scan outward from a given and ask how the home can grow. "Which cells can still belong to this 3" replaces "which digits are missing from this row."',
        ),
      ],
    },
    {
      heading: 'What you are allowed to repeat',
      blocks: [
        paragraph(
          'Sudoku spends the whole puzzle stopping repeats. Fillomino requires repeats inside a region: a size of 5 is five 5s, side by side, in one piece. The repeat Fillomino forbids is a different one. Two separate regions of size 5 cannot share a side. Equal givens that already share a side are therefore the same region. You do not get to choose. Mark them joined and go find the cells they still need.',
        ),
        paragraph(
          'Sudoku givens are values you cannot change, and they also tell you where that value is spent. Fillomino givens are sizes you cannot change, and they tell you how large a neighborhood must become. A given does not say the region is finished. A single printed 5 still needs four more cells. A single printed 5 next to another printed 5 needs three more cells, because those two already count.',
        ),
        list([
          'Sudoku: each digit once per row, column, and box.',
          'Fillomino: each region once, at the size written inside it, kept apart from other regions of that size.',
          'Sudoku: the last empty cell in a unit is often forced by the digits already there.',
          'Fillomino: the last cell of a home is often forced by the size it still owes, and by the wall it must not touch.',
        ]),
      ],
    },
    {
      heading: 'What feels the same',
      blocks: [
        paragraph(
          'Both puzzles are pen-and-logic grids with one intended solution when the setter is honest. Both punish a guess that was only likely. Both get tight near the end, when the last cells are forced by digits or homes you have already placed. If you like the moment a Sudoku box accepts its last digit, you will recognize the moment a Fillomino home closes and the neighboring cell loses an option.',
        ),
        paragraph(
          'Both reward the same pause. Name the constraint before you write. In Sudoku that sentence is "this box still needs a 7, and only one cell can hold it." In Fillomino it is "this cat still needs one cell, and only one neighbor keeps it off the other cat." The words change. The habit of speaking the constraint is the part that transfers. People who write pencil marks in Sudoku can write the same kind of note in Fillomino: the sizes a cell is not allowed to be.',
        ),
        list([
          'One solution, when the puzzle is honest. Published Crittermino levels are built that way.',
          'Givens you cannot change.',
          'A short session on a small grid, a longer one on a large grid.',
          'No language skill required. Word games are a separate hobby.',
        ]),
      ],
    },
    {
      heading: 'Where a Sudoku habit helps, and where it stalls',
      blocks: [
        paragraph(
          'The habit that helps is refusal to guess, plus comfort with a grid that looks under-specified. Early Sudoku teaches you that an empty-looking cell is often forced by houses you are not staring at. Fillomino is the same lesson with the houses replaced by growing shapes. The count of cells is the new house. If three separate regions of size 5 would need more cells than the grid has, those clues are fewer regions than you thought. The tutorial walks that count on a real 4×4.',
        ),
        paragraph(
          'The habit that stalls is the row scan. It will keep pulling your eye, because it has been right for years. When a Fillomino row looks "full of 4s," ask whether those 4s are one region of the right size or two regions sharing a wall. The row itself is not the question. The other stall is treating the box, the 3×3 square, as special. Fillomino has no boxes. A 2×2 block of the same number is simply four cells that must be read as shape: one region, or several, and only some of those readings have a legal size.',
        ),
      ],
    },
    {
      heading: 'Which grid to open',
      blocks: [
        paragraph(
          'Stay with Sudoku when you want the comfort of a rule you already dream in. [[https://www.websudoku.com/|Web Sudoku]] is a plain pad: digits 1 to 9, rows, columns, and boxes. [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/solo.html|Simon Tatham’s Solo]] is the same game inside a free collection that also includes Fillomino.',
        ),
        paragraph(
          'Switch to Fillomino when the rows feel automatic and you want the constraint to be a shape. [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/filling.html|Simon Tatham’s Filling]] is Fillomino with pencil-style numbers, and the sizes are not limited to the five animals. Crittermino is the same form with animals, a 300-level campaign, and a [[/daily-challenge|daily grid]] that is the same for everyone. Free, in the browser, no account. The [[/how-to-play|rules]] take less than a minute if Fillomino is the one you have not tried.',
        ),
        paragraph(
          'Neither replaces the other. A week of only one of them is how you find out which silence you like. If you want a wider shelf of free grids after that week, the [[/blog/best-free-logic-puzzles-2026|2026 list]] keeps Fillomino, Sudoku, and a few puzzles that use neither rows nor regions.',
        ),
      ],
    },
  ],
  faqs: [
    {
      question: 'What is the difference between Fillomino and Sudoku?',
      answer:
        'In Sudoku a 4 is a value that appears once in the row, column, and box. In Fillomino a 4 is a size: the region has four cells, and every cell in it is a 4. Two regions of the same size cannot share a side. Fillomino has no row, column, or box rule.',
    },
    {
      question: 'If I like Sudoku, will I like Fillomino?',
      answer:
        'Often, yes. Both are quiet grids with one solution and givens you cannot change. Fillomino asks you to grow shapes instead of scanning lines. The [[/blog/how-to-solve-fillomino-puzzles|tutorial]] is the way in, and Crittermino is that puzzle with animals.',
    },
    {
      question: 'Is Fillomino harder than Sudoku?',
      answer:
        'A small Fillomino is easier than a hard Sudoku, and a large Fillomino is a long session. Difficulty is the grid in front of you, not the name of the puzzle. The skill that transfers is naming a constraint before you write. The skill that does not transfer is scanning a row for a missing digit.',
    },
    {
      question: 'Where can I play each one for free?',
      answer:
        'Sudoku: [[https://www.websudoku.com/|Web Sudoku]]. Numbered Fillomino: [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/filling.html|Simon Tatham’s Filling]]. Fillomino with animals: the [[/|Crittermino home page]], including a [[/daily-challenge|daily puzzle]].',
    },
  ],
}
