import { list, paragraph, type BlogPost } from '@/lib/blog/types'

export const bestFreeLogicPuzzles2026: BlogPost = {
  slug: 'best-free-logic-puzzles-2026',
  title: 'Free logic puzzles online',
  description:
    'Free logic puzzles online, with no download: Fillomino, Sudoku, nonograms, bridges, light-up, galaxies, and logic grids.',
  published: '2026-11-08',
  updated: '2026-11-10',
  keywords: [
    'free logic puzzles online',
    'japanese logic puzzles',
    'nikoli puzzles online',
    'nonogram puzzle',
    'picross online',
    'bridges puzzle',
    'light up puzzle',
    'galaxies puzzle',
    'logic grid puzzles',
  ],
  sections: [
    {
      heading: 'What earned a place on this list',
      blocks: [
        paragraph(
          'These are free logic puzzle games you can open in a browser in 2026. Each one teaches a rule in about a minute, then asks you to finish a grid in one sitting. No store install. No account required to start. The list is not a ranking, and nobody paid for a place on it. It is eight ways of deducing, plus one daily word for the evening you want language instead of shape. The neighbors of Fillomino on this page are Nikoli puzzles: Bridges, Light Up, and Galaxies, plus nonograms and logic grids. Rules for [[/blog/sudoku-rules|Sudoku]], [[/blog/kakuro-rules|Kakuro]], [[/blog/killer-sudoku|killer sudoku]], [[/blog/kenken-rules|KenKen]], and the [[/blog/japanese-crossword|Japanese crossword]] each have their own page.',
        ),
        paragraph(
          'Crittermino is on the list because this site is that game. The other entries are other people’s puzzles. They are here because they are good to play, and because a person who likes one quiet grid often wants a second kind on a different day. If a link below ever stops being free, it stops belonging here.',
        ),
      ],
    },
    {
      heading: 'Crittermino',
      blocks: [
        paragraph(
          'A Fillomino board played with animal homes. You fill every cell. Mouse is 2 cells, cat 3, dog 4, panda 5, lion 6. A home connects edge to edge, and two homes of the same size cannot share a wall. There is a 300-level campaign. The same level number is the same puzzle for everyone. The [[/daily-challenge|daily grid]] borrows one of those boards for the UTC day, and clearing it does not skip your campaign level.',
        ),
        paragraph(
          'It is free, in the browser, with no download and no account. Start on the [[/|home page]]. The rules, including a board you can tap, are on [[/how-to-play|how to play]]. If you want the method written out, [[/blog/how-to-solve-fillomino-puzzles|how to solve Fillomino]] walks a full 4×4. If you are arriving from Sudoku, read [[/blog/fillomino-vs-sudoku|Fillomino versus Sudoku]] first so the number does not lie to you.',
        ),
      ],
    },
    {
      heading: 'Simon Tatham’s Filling',
      blocks: [
        paragraph(
          'Filling is Fillomino with numbers instead of animals. The number you write is the size of its region, and equal regions cannot touch by a side. Paper Fillomino also allows a region of 1 and sizes above 6, and this version keeps that wider palette. The collection has been free for years. The [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/filling.html|browser version of Filling]] needs nothing installed.',
        ),
        paragraph(
          'If you already like Crittermino, this is the same sport in a quieter uniform. It is also the right pick when you want to practice the tutorial’s counting step on sizes the animals do not include. Tatham’s other puzzles show up later on this list. Solo, in the same collection, is Sudoku, if you would rather keep every grid on one site.',
        ),
      ],
    },
    {
      heading: 'Web Sudoku',
      blocks: [
        paragraph(
          '[[https://www.websudoku.com/|Web Sudoku]] is a plain Sudoku pad: digits 1 to 9, rows, columns, and boxes. It is the right recommendation when you want the classic constraint and you do not want a themed board. The skill is scanning units until a cell has one legal digit. That skill feels related to Fillomino and then, on the first board, it is not. The [[/blog/fillomino-vs-sudoku|Fillomino Sudoku difference]] is which job the number has.',
        ),
        paragraph(
          'Play Sudoku on the day you want a rule you already trust. Play Fillomino on the day the rows feel automatic. Both are free logic puzzle games in the sense that matters here: one grid, a finish, no install. A week of only one of them tells you which silence you like better than any list does.',
        ),
      ],
    },
    {
      heading: 'Bridges puzzle',
      blocks: [
        paragraph(
          'Bridges gives you islands in open water. Each island has a number. You draw bridges between islands, horizontally or vertically, until every island has exactly that many bridge ends and every island is connected to the rest. Bridges do not cross. At most two bridges run between the same pair of islands. [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/bridges.html|Tatham’s Bridges]] is a clean free version.',
        ),
        paragraph(
          'The feeling is close to the late stage of a Fillomino. A number is a debt, and the geography limits how the debt can be paid. An island in a corner with a 4 has very few legal directions, the way a mouse in a corner has very few legal cells. People who liked counting the panda bridges in the Fillomino tutorial usually like the first forced bridge here for the same reason.',
        ),
      ],
    },
    {
      heading: 'Light Up puzzle',
      blocks: [
        paragraph(
          'Light Up, also called Akari, is a grid of white cells and black walls. You place bulbs on white cells. A bulb lights its row and column until a wall. Every white cell must be lit. Two bulbs cannot see each other. Some black cells carry a number, and that number is how many bulbs sit against their sides. [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/lightup.html|Tatham’s Light Up]] is free in the browser.',
        ),
        paragraph(
          'It belongs with free logic puzzle games because the deduction is local and then suddenly global. A black cell marked 4 in a wide-open spot wants four bulbs. A black cell marked 0 forbids every neighbor. The 0 is the same kind of gift as two equal Fillomino givens that already share a side: the rule has already spent the choice, and your job is to mark what follows.',
        ),
      ],
    },
    {
      heading: 'Nonogram puzzle',
      blocks: [
        paragraph(
          'A nonogram, also called picross or a Japanese crossword, fills a picture from counts on the edges. Each row and column lists the lengths of the filled runs, in order, with at least one empty cell between runs. You deduce which cells are ink and which stay empty. There is no region size in the Fillomino sense. You are reading runs. [[https://webpbn.com/|Web Paint-by-Number]] is the long-running free set. [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/pattern.html|Tatham’s Pattern]] is the same genre when you already have his collection open.',
        ),
        paragraph(
          'The last ten cells of a nonogram and the last ten cells of a Crittermino board collapse for the same reason. Once the board is tight, a single filled cell removes a run that no longer fits, and the rest of the line follows. People who like that click tend to like both. The picture at the end is a bonus. The logic is the point.',
        ),
      ],
    },
    {
      heading: 'Galaxies puzzle',
      blocks: [
        paragraph(
          'Galaxies, also called Spiral Galaxies or Tentai Show, partitions the grid into regions that have rotational symmetry. Each galaxy has a center mark, on a cell, an edge, or a corner, and the region looks the same after a half turn around that mark. You are not matching a number to a size. You are making every cell obey a center. [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/galaxies.html|Tatham’s Galaxies]] is a good free set.',
        ),
        paragraph(
          'It is the furthest item on this list from Sudoku, which is why it is here. If Fillomino’s "the number is a size" has started to feel familiar, symmetry is a new constraint that still uses a pencil and a finish line. The early moves are forced by centers that sit near the border. The late moves are the same tightness as a closing lion home.',
        ),
      ],
    },
    {
      heading: 'Logic grid puzzles',
      blocks: [
        paragraph(
          'A logic grid is a different genre, and it still belongs on a list of free logic puzzle games. You match people, places, and objects from clues such as "the baker is not next to the violin." You fill a crosshatch of yes and no until each category lines up. [[https://logic.puzzlebaron.com/|Puzzle Baron]] is a large free set of those grids.',
        ),
        paragraph(
          'It is not Fillomino, and a Fillomino game is not a logic grid. If the clue style is what you wanted when you searched, start there. If you wanted regions and sizes, stay with Filling or Crittermino. Both are deduction. They do not train the same eye. The notes on [[/blog/logic-puzzle-benefits|what a daily logic puzzle is good for]] stay with the habit of finishing, whichever grid you pick.',
        ),
      ],
    },
    {
      heading: 'A daily word, if you wanted language',
      blocks: [
        paragraph(
          '[[https://www.nytimes.com/games/wordle/index.html|Wordle]] is one five-letter word a day. It is not a region puzzle and it is not Sudoku. It is on this page because it is the cleanest "one puzzle, then you are done" habit on the web, and it is free in the browser. Play it when you want language. Skip it when the search that brought you here was for grids.',
        ),
        paragraph(
          'The Crittermino daily is the grid-shaped version of that habit. One board, the same board for everyone, then the day is done. You do not need both. You also do not need a streak. The useful part is the finish.',
        ),
      ],
    },
    {
      heading: 'How to choose one for today',
      blocks: [
        list([
          'You want shapes and a short campaign: Crittermino.',
          'You want Fillomino with pencil-style numbers, including sizes outside 2 to 6: Simon Tatham’s Filling.',
          'You want digits in rows and boxes: Web Sudoku.',
          'You want a number that is a debt on a map: Bridges.',
          'You want light, walls, and a few forced bulbs: Light Up.',
          'You want a picture to emerge from edge counts: a nonogram.',
          'You want symmetry instead of size: Galaxies.',
          'You want "who owns the zebra" clues: Puzzle Baron.',
          'You want one shared word and then a stop: Wordle.',
        ]),
        paragraph(
          'One finished grid is enough for a day. If the rule is still new, play the easiest size the site offers and leave when it is done. Free logic puzzle games are easy to turn into a pile of open tabs. The pile is not the hobby. The finished board is.',
        ),
      ],
    },
  ],
  faqs: [
    {
      question: 'What are the best free logic puzzle games in 2026?',
      answer:
        'For a browser session with no install: Crittermino and Simon Tatham’s Filling for Fillomino, Web Sudoku for digits, Tatham’s Bridges, Light Up, and Galaxies, Web Paint-by-Number for nonograms, and Puzzle Baron for logic grids. Wordle is the daily word if you wanted language instead.',
    },
    {
      question: 'Is Crittermino free?',
      answer:
        'Yes. It is a Fillomino game in the browser. There is no download, no account, and no ads. The [[/daily-challenge|daily puzzle]] is one grid for every player and changes at midnight UTC.',
    },
    {
      question: 'Where should I start if I already play Sudoku?',
      answer:
        'Read [[/blog/fillomino-vs-sudoku|Fillomino versus Sudoku]], then play a small board. Numbered Fillomino is [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/filling.html|Simon Tatham’s Filling]]. The animal version is Crittermino, and the [[/blog/how-to-solve-fillomino-puzzles|tutorial]] shows a full solve.',
    },
    {
      question: 'Do I need an account?',
      answer:
        'Not for the games on this list. Crittermino stores progress on the device. The others let you start a grid without signing in. If a site later asks for an account before the first puzzle, pick a different one.',
    },
  ],
}
