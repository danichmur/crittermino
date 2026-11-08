import { blank, cat, lion, mouse, panda } from '@/lib/blog/cells'
import { board, list, paragraph, type BlogPost } from '@/lib/blog/types'

const empty = blank()

export const howToSolveFillomino: BlogPost = {
  slug: 'how-to-solve-fillomino-puzzles',
  title: 'How to solve Fillomino puzzles',
  description:
    'A Fillomino tutorial for how to solve Fillomino: what the number means, how regions grow, and a 4×4 you can finish by hand.',
  published: '2026-11-07',
  updated: '2026-11-08',
  keywords: ['fillomino tutorial', 'how to solve fillomino', 'fillomino rules', 'fillomino puzzle'],
  sections: [
    {
      heading: 'What the number is asking',
      blocks: [
        paragraph(
          'This Fillomino tutorial is a way to learn how to solve Fillomino without guessing. The number in a cell is the size of its region. A 4 means four connected cells, and every one of those cells is a 4. Two regions of that size stay apart: they never share a side. The rest of the guide is that rule, practiced on a 4×4 you can check by hand, then played with the animals in Crittermino.',
        ),
        paragraph(
          'Crittermino uses the same puzzle. Mouse is 2, cat is 3, dog is 4, panda is 5, and lion is 6. If you would rather tap than write numbers, the [[/how-to-play|how to play page]] has a board you can fill. This page stays with the logic. The pictures use animals so the size is visible. On paper, write the number instead.',
        ),
      ],
    },
    {
      heading: 'The three rules',
      blocks: [
        paragraph(
          'Every legal grid obeys three rules. The grid is full: every cell belongs to a region. A region is one piece: cells join along a side, and a corner does not connect them. The number in the region is the count of cells in that piece, and the same number is written in every cell of the piece. A region of four 4s can be a straight line, a square, or a bend. The shape can turn. It stays in one piece.',
        ),
        paragraph(
          'Homes of the same size stay apart. They may touch at a corner. A region of 4s may share a side with a region of 3s. In Crittermino that sentence is: two dog homes keep a wall between them, and a dog home may sit against a cat home. There is no rule about rows, columns, or boxes. Checking a line for a missing digit is Sudoku. The [[/blog/fillomino-vs-sudoku|difference between Fillomino and Sudoku]] is its own page. For the rest of this tutorial, watch the regions.',
        ),
        board(
          'Two mouse homes touch at a corner. Each home is two cells.',
          'Legal. The homes meet at a corner, so each mouse home can stay size 2.',
          [
            [mouse(), mouse(), empty, empty],
            [empty, empty, mouse(), mouse()],
          ],
        ),
        board(
          'Two mouse homes share a side, so the board marks them wrong.',
          'Illegal. Each pair is the right size, and the pairs share a side. Same size, shared wall.',
          [
            [mouse('bad'), mouse('bad'), empty],
            [empty, mouse('bad'), mouse('bad')],
          ],
        ),
        board(
          'Three mice in a row, one cell too many.',
          'Illegal for a different reason. Three connected mice are a home of three. A mouse home is two cells.',
          [[mouse('bad'), mouse('bad'), mouse('bad')]],
        ),
      ],
    },
    {
      heading: 'Paper Fillomino and the five animals',
      blocks: [
        paragraph(
          'A printed number is a given. You keep it. On paper, Fillomino also allows a 1, a region of one cell, and sizes larger than 6 when the grid has room. A region can exist with no given at all. You discover it from the cells that are left. Two givens of the same number can sit inside one region, and a region can hold a single given.',
        ),
        paragraph(
          'Crittermino uses five animals, so the only sizes are 2, 3, 4, 5, and 6. There is no mouse of one cell and no region of seven. The solving habits are the same. The palette is shorter, which is why a small board can be finished in one sitting. Levels in the campaign use that palette only. The worked grid below stays inside it, so you can replay the same steps in the game.',
        ),
      ],
    },
    {
      heading: 'How to solve Fillomino from a single given',
      blocks: [
        paragraph(
          'Do not hunt for a pattern across the whole grid on the first pass. Pick the given with the smallest number. A small region has fewer shapes. A 2 in a corner has two neighbors that share a side. The region needs exactly one more cell, so exactly one of those neighbors joins it. You may not know which one yet. You do know the region cannot take both, because both would make a home of three.',
        ),
        paragraph(
          'A large given pushes the other way. A 6 needs six connected cells. Place it against the edge and count the cells it can still reach before it hits the border or a home you have already closed. If that count is under six, the shape is impossible, and the cell you added last is the one to remove.',
        ),
        paragraph(
          'Say the number of cells still missing before you write. "This cat needs one more cell" is a decision. "This feels like a cat" is a guess. Guesses are what make the last third of the grid impossible. On an honest puzzle the next cell is forced. Published Crittermino levels have one solution. If two placements both look legal, one of them breaks a home you have not counted yet.',
        ),
      ],
    },
    {
      heading: 'Equal givens that share a side',
      blocks: [
        paragraph(
          'If two givens show the same number and they share a side, they are the same region. They have to be. Separate regions of that size are not allowed to share a side, and these two cells already do. Mark them as joined, then look for the rest of the shape. Two adjacent 5s are two cells of one five-cell home, and that home still needs three more cells.',
        ),
        paragraph(
          'The diagonal is a different fact. Two 5s that touch only at a corner may be the same region, if some later cell connects them, or they may be two regions. The corner does not force a join, and it does not forbid one. Leave that pair alone until another rule speaks. Beginners skip the side-join because it feels quiet. It is the fastest deduction in the puzzle.',
        ),
      ],
    },
    {
      heading: 'Count the cells the givens have already spent',
      blocks: [
        paragraph(
          'Before you invent a new region, add the sizes you are already committed to. Each given of size N claims N cells, unless you have proved it shares its region with another given of N. Separate regions cannot share those cells. If the sum is bigger than the grid, the split is wrong, and some of the equal givens are the same home.',
        ),
        paragraph(
          'This is the step that unlocks the 4×4 below. The grid has 16 cells and three pandas. A panda is 5. Three separate panda homes would claim 15 cells, and the lion, the cat, and the mouse still need homes. Two panda homes would claim 10. A lion is 6, a cat is 3, and a mouse is 2. Ten plus six plus three plus two is 21, which is more than 16. The three pandas are one home of five. That home has room for exactly two cells besides the printed ones.',
        ),
        paragraph(
          'Eleven cells remain. The grid shows two lions. Two separate lion homes would claim 12 cells, and only 11 are left, so the two lions are one home of six even though they do not touch yet. A count that forbids a split is as good as a wall. Six plus three plus two is eleven. Every remaining cell is lion, cat, or mouse. There is no hidden dog and no second cat.',
        ),
      ],
    },
    {
      heading: 'A 4×4 you can finish by hand',
      blocks: [
        paragraph(
          'Here is the starting grid. Printed animals stay on the lighter color. Cells the rules add are on the deeper color. Rows run from top to bottom, columns from left to right.',
        ),
        board(
          'Starting 4 by 4. Lions in row 1 column 1 and row 3 column 1. Pandas in row 1 column 4, row 2 column 3, and row 4 column 4. Cat in row 3 column 2. Mouse in row 4 column 1.',
          'Seven givens. Lion is 6, panda is 5, cat is 3, mouse is 2. The white cells are yours.',
          [
            [lion(), empty, empty, panda()],
            [empty, empty, panda(), empty],
            [lion(), cat(), empty, empty],
            [mouse(), empty, empty, panda()],
          ],
        ),
        paragraph(
          'The count above already says the three pandas are one home of five, so you may add exactly two cells. The printed pandas do not touch. Call them top (row 1, column 4), middle (row 2, column 3), and bottom (row 4, column 4). Top and middle have two common neighbors: row 1 column 3, and row 2 column 4. One of those cells joins them. Middle and bottom have no common neighbor. The shortest path between them uses two extra cells. The whole home can spend only two extra cells, so the join from top to middle has to cost one, and that one cell has to sit on the road to the bottom.',
        ),
        paragraph(
          'Row 2 column 4 is that cell. It touches the top panda and the middle panda. The one cell you have left is row 3 column 4, which touches both that bridge and the bottom panda. The home is the three printed pandas plus those two bridges. The other upper bridge, row 1 column 3, joins top to middle and then leaves the bottom panda two steps away with one step in the budget. It does not fit. This pair is the only pair that does.',
        ),
        board(
          'Panda home closed on the 4 by 4. New pandas in row 2 column 4 and row 3 column 4.',
          'The two deeper green cells are the only bridges that join the three pandas into one home of five.',
          [
            [lion(), empty, empty, panda()],
            [empty, empty, panda(), panda('found')],
            [lion(), cat(), empty, panda('found')],
            [mouse(), empty, empty, panda()],
          ],
        ),
        paragraph(
          'The mouse sits in the bottom-left corner. A mouse home is two cells. That corner has two neighbors: the cell above, and the cell to the right. The cell above is already a lion, so it stays a lion. The cell to the right is free. Place the mouse there. The mouse home is closed.',
        ),
        board(
          'Mouse home closed. The second mouse is in row 4 column 2.',
          'The corner mouse cannot use the lion above it. The cell to the right is the second mouse cell.',
          [
            [lion(), empty, empty, panda()],
            [empty, empty, panda(), panda('found')],
            [lion(), cat(), empty, panda('found')],
            [mouse(), mouse('found'), empty, panda()],
          ],
        ),
        paragraph(
          'The cat in row 3 column 2 needs two more cells. Its left neighbor is the printed lion. Its lower-left neighbor is the mouse you just placed. The open neighbors are above it (row 2, column 2) and to its right (row 3, column 3).',
        ),
        paragraph(
          'Suppose the cat takes both of those and stops: row 2 column 2, the given, and row 3 column 3. The cell under that right-hand cat, row 4 column 3, then has a mouse on the left, a panda on the right, and a cat above. Nothing of the lion can reach it. That cell would be stranded, so this cat shape is illegal.',
        ),
        paragraph(
          'Suppose instead the cat grows upward and never takes the cell on its right. One try is the cell above the cat plus the cell above that. The empty cell in row 1 column 3 is then walled in by that cat and by two pandas. Another try puts a cat on row 2 column 1, between the two printed lions. Both roads out of the lower lion, up and right, are cats, so the two lion givens can never meet. Both tries break the lion home the count already required.',
        ),
        paragraph(
          'The shape that remains runs to the right of the cat and then down. Those two cells are cats. The right-hand cell has nowhere else to grow: left is the cat, right is a panda, above is a panda, and below is free. Once the upward shapes are illegal, down is the only second cell.',
        ),
        board(
          'Finished 4 by 4. Cats in row 3 column 3 and row 4 column 3. Lions fill row 1 columns 2 and 3, and row 2 columns 1 and 2.',
          'The deeper yellow cells close the cat. The six lion cells are one connected home. Each size appears once.',
          [
            [lion(), lion('found'), lion('found'), panda()],
            [lion('found'), lion('found'), panda(), panda('found')],
            [lion(), cat(), cat('found'), panda('found')],
            [mouse(), mouse('found'), cat('found'), panda()],
          ],
        ),
        paragraph(
          'Count the lion. It owns both printed lions, row 1 columns 2 and 3, and row 2 columns 1 and 2. That is six cells. They connect by sides: along the top row, down into row 2, and from the lower printed lion up into that same row. They do not spill into the panda, the cat, or the mouse. The grid is full. Same-size homes never meet, because each size appears once.',
        ),
        paragraph(
          'Read that again as a method, not as a trick for this one picture. Count the claims until a split no longer fits. Spend the spare cells on bridges. Close the smallest home whose neighbor is already blocked. Reject a shape that strands a cell or cuts a required home in two. The cells that remain are the last home, and you still check the size and the connection. That loop is how to solve Fillomino on a larger grid too.',
        ),
      ],
    },
    {
      heading: 'A region with no given',
      blocks: [
        paragraph(
          'A region does not need a printed clue. In the 4×4 the count used every cell, so nothing was hiding. On a larger board the homes you can prove will leave a patch of empty cells. Count that patch. If the cells are one connected shape, and a home of that size is not already sharing a side with them, you have found a region that had no given. Write the number, or the animal, in every cell of it.',
        ),
        paragraph(
          'If the leftover cells are not connected, they are more than one hidden home. Split them so each piece has a legal size and equal pieces stay apart. This is the usual last step, and it is also where a wrong bridge from ten minutes ago finally shows. A leftover of seven cells, in a game that has no size 7, is a split you missed or a bridge you added too early.',
        ),
      ],
    },
    {
      heading: 'When only one number fits',
      blocks: [
        paragraph(
          'After a few homes close, some empty cells have one legal size. Try the sizes one at a time. If 2, 3, 4, and 5 each break a size or a wall, the cell is a 6, even when you cannot see the other five cells of that home yet. Write it in. Then grow the home from that cell the same way you grew the first given.',
        ),
        paragraph(
          'A banned size is still a clue. An empty cell sitting on the wall between two finished cat homes cannot be a cat. It still has to be some animal. Write down what the cell cannot be, then test what is left. People stare at that cell as a blank. It is a blank with one fewer option than the cells around it.',
        ),
        list([
          'Count the cells a home still needs.',
          'Cross out neighbors that would touch another home of that size.',
          'Cross out shapes that cannot reach the right count before they hit a wall, a closed home, or the edge.',
          'Place the number only when one option remains.',
        ]),
      ],
    },
    {
      heading: 'What to do when the grid goes quiet',
      blocks: [
        paragraph(
          'Stop adding numbers. Find the unfinished home with the fewest cells still missing. Close that one. A closed home is a wall the larger regions have to route around, and walls are what make the next cell obvious. Mouse and cat close first for this reason. A lion drawn in the center on move two blocks four directions and is the usual reason a later dog has no room.',
        ),
        paragraph(
          'If every small home is already closed, look for an empty cell touched by two homes of one size. That cell is banned for that size. The ban often forces the animal on the far side of one of those homes, because that home still needs a cell and has just lost one. Then do the sum again. Regions you have proved are separate must fit in the cells that are left. If they do not fit, two clues you kept apart are one region. That revision is usually the whole knot.',
        ),
        paragraph(
          'In Crittermino a region shakes when it is connected edge to edge and illegal. Either it is bigger than the animal allows, or it has joined another home of the same size. Undo the last cell before you place anything else. Two broken regions on one grid hide which tap caused the problem. Givens do not move. If a mouse is printed, that cell stays a mouse. The [[/blog/crittermino-tips-and-strategies|tips for the five animals]] stay with the campaign, the shake, and the hint button.',
        ),
      ],
    },
    {
      heading: 'Mistakes that reset the grid',
      blocks: [
        list([
          'Reading the number as a Sudoku digit, and scanning the row for a second copy.',
          'Treating a corner touch as a join, or as a wall that forbids the same size.',
          'Keeping two equal givens apart after they already share a side.',
          'Placing another animal after the board has shaken.',
          'Drawing the largest home through the center before the small homes are walls.',
        ]),
        paragraph(
          'Guessing fills the grid faster and then traps you. When you are unsure, go back to the last cell you could explain out loud. If you cannot say which rule forced it, erase it. One grid a day is enough practice. The [[/daily-challenge|daily puzzle]] is shared, it changes at midnight UTC, and clearing it does not skip a campaign level. The [[/|home page]] starts the campaign at a board small enough for the first mouse.',
        ),
      ],
    },
  ],
  faqs: [
    {
      question: 'How do you solve a Fillomino puzzle?',
      answer:
        'Read each given as a size. Grow that region by sides until it has that many cells, keep two regions of the same size from sharing a side, and fill every cell. Start with the smallest givens and with any equal givens that already touch. The 4×4 on this page is the same method at a size you can check.',
    },
    {
      question: 'Can two of the same number touch in Fillomino?',
      answer:
        'They can touch at a corner. They can share a side only when they are the same region. If two equal givens already share a side, they are one region, and you still have to reach the printed size.',
    },
    {
      question: 'Is Crittermino the same puzzle as Fillomino?',
      answer:
        'Yes. Mouse is 2, cat is 3, dog is 4, panda is 5, and lion is 6. Paper Fillomino also allows a 1 and sizes above 6. The [[/how-to-play|how to play page]] is the short version of this tutorial, with a board you can tap.',
    },
    {
      question: 'Does a Fillomino region need a clue?',
      answer:
        'No. A region can be made entirely of cells you fill. After the proved homes are closed, count the cells that are left. If they form one connected shape of a legal size, that shape is a region that had no given.',
    },
  ],
}
