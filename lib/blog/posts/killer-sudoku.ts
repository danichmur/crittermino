import { list, paragraph, type BlogPost } from '@/lib/blog/types'

export const killerSudoku: BlogPost = {
  slug: 'killer-sudoku',
  title: 'Killer sudoku rules',
  description:
    'Killer sudoku rules: ordinary Sudoku, plus cages that add up to a small total. No digit repeats inside a cage.',
  published: '2026-11-10',
  keywords: ['killer sudoku', 'killer sudoku rules', 'how to play killer sudoku', 'sudoku killer'],
  sections: [
    {
      heading: 'Sudoku, plus a cage',
      blocks: [
        paragraph(
          'Killer sudoku is Sudoku with cages drawn on top. The 9×9 grid, the rows, the columns, and the 3×3 boxes still hold each digit from 1 to 9 once. A cage is a dashed group of cells with a tiny sum in the corner. The digits inside that cage add up to the sum. A digit does not repeat inside its cage.',
        ),
        paragraph(
          'This site does not deal killer cages. The rules are the answer to the search. A killer grid you can play online is [[https://sudoku.com/killer|Sudoku.com’s killer sudoku]]. Plain Sudoku, without cages, is [[/blog/sudoku-rules|Sudoku rules]]. The sum puzzle that is not Sudoku at all is [[/blog/kakuro-rules|Kakuro]].',
        ),
      ],
    },
    {
      heading: 'What a cage demands',
      blocks: [
        list([
          'Every row, column, and box still contains 1 through 9 once.',
          'Cells in a cage add up to the printed sum.',
          'A cage does not repeat a digit, even when the cells sit in different boxes.',
          'A cage may cross a box border. The Sudoku lines still apply.',
          'A one-cell cage is a given: that cell is the sum.',
          'Cages do not overlap. Every cell is in one cage.',
        ]),
      ],
    },
    {
      heading: 'A two-cell cage that sums to 4',
      blocks: [
        paragraph(
          'Two cells in one cage that add to 4 can be 1 and 3. They cannot be 2 and 2, because the cage forbids a repeat and the row or box would forbid it too if they share one. The order is still open until a line or another cage spends it.',
        ),
        paragraph(
          'That pair is also the Kakuro fact for a run of 4. The difference is the rest of the grid. Kakuro stops at the runs. Killer sudoku still has to place every digit once in the row, the column, and the box. A 1 you write to finish a cage can be illegal three lines away because that box already has a 1.',
        ),
        paragraph(
          'Fillomino has neither cages nor boxes. A 4 there is four connected cells, the dog on Crittermino. If the sums were a detour and you wanted shapes, the [[/how-to-play|how to play page]] is the shorter rule set.',
        ),
      ],
    },
    {
      heading: 'Where to play',
      blocks: [
        paragraph(
          '[[https://sudoku.com/killer|Killer sudoku on Sudoku.com]] is the cage version. [[https://www.websudoku.com/|Web Sudoku]] is the version without cages.',
        ),
        paragraph(
          'Crittermino’s daily and campaign are Fillomino. Open the [[/|board]] when you want animal homes instead of a sum. The wider list is [[/blog/best-free-logic-puzzles-2026|free logic puzzles online]].',
        ),
      ],
    },
  ],
  faqs: [
    {
      question: 'What are the rules of killer sudoku?',
      answer:
        'Solve it as Sudoku: 1 to 9 once in every row, column, and 3×3 box. Also add the digits in each dashed cage up to that cage’s sum, with no repeat inside the cage.',
    },
    {
      question: 'Can a killer sudoku cage repeat a digit?',
      answer: 'No. Digits in a cage are all different, and they still obey the Sudoku lines.',
    },
    {
      question: 'Is killer sudoku the same as Kakuro?',
      answer:
        'Both use sums. Kakuro is runs on a crossword. Killer sudoku is cages on a full Sudoku grid, so rows, columns, and boxes still cannot repeat a digit.',
    },
  ],
}
