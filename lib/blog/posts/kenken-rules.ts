import { list, paragraph, type BlogPost } from '@/lib/blog/types'

export const kenkenRules: BlogPost = {
  slug: 'kenken-rules',
  title: 'KenKen rules',
  description:
    'KenKen rules: 1 through n once in each row and column, and every cage hits its target with +, −, ×, or ÷.',
  published: '2026-11-10',
  keywords: ['kenken rules', 'how to play kenken', 'kenken puzzle', 'kenken online'],
  sections: [
    {
      heading: 'Rows, columns, and a cage',
      blocks: [
        paragraph(
          'KenKen is an n×n grid. A 4×4 uses the digits 1, 2, 3, and 4. A 6×6 uses 1 through 6. Each digit appears once in every row and once in every column. There are no 3×3 boxes. Heavy lines mark cages. Each cage shows a target and an operation: add, subtract, multiply, or divide. The digits in the cage, in some order, produce that target.',
        ),
        paragraph(
          'Crittermino is not KenKen. There is no arithmetic on these animals. The official puzzles are at [[https://www.kenkenpuzzle.com/|KenKen Puzzle]]. This page is the rule set, and the board on this site is Fillomino.',
        ),
      ],
    },
    {
      heading: 'How a cage is read',
      blocks: [
        list([
          'A cage labeled 3+ on two cells is two digits that add to 3.',
          'On a 4×4 those two digits are 1 and 2. Nothing else in 1–4 adds to 3 without a repeat, and a row cannot repeat anyway.',
          'A cage labeled 7+ on three cells needs three different digits from the grid’s set that add to 7.',
          'A one-cell cage has no operation. The number in the corner is the digit.',
          'Subtract and divide do not care about order. You may arrange the digits so the result comes out.',
          'A 2÷ cage is a pair where the larger divided by the smaller is 2. On a 4×4 that is 2 and 1, or 4 and 2.',
          'A 1− cage is a pair with a difference of 1.',
        ]),
      ],
    },
    {
      heading: 'What Sudoku habit gets wrong',
      blocks: [
        paragraph(
          'Sudoku’s box is not here. A digit may sit near itself around a corner as long as it does not share a row or a column. The cage is the extra constraint, and the cage is arithmetic, not a region size. [[/blog/sudoku-rules|Sudoku rules]] and [[/blog/killer-sudoku|killer sudoku rules]] both keep the 9×9 boxes. KenKen drops the boxes and names the operation.',
        ),
        paragraph(
          'Killer sudoku cages are sums only, always on 1–9, and the Sudoku boxes remain. KenKen cages can be a product or a quotient, and the digit set is the size of the grid. Kakuro is sums too, but on crossword runs rather than a Latin square. [[/blog/kakuro-rules|Kakuro rules]] are that other sum.',
        ),
      ],
    },
    {
      heading: 'Where to play KenKen',
      blocks: [
        paragraph(
          '[[https://www.kenkenpuzzle.com/|KenKen Puzzle]] is the official place to play. Start on a 4×4 or a 6×6 if the cages are new.',
        ),
        paragraph(
          'If you wanted a grid with no arithmetic, Crittermino is Fillomino: each animal home is a fixed number of cells, connected edge to edge, and two homes of the same size do not share a wall. The [[/how-to-play|rules]] and the [[/|game]] are on this site. No download and no account.',
        ),
      ],
    },
  ],
  faqs: [
    {
      question: 'What are the rules of KenKen?',
      answer:
        'On an n×n grid, place 1 through n once in each row and each column. Every cage’s digits must combine with the printed operation to make the printed target. A one-cell cage is that digit.',
    },
    {
      question: 'Does order matter in a KenKen cage?',
      answer:
        'For subtraction and division, no. Any order that produces the target is allowed. You use the larger digit minus, or divided by, the smaller one.',
    },
    {
      question: 'Is KenKen a kind of Sudoku?',
      answer:
        'It is a Latin square, so rows and columns do not repeat a digit. It has no boxes. Cages use addition, subtraction, multiplication, or division. Sudoku uses boxes and no arithmetic.',
    },
  ],
}
