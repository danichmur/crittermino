import { paragraph, type BlogPost } from '@/lib/blog/types'

export const critterminoTips: BlogPost = {
  slug: 'crittermino-tips-and-strategies',
  title: 'Crittermino tips and strategies',
  description:
    'How the five animal homes behave, what the shake means, and how to use a hint without giving the grid away.',
  published: '2026-11-07',
  keywords: ['crittermino tips', 'fillomino strategy', 'animal puzzle'],
  sections: [
    {
      heading: 'Learn the five sizes as characters',
      blocks: [
        paragraph(
          'Mouse is 2, cat is 3, dog is 4, panda is 5, lion is 6. Say the size when you tap. "This cat needs one more cell" is a decision. "This feels like a cat" is a guess. The animals are the numbers. They are not decorations on top of a hidden number grid.',
        ),
        paragraph(
          'Levels 1 to 5 are lessons: a mouse home, then the larger neighbors, then a case where two homes of the same size share a wall and the board shakes. Play those before you hunt strategy. The [[/how-to-play|rules page]] has the same lesson in one screen.',
        ),
      ],
    },
    {
      heading: 'What the shake is telling you',
      blocks: [
        paragraph(
          'A region shakes when it is connected edge to edge and illegal. Either it is bigger than the animal allows, or it has joined another home of the same size. A corner touch does not shake. If the board shakes, undo the last cell before you place anything else. Two illegal regions on the same grid hide which cell caused the problem.',
        ),
        paragraph(
          'Givens do not move. If a mouse is printed in a cell, that cell stays a mouse. Building around it is the puzzle. Erasing it is not an option, which is why those cells ignore a tap.',
        ),
      ],
    },
    {
      heading: 'Close small homes, then route the large ones',
      blocks: [
        paragraph(
          'On the 5×5 boards, mouse, cat, and dog are the whole palette. Close every mouse you can see. Two cells is a short search, and each finished mouse is a barrier. Cats are next. Dogs need four cells, so they pick up whatever corridor the smaller homes left.',
        ),
        paragraph(
          'Panda joins at level 21. Lion joins at level 36. A six-cell lion on a 6×6 or 7×7 board is half a plan by itself. Sketch it in your head along the edge before you drop it in the middle. A lion in the center blocks four directions at once and is the usual reason a later dog has no room.',
        ),
      ],
    },
    {
      heading: 'Hints, the daily grid, and the campaign',
      blocks: [
        paragraph(
          'The hint button points at a forced cell or outlines a home from the solution. Use it when you have stared long enough to name the cell you distrust. Used as a first move, it skips the only skill the puzzle teaches.',
        ),
        paragraph(
          'The campaign is 300 levels, and the same level number is the same puzzle for everyone. The [[/daily-challenge|daily challenge]] borrows one of those grids for the UTC day. Clearing the daily does not move your campaign level and does not mark that level done. You can meet the grid again later and solve it as part of the path.',
        ),
        paragraph(
          'The long version, with a 4×4 you can finish by hand, is [[/blog/how-to-solve-fillomino-puzzles|how to solve Fillomino]]. The comparison with Sudoku is [[/blog/fillomino-vs-sudoku|Fillomino versus Sudoku]].',
        ),
      ],
    },
  ],
}
