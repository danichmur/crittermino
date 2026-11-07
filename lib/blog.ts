export interface ArticleBlock {
  kind: 'p' | 'ul'
  text?: string
  items?: readonly string[]
}

export interface ArticleSection {
  heading: string
  blocks: readonly ArticleBlock[]
}

export interface BlogPost {
  slug: string
  title: string
  description: string
  published: string
  keywords: readonly string[]
  sections: readonly ArticleSection[]
}

const paragraph = (text: string): ArticleBlock => ({ kind: 'p', text })
const list = (items: readonly string[]): ArticleBlock => ({ kind: 'ul', items })

export const BLOG_POSTS: readonly BlogPost[] = [
  {
    slug: 'how-to-solve-fillomino-puzzles',
    title: 'How to solve Fillomino puzzles',
    description:
      'A practical way to solve Fillomino: start from the givens, keep each region the right size, and stop same-size homes from sharing a wall.',
    published: '2026-11-07',
    keywords: ['how to solve fillomino', 'fillomino puzzle', 'fillomino rules'],
    sections: [
      {
        heading: 'Start from the numbers that are already there',
        blocks: [
          paragraph(
            'A Fillomino grid gives you a few cells and asks you to finish the rest. In the classic puzzle the given is a number. That number is the size of the region that cell belongs to. In Crittermino the given is an animal, and the animal is the size: mouse 2, cat 3, dog 4, panda 5, lion 6. The [[/how-to-play|how to play page]] shows the same rules with a board you can tap.',
          ),
          paragraph(
            'Do not scan the whole grid for a clever pattern on the first look. Pick one given and ask a smaller question: which cells can still belong to this home? A home is one connected shape. Cells join along a side. A corner does not count as a connection.',
          ),
        ],
      },
      {
        heading: 'Finish a home before you invent a new one',
        blocks: [
          paragraph(
            'If a mouse is sitting in a cell, that home still needs exactly one more cell. Look at the empty neighbors that share a side. Any neighbor that would glue this mouse to another mouse home is illegal. Any neighbor that would make the home three cells is also illegal once you place it. The legal cell is often the only one left.',
          ),
          paragraph(
            'Larger animals work the same way, with more room to be wrong. A lion needs six cells. Place two of them early and you have drawn a corridor the rest of the lion has to follow. If that corridor runs into the edge of the grid, count the cells that are still reachable. If you cannot reach six, those two cells were the wrong shape, not a mystery.',
          ),
        ],
      },
      {
        heading: 'Same size, no shared wall',
        blocks: [
          paragraph(
            'Two homes of the same size cannot share a side. They may touch at a corner. This is the rule that deletes options after the size rule has done its work. When two cats are close, the cells on the wall between them cannot be cats. Those cells still have to be some animal. That is useful: a banned animal is a clue, not a blank.',
          ),
          paragraph(
            'The shake in Crittermino is this rule, or the size rule, telling you the region you just made is illegal. Erase the last animal and try the other neighbor. The [[/blog/crittermino-tips-and-strategies|tips for this game]] stay with the five animals. The logic is the same if you are solving a numbered Fillomino on paper.',
          ),
        ],
      },
      {
        heading: 'When a cell can be only one animal',
        blocks: [
          paragraph(
            'After a few homes are closed, some empty cells have nowhere to go. Walk the remaining animals one at a time. If mouse, cat, dog, and panda all break a size or a wall, the cell is a lion, even if you cannot see the rest of the lion yet. Write that in. Then grow the lion from that cell the same way you grew the first given.',
          ),
          list([
            'Count the cells a home still needs.',
            'Cross out neighbors that would touch another home of that size.',
            'Cross out shapes that cannot reach the right count before they hit a wall or the edge.',
            'Place the animal only when one option remains. Guessing fills the grid faster and then traps you.',
          ]),
        ],
      },
      {
        heading: 'A short loop when you are stuck',
        blocks: [
          paragraph(
            'Stop adding animals. Find the given with the smallest unfinished home. Mouse and cat close first, and a closed home is a wall the larger animals have to route around. If every small home is done, look for a cell touched by two homes of one size. That cell is banned for that size, which often forces the animal on the other side.',
          ),
          paragraph(
            'Published Crittermino levels have one solution. If two placements both seem legal, one of them breaks a home you have not counted yet. Go back to the last animal you were unsure about. The [[/daily-challenge|daily puzzle]] is a good place to practice one grid without marching through the campaign.',
          ),
        ],
      },
    ],
  },
  {
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
            'If you want the paper version of this logic, the [[/blog/how-to-solve-fillomino-puzzles|Fillomino solving notes]] stay with numbers instead of animals. The comparison with Sudoku is on the [[/blog/fillomino-vs-sudoku-differences|differences page]].',
          ),
        ],
      },
    ],
  },
  {
    slug: 'best-brain-puzzle-games-2026',
    title: 'Best free brain puzzle games for 2026',
    description:
      'Six browser puzzles you can play without a download: Fillomino, Sudoku, a daily word, nonograms, and logic grids. What each one asks of you.',
    published: '2026-11-07',
    keywords: ['best brain puzzle games 2026', 'free puzzle games', 'browser puzzle'],
    sections: [
      {
        heading: 'What "best" means on this list',
        blocks: [
          paragraph(
            'A puzzle earns a place here if you can open it in a browser, learn the rules in a minute, and finish a grid in one sitting. No store install. No account required to start. The list is six games, each a different shape of logic, so you can pick by the kind of thinking you want today.',
          ),
          paragraph(
            'Crittermino is on the list because this site is that game. The other five are other people’s puzzles. They are here because they are good, not because they lead back to us.',
          ),
        ],
      },
      {
        heading: 'Crittermino',
        blocks: [
          paragraph(
            'A Fillomino board played with animal homes. You fill every cell. Mouse is 2 cells, cat 3, dog 4, panda 5, lion 6. Same-size homes cannot share a wall. There is a 300-level campaign and a [[/daily-challenge|daily grid]] that is the same for everyone. Free, in the browser, no account. Start on the [[/|home page]].',
          ),
        ],
      },
      {
        heading: 'Simon Tatham’s Filling',
        blocks: [
          paragraph(
            'Filling is Fillomino with numbers instead of animals. The number you write in a cell is the size of its region, and equal regions cannot touch by a side. The collection has been free for years, and the [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/filling.html|browser version of Filling]] needs nothing installed. If you already like Crittermino, this is the same sport in a quieter uniform. His Solo puzzle, in the same collection, is Sudoku.',
          ),
        ],
      },
      {
        heading: 'Web Sudoku',
        blocks: [
          paragraph(
            '[[https://www.websudoku.com/|Web Sudoku]] is a plain Sudoku pad: digits 1 to 9, rows, columns, and boxes. It is the right recommendation when you want the classic constraint and you do not want a themed board. The difference between that constraint and Fillomino is the subject of [[/blog/fillomino-vs-sudoku-differences|Fillomino versus Sudoku]].',
          ),
        ],
      },
      {
        heading: 'Wordle',
        blocks: [
          paragraph(
            '[[https://www.nytimes.com/games/wordle/index.html|Wordle]] is one five-letter word a day. It is not a grid of regions. It is on this list because it is the cleanest "one puzzle, then you are done" habit on the web, and it is free in the browser. Play it when you want language instead of shape.',
          ),
        ],
      },
      {
        heading: 'Web Paint-by-Number',
        blocks: [
          paragraph(
            'Nonograms fill a picture from counts on the edges. You deduce which cells are ink and which are empty. [[https://webpbn.com/|Web Paint-by-Number]] is the long-running free set. The skill is different from Fillomino: you are reading runs of cells, not growing a region to a fixed size. People who like the last ten cells of a Crittermino board often like the last ten cells of a nonogram for the same reason. Both collapse once the board is tight.',
          ),
        ],
      },
      {
        heading: 'Puzzle Baron logic grids',
        blocks: [
          paragraph(
            'A logic grid puzzle is a different genre. You match people, places, and objects with clues like "the baker is not next to the violin." [[https://logic.puzzlebaron.com/|Puzzle Baron]] is a large free set of those grids. It belongs on a brain-puzzle list. It is not Fillomino, and a Fillomino game is not a logic grid. If the clue style is what you wanted, start there. If you wanted regions and sizes, stay with Filling or Crittermino.',
          ),
        ],
      },
      {
        heading: 'How to choose one for today',
        blocks: [
          list([
            'You want shapes and a cute board: Crittermino.',
            'You want Fillomino with pencil-style numbers: Simon Tatham’s Filling.',
            'You want digits in rows and boxes: Web Sudoku.',
            'You want one shared puzzle and then a stop: Wordle, or the Crittermino daily.',
            'You want a picture to emerge: Web Paint-by-Number.',
            'You want "who owns the zebra" clues: Puzzle Baron.',
          ]),
          paragraph(
            'One finished grid is enough for a day. The notes on [[/blog/logic-puzzle-benefits|what a daily logic puzzle is good for]] stay with the habit, not with a ranking.',
          ),
        ],
      },
    ],
  },
  {
    slug: 'fillomino-vs-sudoku-differences',
    title: 'Fillomino versus Sudoku',
    description:
      'Sudoku fills digits so each row and box is a set. Fillomino fills regions so each number is a size. Where they feel alike, and where they do not.',
    published: '2026-11-07',
    keywords: ['sudoku alternative puzzle', 'fillomino vs sudoku', 'fillomino rules'],
    sections: [
      {
        heading: 'The number means a different thing',
        blocks: [
          paragraph(
            'In Sudoku, a 4 is the value four. It must show up once in the row, once in the column, and once in the box. In Fillomino, a 4 is a size. Every cell in that region is a 4, and the region contains four cells. Seeing two 4s next to each other is normal in Fillomino. It is the mistake Sudoku exists to prevent.',
          ),
          paragraph(
            'Crittermino makes the size an animal so you do not have to remember that the digit is a count. A dog is four cells. You still cannot put two dog homes against each other. That wall rule is Fillomino’s version of Sudoku’s "this digit is already used."',
          ),
        ],
      },
      {
        heading: 'What you are allowed to repeat',
        blocks: [
          paragraph(
            'Sudoku bans repeats inside a line and a box. The shape of a region barely matters, as long as the digit sits in a legal cell. Fillomino barely cares about rows. It cares that a region is one piece, that the piece has the right number of cells, and that another piece of that size does not share a side.',
          ),
          paragraph(
            'That is why a Sudoku habit can feel lost on a first Fillomino. Scanning a row for a missing digit does nothing. You scan outward from a given and ask how the home can grow. The [[/blog/how-to-solve-fillomino-puzzles|solving notes]] are that scan, written as steps.',
          ),
        ],
      },
      {
        heading: 'What feels the same',
        blocks: [
          paragraph(
            'Both puzzles are pen-and-logic grids with one intended solution. Both punish a guess that was only "likely." Both get tight near the end, when the last cells are forced by homes or digits you have already placed. If you like the moment a Sudoku box accepts its last digit, you will recognize the moment a Fillomino home closes and the neighboring cell loses an option.',
          ),
          list([
            'One solution, if the puzzle is honest.',
            'Givens you cannot change.',
            'A short session on a small grid, a longer one on a large grid.',
            'No language skill required. Word games are a separate hobby.',
          ]),
        ],
      },
      {
        heading: 'Which one to open',
        blocks: [
          paragraph(
            'Stay with Sudoku when you want the comfort of a rule you already dream in. [[https://www.websudoku.com/|Web Sudoku]] is a direct place to do that. Switch to Fillomino when the rows feel automatic and you want the constraint to be a shape. [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/filling.html|Simon Tatham’s Filling]] is the numbered form. Crittermino is the same form with animals, a campaign, and a [[/daily-challenge|daily grid]].',
          ),
          paragraph(
            'Neither replaces the other. A week of only one of them is how you find out which silence you like. The [[/how-to-play|Crittermino rules]] take less than a minute if Fillomino is the one you have not tried.',
          ),
        ],
      },
    ],
  },
  {
    slug: 'logic-puzzle-benefits',
    title: 'What a daily logic puzzle is good for',
    description:
      'A short logic grid gives you a finished piece of attention. What that practice supports, and what it does not claim to treat.',
    published: '2026-11-07',
    keywords: ['logic puzzle benefits', 'daily puzzle habit', 'brain puzzle'],
    sections: [
      {
        heading: 'A grid has a finish line',
        blocks: [
          paragraph(
            'Most of the attention you spend online does not end. A logic puzzle does. The board is full, the homes are legal, and you stop. That closing is the useful part. You held a few constraints in mind, you checked them against the grid, and you got a yes or a no from the rules rather than from a score designed to keep you tapping.',
          ),
          paragraph(
            'Crittermino is built for one sitting. Early levels are a 3×3 or 4×4 lesson. Later boards are 5×5, 6×6, and 7×7. The [[/daily-challenge|daily puzzle]] is one of those boards, shared, and then the day is done.',
          ),
        ],
      },
      {
        heading: 'What you are actually practicing',
        blocks: [
          paragraph(
            'You practice keeping a small plan while the board changes. A dog home needs four connected cells. You place one, and you still have to remember the other three and the animals that are not allowed to touch it. That is ordinary working memory, aimed at a task with a visible end.',
          ),
          paragraph(
            'You also practice undoing a confident mistake. The shake is immediate. The cell is wrong, the rule is the same rule as ten minutes ago, and the fix is to remove the animal. People who play a lot of puzzles get faster at that recovery. The speed is not a personality upgrade. It is familiarity with this kind of constraint.',
          ),
          list([
            'Naming the constraint before you place a cell.',
            'Closing a small region so a larger one has a boundary.',
            'Stopping when the grid is done, instead of starting another by reflex.',
          ]),
        ],
      },
      {
        heading: 'What a puzzle does not do',
        blocks: [
          paragraph(
            'A Fillomino habit is not a medical treatment. It does not raise a measured IQ, and it does not prevent dementia. Anyone selling a brain game on those claims is selling past the evidence. The honest benefit is the session itself: a quiet problem, a clear finish, and a rule you can explain to someone else.',
          ),
          paragraph(
            'If you want that session, one grid is the right dose. The [[/blog/crittermino-tips-and-strategies|strategy notes]] help when the rules are still new. The [[/how-to-play|how to play page]] is enough if you would rather learn by tapping.',
          ),
        ],
      },
      {
        heading: 'A way to start that stays small',
        blocks: [
          paragraph(
            'Play the daily, or play level 1 if you have never met the animals. When the board is finished, leave the site. The benefit people notice after a few weeks is the boundary, not a streak number. The streak in the game only records that you came back. It is a reminder, not a score you owe.',
          ),
        ],
      },
    ],
  },
]

export const getPost = (slug: string): BlogPost | undefined => BLOG_POSTS.find((post) => post.slug === slug)

/** Format YYYY-MM-DD in UTC so the server and the browser print the same day. */
export const formatPublished = (isoDate: string): string => {
  const [year, month, day] = isoDate.split('-').map(Number)
  if (!year || !month || !day) return isoDate
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)))
}
