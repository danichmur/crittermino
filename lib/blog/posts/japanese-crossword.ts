import { list, paragraph, type BlogPost } from '@/lib/blog/types'

export const japaneseCrossword: BlogPost = {
  slug: 'japanese-crossword',
  title: 'Japanese crossword rules',
  description:
    'A Japanese crossword is a nonogram, also called picross. Edge numbers are the lengths of filled runs. How the gap works, and where to play.',
  published: '2026-11-10',
  keywords: ['japanese crossword', 'nonogram rules', 'picross online', 'how to solve a nonogram'],
  sections: [
    {
      heading: 'The numbers sit on the edges',
      blocks: [
        paragraph(
          'A Japanese crossword is a nonogram. English players also call it picross or griddlers. It is not a crossword of words, and it is not a puzzle written in Japanese. The clues are runs of filled cells. Each row and each column lists those runs in order. You paint cells and leave cells empty until the picture matches every clue.',
        ),
        paragraph(
          'Crittermino does not paint a picture. If the search was for the picture puzzle, play one at [[https://webpbn.com/|Web Paint-by-Number]]. The rules are here. The grid on this site is Fillomino, linked from the [[/how-to-play|how to play page]].',
        ),
      ],
    },
    {
      heading: 'Runs, in order, with a gap',
      blocks: [
        list([
          'A number is the length of one filled run.',
          'A row clue of 3 on a short row means three filled cells in a row.',
          'A clue of 2 1 means a run of two, then at least one empty cell, then a run of one.',
          'The runs stay in the order written, left to right or top to bottom.',
          'Empty cells may sit before the first run and after the last.',
          'Column clues obey the same rule, top to bottom.',
          'A cell is either filled or empty. There is no digit to place.',
        ]),
        paragraph(
          'On a row of five cells, the clue 5 fills the whole row. The clue 3 must cover three in a row, so the middle cell is filled no matter which end the run slides to. That overlap is the first deduction. You mark the cells every legal placement shares, and you leave the sliding ends unknown until a column says more.',
        ),
      ],
    },
    {
      heading: 'It is not a word crossword',
      blocks: [
        paragraph(
          'Nothing in the grid is a letter. A finished nonogram is a picture: a face, a tool, a small animal. The logic is counting runs, not vocabulary. In Russian the same puzzle is called a Japanese crossword and also a nonogram. Both names are this grid.',
        ),
        paragraph(
          'Fillomino also fills cells, and then the similarity ends. Fillomino regions have a size written inside the region. A nonogram’s numbers live outside the grid and describe ink, not a polyomino. [[/blog/how-to-solve-fillomino-puzzles|How to solve Fillomino]] is the other method. [[/blog/best-free-logic-puzzles-2026|Free logic puzzles online]] keeps both on one list.',
        ),
      ],
    },
    {
      heading: 'Where to play',
      blocks: [
        paragraph(
          '[[https://webpbn.com/|Web Paint-by-Number]] is a large free set of nonograms. [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/pattern.html|Simon Tatham’s Pattern]] is the same genre in his puzzle collection.',
        ),
        paragraph(
          'When you want regions instead of a picture, the Crittermino [[/|home page]] is a Fillomino: mouse 2, cat 3, dog 4, panda 5, lion 6. No download and no account.',
        ),
      ],
    },
  ],
  faqs: [
    {
      question: 'What is a Japanese crossword?',
      answer:
        'A picture puzzle, also called a nonogram or picross. Numbers on the edges say how long each filled run is, and in what order. You paint the cells that the clues force.',
    },
    {
      question: 'What does a nonogram clue of 2 1 mean?',
      answer:
        'A filled run of two cells, then at least one empty cell, then a filled run of one cell, in that order.',
    },
    {
      question: 'Is a Japanese crossword the same as Fillomino?',
      answer:
        'No. A nonogram builds a picture from edge counts. Fillomino divides the grid into regions whose size is written in the cells.',
    },
  ],
}
