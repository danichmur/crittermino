import { list, paragraph, type BlogPost } from '@/lib/blog/types'

export const kakuroRules: BlogPost = {
  slug: 'kakuro-rules',
  title: 'Kakuro rules',
  description:
    'Kakuro rules: a run of digits adds up to the clue, and no digit repeats inside that run. How a sum of 4 is forced, and where to play.',
  published: '2026-11-10',
  keywords: ['kakuro rules', 'how to play kakuro', 'kakuro puzzle', 'kakuro online'],
  sections: [
    {
      heading: 'A crossword of sums',
      blocks: [
        paragraph(
          'Kakuro looks like a crossword drawn with digits. White cells form runs, across and down. A black cell carries a small sum, and that sum is the total of the run it points at. Across-clues sit in the bottom of the black cell and point right. Down-clues sit in the top and point down. You write digits 1 through 9. A run adds up to its clue. No digit repeats inside one run.',
        ),
        paragraph(
          'Crittermino is not Kakuro. There is no sum on this board. If you want Kakuro itself, [[https://kakuro.com/|Kakuro.com]] deals free puzzles in the browser. This page is the rules, then the fork: stay with sums, or play the region puzzle on [[/|this site]].',
        ),
      ],
    },
    {
      heading: 'The two rules',
      blocks: [
        list([
          'A run is a horizontal or vertical line of white cells between walls.',
          'The digits in a run add up to the clue for that run.',
          'Digits are 1 to 9. Zero is not used.',
          'A digit does not repeat inside its own run.',
          'The same digit may appear in a different run, including one that crosses this cell’s other direction.',
          'A cell belongs to one across run and one down run. It has to satisfy both sums.',
        ]),
      ],
    },
    {
      heading: 'A run of two that sums to 4',
      blocks: [
        paragraph(
          'Two cells that must add to 4 can be 1 and 3. They cannot be 2 and 2, because a run cannot repeat a digit. So the cells are 1 and 3 in some order. You do not know the order yet. You do know that neither cell is 2, 4, 5, 6, 7, 8, or 9.',
        ),
        paragraph(
          'The crossing run spends that leftover choice. If the down run through the first cell cannot accept a 1, the first cell is 3 and the second is 1. Kakuro is that conversation, sum against sum, until the order is forced. A two-cell run of 3 is the same lesson with only one pair: 1 and 2.',
        ),
        paragraph(
          'Sudoku never asks you to add. [[/blog/sudoku-rules|Sudoku rules]] care which digit is already used in the line and the box. Kakuro cares which pair of digits can make the clue. Fillomino cares how many cells share a wall. Three games, three jobs for a number.',
        ),
      ],
    },
    {
      heading: 'Where to play Kakuro',
      blocks: [
        paragraph(
          '[[https://kakuro.com/|Kakuro.com]] is a free Kakuro pad. Start there when the search was for Kakuro.',
        ),
        paragraph(
          'The puzzle on Crittermino is Fillomino with animal homes. A dog is four connected cells, not a sum of four. The [[/how-to-play|how to play page]] has the three rules and a board you can tap. Killer Sudoku, which also uses sums, is a different cage on top of Sudoku: [[/blog/killer-sudoku|killer sudoku rules]].',
        ),
      ],
    },
  ],
  faqs: [
    {
      question: 'What are the rules of Kakuro?',
      answer:
        'Fill each white run with digits from 1 to 9 that add up to the clue. No digit repeats inside a run. Zero is not used. A cell must satisfy both its across sum and its down sum.',
    },
    {
      question: 'Can the same digit appear twice on a Kakuro board?',
      answer:
        'Yes, in different runs. It cannot appear twice inside one run.',
    },
    {
      question: 'Is Kakuro the same as Sudoku?',
      answer:
        'No. Sudoku places each digit once per row, column, and box. Kakuro makes runs add up to a clue, with no repeat inside the run.',
    },
  ],
}
