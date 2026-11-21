import { list, paragraph, type BlogPost } from '@/lib/blog/types'

export const dailyBrainWorkout: BlogPost = {
  slug: 'daily-brain-workout',
  title: 'Your new daily brain workout',
  description:
    'What a finished logic grid asks the brain to do, and what actually changes when you repeat that job.',
  published: '2026-11-16',
  keywords: ['daily brain workout', 'logic puzzle brain', 'does a puzzle develop the brain'],
  sections: [
    {
      heading: 'The workout is one finished board',
      blocks: [
        paragraph(
          'A brain workout here is not a score and not a streak. It is one board you close. You hold a few sizes in mind, you refuse a cell that breaks a rule, and you stop when every home is legal. The [[/daily-challenge|daily puzzle]] is that bout. Early levels are a 3×3 or 4×4. Later boards are 5×5, 6×6, and 7×7. One of them is enough for the day.',
        ),
      ],
    },
    {
      heading: 'What the brain is doing while you tap',
      blocks: [
        paragraph(
          'Three jobs run at once. Working memory holds the plan that is not on the board yet. A dog home needs four connected cells. After the first cell, the other three still have to exist in your head, along with the animals that are not allowed to share a wall with it.',
        ),
        paragraph(
          'Inhibition is the pause before a bad tap. The obvious animal is often wrong. The rule has to win against the finger. When the cell turns red, that pause failed, and the next try is the same rule again.',
        ),
        paragraph(
          'Attention keeps one constraint alive while you look somewhere else. A mouse closed in the corner is still a wall for the dog you are building on the other side. These are ordinary jobs of the systems that hold a plan and check it. The grid only makes the check visible.',
        ),
        list([
          'Hold the cells a home still owes.',
          'Stop the tap the rule does not allow.',
          'Keep a finished mouse in mind while you work the far side.',
        ]),
      ],
    },
    {
      heading: 'What changes when you repeat the job',
      blocks: [
        paragraph(
          'Getting better at a puzzle is a physical change, and it is a narrow one. Neurons that fire together on the same problem become easier to fire together the next time. That is how a skill settles: the path you use gets cheaper to run. After a run of boards you see a corner mouse before you guess, and you notice two same-size homes about to touch. That recognition is the change. It lives in this kind of grid.',
        ),
        paragraph(
          'It does not spread into a higher IQ score. It does not rewind age, and it does not protect against disease. A month of Crittermino makes you better at region puzzles with a size rule. A larger promise is past the evidence. The notes on [[/blog/logic-puzzle-benefits|what a daily logic puzzle is good for]] stay on that limit.',
        ),
        paragraph(
          'The dose matters. One finished board is a repetition the brain can keep. A long chain of extra boards is more tapping, not a deeper change. The useful update is the problem you solved and then left.',
        ),
      ],
    },
    {
      heading: 'How to take the workout',
      blocks: [
        paragraph(
          'If the animals are new, start at level 1. The three rules are on [[/how-to-play|how to play]]: a mouse is 2 cells, a cat is 3, a dog is 4, and same-size homes cannot share a wall. Say the size before you tap. When the board is done, close the tab. Come back for tomorrow’s grid, not for a second one tonight.',
        ),
      ],
    },
  ],
  faqs: [
    {
      question: 'Does a daily puzzle develop the brain?',
      answer:
        'It develops the skill you repeat. The brain changes so that skill gets cheaper to run. A logic grid does not raise a measured IQ.',
    },
    {
      question: 'How long is the workout?',
      answer:
        'One daily board. Early boards take about a minute. A 7×7 takes longer. The length is the board, not a timer you owe.',
    },
    {
      question: 'When does it start to feel easier?',
      answer:
        'After the rules stop being news. The first sign is naming the animal before the tap, and undoing a red cell without starting the board over.',
    },
  ],
}
