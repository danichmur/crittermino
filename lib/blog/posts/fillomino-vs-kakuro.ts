import { mouse } from '@/lib/blog/cells'
import { board, list, paragraph, type BlogPost } from '@/lib/blog/types'

export const fillominoVsKakuro: BlogPost = {
  slug: 'fillomino-vs-kakuro',
  title: 'Fillomino, a Kakuro alternative',
  description:
    'A puzzle like Kakuro, without the sums. Fillomino keeps the quiet grid. The number is a region size, not a total a run of digits has to reach.',
  published: '2026-11-16',
  keywords: ['kakuro alternative', 'puzzles like kakuro', 'games like kakuro', 'fillomino vs kakuro'],
  sections: [
    {
      heading: 'If you like Kakuro, try Fillomino',
      blocks: [
        paragraph(
          'If you like Kakuro, try Fillomino. You still get a grid, a few printed clues, and one intended solution. You still lose when a likely digit paints you into a corner. What changes is the job of the number. Kakuro uses a number as a sum. Fillomino uses a number as a size.',
        ),
        paragraph(
          'Kakuro asks you to fill straight runs with digits from 1 to 9 so each run adds up to its clue, and no digit repeats inside that run. Fillomino asks you to grow regions so the number in a cell is the size of its region, and two regions of the same size do not share a side. People who solve Kakuro already know how to hold two constraints on one cell. Fillomino spends that skill on shape instead of on arithmetic. The [[/blog/how-to-solve-fillomino-puzzles|Fillomino tutorial]] walks a 4×4. This page is the translation. The [[/blog/kakuro-rules|Kakuro rules]] stay on their own page if the sums are what you came for.',
        ),
      ],
    },
    {
      heading: 'A sum, then a size',
      blocks: [
        paragraph(
          'In Kakuro, a small 4 printed in a black cell is a total. The white run it points at must add up to 4. A run of two cells that sums to 4 can be 1 and 3. It cannot be 2 and 2, because a run cannot repeat a digit. You may not know the order yet. You do know that neither cell is a 2.',
        ),
        paragraph(
          'In Fillomino, a 2 is a size. The home is two cells, and both of them are that size. The repeat Kakuro just forbade is the whole region. Crittermino prints an animal instead of the digit, so you do not have to remember that the mark is a count. A mouse is two cells. The pair below is one finished mouse home. Kakuro would refuse it on sight.',
        ),
        board(
          'Two mice sharing a side, one Fillomino region of size 2.',
          'One home of two. In Fillomino the repeat is the region. In Kakuro a run cannot repeat a digit, so 2 and 2 is never a legal sum.',
          [[mouse(), mouse()]],
        ),
        paragraph(
          'The animals in Crittermino stop at 6: mouse 2, cat 3, dog 4, panda 5, lion 6. Paper Fillomino also allows a 1 and, on a big grid, a 7 or more. Kakuro is fixed at digits 1 through 9, and a run is only as long as the white cells between walls. A long Kakuro run is still arithmetic. A long Fillomino region is still a count of cells.',
        ),
      ],
    },
    {
      heading: 'Straight runs, then shapes',
      blocks: [
        paragraph(
          'Kakuro only reads straight lines. An across run goes right from its clue until a wall. A down run goes down. A cell sits in one across run and one down run, and it has to satisfy both sums. The shape of a "region" is not a question. If the cells do not share a full side in a straight line, they are not a run.',
        ),
        paragraph(
          'Fillomino barely cares about the line. A home is one piece, the piece has the right number of cells, and another piece of that size does not share a side. The piece may bend. A square of four dogs is one legal dog home. Kakuro cannot see that square as a unit. It would see two across pairs and two down pairs, then demand a different digit in every cell of each pair.',
        ),
        paragraph(
          'Cells in Fillomino join along an edge. A corner does not connect them, and a corner does not separate two equal homes either. Two mouse homes may touch at a corner. Two mouse homes that share a side are one home of four, or two illegal homes, and either reading fails.',
        ),
      ],
    },
    {
      heading: 'What you are allowed to repeat',
      blocks: [
        paragraph(
          'Kakuro spends the puzzle stopping repeats inside a run, then checking a total. The same digit may appear in a different run. It may not appear twice in the run you are filling. A finished Kakuro can be checked by adding.',
        ),
        paragraph(
          'Fillomino requires the repeat inside the home: a size of 2 is two of the same animal, side by side, in one piece. The repeat it forbids is a different one. Two separate homes of that size cannot share a side. There is nothing to add. A finished Fillomino can be checked by counting cells and looking at walls.',
        ),
        list([
          'Kakuro: digits 1 to 9, no zero, no repeat inside a run, and the run adds up to its clue.',
          'Fillomino: each home once, at the size written inside it, kept apart from other homes of that size.',
          'Kakuro: one cell owes two sums, across and down.',
          'Fillomino: one cell owes one home, and the wall it shares tells the neighbor which animal it cannot be.',
        ]),
      ],
    },
    {
      heading: 'What feels the same',
      blocks: [
        paragraph(
          'Both puzzles are pen-and-logic grids with one intended solution when the setter is honest. Both punish a guess that was only likely. Both get tight near the end, when the last cells are forced by runs or homes you have already placed. If you like the moment a Kakuro run accepts its last digit because nothing else sums, you will recognize the moment a Fillomino home closes and the neighboring cell loses an option.',
        ),
        paragraph(
          'Both reward the same pause. Name the constraint before you write. In Kakuro that sentence is "these two cells sum to 4, so they are 1 and 3 in some order." In Fillomino it is "this mouse still needs one cell, and only one neighbor keeps it off the other mouse." The words change. The habit of speaking the constraint is the part that transfers.',
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
      heading: 'Where a Kakuro habit helps, and where it stalls',
      blocks: [
        paragraph(
          'The habit that helps is the short list. Kakuro players already look at a run and cross off every digit that cannot belong. A two-cell sum of 4 leaves 1 and 3. Fillomino asks for the same list in a different costume: which sizes can this empty cell still be, once the walls, the border, and the homes already placed have spent the rest. The tutorial walks that count on a real 4×4.',
        ),
        paragraph(
          'The habit that stalls is addition, and the reflex that a repeated digit is a mistake. On a Fillomino board a row of four dogs can be one finished, legal home. Adding them is the wrong question. Splitting them because they repeat is also the wrong question. Ask whether they are one piece of the right size, and whether that piece shares a side with another piece of the same size.',
        ),
      ],
    },
    {
      heading: 'Which grid to open',
      blocks: [
        paragraph(
          'Stay with Kakuro when you want the sums. [[https://kakuro.com/|Kakuro.com]] deals free puzzles in the browser. The [[/blog/kakuro-rules|Kakuro rules]] on this site are the two constraints on one page, including the run of two that sums to 4.',
        ),
        paragraph(
          'Switch to Fillomino when the arithmetic feels automatic and you want the constraint to be a shape. [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/filling.html|Simon Tatham’s Filling]] is Fillomino with pencil-style numbers, and the sizes are not limited to the five animals. Crittermino is the same form with animals, a 300-level campaign, and a [[/daily-challenge|daily grid]] that is the same for everyone. Free, in the browser, no account. The [[/how-to-play|rules]] take less than a minute.',
        ),
        paragraph(
          'Neither replaces the other. If the number you already know is a Sudoku digit, the matching page is [[/blog/fillomino-vs-sudoku|Fillomino versus Sudoku]]. If it is an ink run on the edge of a picture, it is [[/blog/fillomino-vs-nonogram|Fillomino versus a nonogram]]. A week of only one grid is how you find out which silence you like.',
        ),
      ],
    },
  ],
  faqs: [
    {
      question: 'What is the difference between Fillomino and Kakuro?',
      answer:
        'In Kakuro a number is a sum. A straight run of digits adds up to that clue, and no digit repeats inside the run. In Fillomino a number is a size: the region has that many cells, every cell in it carries that size, and the region may bend. Two regions of the same size cannot share a side. Fillomino has no sums.',
    },
    {
      question: 'If I like Kakuro, will I like Fillomino?',
      answer:
        'Often, if what you like is a short list of legal choices and a grid that punishes a guess. Kakuro builds that list with addition. Fillomino builds it by counting cells and walls. The [[/blog/how-to-solve-fillomino-puzzles|tutorial]] is the way in, and Crittermino is that puzzle with animals.',
    },
    {
      question: 'Why is 2 and 2 legal in one puzzle and not the other?',
      answer:
        'Kakuro forbids a repeated digit inside a run, so two cells that sum to 4 are 1 and 3, never 2 and 2. Fillomino requires the repeat: a mouse home is two mice sharing a side. The same pair of marks is the mistake in Kakuro and the finished region in Fillomino.',
    },
    {
      question: 'Where can I play each one for free?',
      answer:
        'Kakuro: [[https://kakuro.com/|Kakuro.com]]. Numbered Fillomino: [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/filling.html|Simon Tatham’s Filling]]. Fillomino with animals: the [[/|Crittermino home page]], including a [[/daily-challenge|daily puzzle]].',
    },
  ],
}
