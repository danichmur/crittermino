import { list, paragraph, type BlogPost } from '@/lib/blog/types'

export const sudokuRules: BlogPost = {
  slug: 'sudoku-rules',
  title: 'Sudoku rules',
  description:
    'Sudoku rules in one page: each digit once in the row, the column, and the box. Where to play Sudoku online, and what this site plays instead.',
  published: '2026-11-10',
  keywords: ['sudoku rules', 'sudoku online', 'how to play sudoku', 'free sudoku online'],
  sections: [
    {
      heading: 'Three places, one digit',
      blocks: [
        paragraph(
          'Sudoku is a 9×9 grid split into nine 3×3 boxes. You fill every cell with a digit from 1 to 9. Each digit appears once in its row, once in its column, and once in its box. A printed digit is a given. It stays. The rest of the grid is the puzzle, and a fair Sudoku has one solution.',
        ),
        paragraph(
          'This site does not run a Sudoku board. The rules are below so the search has an answer. A free Sudoku you can finish in the browser is [[https://www.websudoku.com/|Web Sudoku]]. The grid on Crittermino is Fillomino: the number is a region size, not a digit that must stay unique. That difference is [[/blog/fillomino-vs-sudoku|Fillomino versus Sudoku]].',
        ),
      ],
    },
    {
      heading: 'What you are allowed to write',
      blocks: [
        list([
          'Digits are 1 through 9. There is no 0.',
          'A row of nine cells holds each digit once.',
          'A column of nine cells holds each digit once.',
          'A 3×3 box holds each digit once.',
          'A given cannot be changed.',
          'Guessing is how a grid gets stuck. A finished Sudoku can be checked by scanning lines and boxes only.',
        ]),
        paragraph(
          'The shape of a group does not matter. Four 4s in a straight line are illegal in Sudoku because the row already spent the digit. In Fillomino that same line can be one finished region. If that sentence is the part you came for, the comparison page has the picture.',
        ),
      ],
    },
    {
      heading: 'The move that does not guess',
      blocks: [
        paragraph(
          'Look for a cell whose row, column, and box have already used eight digits between them. The missing digit is the only one that cell can hold. That is a naked single. You did not try a number. The other eight were already spent.',
        ),
        paragraph(
          'The same check works the other way. If a digit is missing from a row, and eight cells of that row are closed to it by their columns or boxes, the ninth cell takes it. Start on the rows that are almost full. An empty row has nothing to say yet.',
        ),
      ],
    },
    {
      heading: 'Sudoku online',
      blocks: [
        paragraph(
          '[[https://www.websudoku.com/|Web Sudoku]] is a plain pad: easy through evil, digits 1 to 9, no account required to start a grid. Play that when the search was for Sudoku itself.',
        ),
        paragraph(
          'Play Crittermino when you want the other job for the number. Mouse is 2 cells, cat 3, dog 4, panda 5, lion 6. Homes connect edge to edge, and two homes of the same size cannot share a wall. The [[/how-to-play|rules]] fit on one screen, and the [[/|board]] is in the browser with no download. Neighbors of both games, including Kakuro and the Japanese crossword, are listed in [[/blog/best-free-logic-puzzles-2026|free logic puzzles online]].',
        ),
      ],
    },
  ],
  faqs: [
    {
      question: 'What are the rules of Sudoku?',
      answer:
        'Fill a 9×9 grid so each digit from 1 to 9 appears once in every row, once in every column, and once in every 3×3 box. Printed digits stay where they are.',
    },
    {
      question: 'Where can I play Sudoku online for free?',
      answer:
        'Web Sudoku is a free Sudoku in the browser. Crittermino is a different puzzle, Fillomino, on this site.',
    },
    {
      question: 'Is Fillomino the same as Sudoku?',
      answer:
        'No. Sudoku keeps each digit unique in a line and a box. Fillomino uses the number as the size of a connected region. The comparison is on the Fillomino versus Sudoku page.',
    },
  ],
}
