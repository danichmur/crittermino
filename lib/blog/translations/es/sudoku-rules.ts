import { list, paragraph, type BlogCopy } from '@/lib/blog/types'

export const sudokuEs: BlogCopy = {
  title: 'Reglas del Sudoku',
  description:
    'Reglas del Sudoku: cada dígito una vez en la fila, la columna y la caja. Dónde jugar Sudoku online y qué cuadrícula hay en este sitio.',
  keywords: ['reglas del sudoku', 'sudoku online', 'sudoku gratis', 'cómo jugar sudoku'],
  sections: [
    {
      heading: 'Tres sitios, un dígito',
      blocks: [
        paragraph(
          'El Sudoku es una cuadrícula de 9×9 partida en nueve cajas de 3×3. Llenas cada casilla con un dígito del 1 al 9. Cada dígito aparece una vez en su fila, una vez en su columna y una vez en su caja. Un dígito impreso es una pista. Se queda. Un Sudoku justo tiene una sola solución.',
        ),
        paragraph(
          'Este sitio no tiene un tablero de Sudoku. Las reglas están abajo para que la búsqueda tenga respuesta. Un Sudoku gratis en el navegador es [[https://www.websudoku.com/|Web Sudoku]]. La cuadrícula de Crittermino es Fillomino: el número es el tamaño de una región, no un dígito que deba ser único. La diferencia está en [[/blog/fillomino-vs-sudoku|Fillomino y Sudoku]].',
        ),
      ],
    },
    {
      heading: 'Qué se puede escribir',
      blocks: [
        list([
          'Los dígitos van del 1 al 9. No hay 0.',
          'Una fila de nueve casillas lleva cada dígito una vez.',
          'Una columna de nueve casillas lleva cada dígito una vez.',
          'Una caja de 3×3 lleva cada dígito una vez.',
          'Una pista no se cambia.',
          'Adivinar atasca la cuadrícula. Un Sudoku terminado se comprueba solo con filas, columnas y cajas.',
        ]),
        paragraph(
          'La forma del grupo no importa. Cuatro 4 seguidos son ilegales en Sudoku porque la fila ya gastó el dígito. En Fillomino esa misma línea puede ser una región terminada. Si buscabas esa traducción, está en la página de la comparación.',
        ),
      ],
    },
    {
      heading: 'La jugada que no adivina',
      blocks: [
        paragraph(
          'Busca una casilla cuya fila, columna y caja ya hayan usado ocho dígitos entre las tres. El que falta es el único que esa casilla puede llevar. Es un candidato único. No probaste un número. Los otros ocho ya estaban gastados.',
        ),
        paragraph(
          'La misma prueba al revés. Si a una fila le falta un dígito y ocho casillas de esa fila se lo niegan por su columna o su caja, la novena lo toma. Empieza por las filas casi llenas. Una fila vacía todavía no dice nada.',
        ),
      ],
    },
    {
      heading: 'Sudoku online',
      blocks: [
        paragraph(
          '[[https://www.websudoku.com/|Web Sudoku]] es un tablero simple: de fácil a difícil, dígitos del 1 al 9, sin cuenta para empezar. Juega ahí cuando la búsqueda era el Sudoku.',
        ),
        paragraph(
          'Crittermino es el otro trabajo del número. El ratón son 2 casillas, el gato 3, el perro 4, el panda 5 y el león 6. Las casas se unen por el lado, y dos casas del mismo tamaño no comparten pared. Las [[/how-to-play|reglas]] caben en una pantalla, y el [[/|tablero]] está en el navegador, sin descarga. Los vecinos de los dos juegos, Kakuro y el crucigrama japonés incluidos, están en [[/blog/best-free-logic-puzzles-2026|juegos de lógica online gratis]].',
        ),
      ],
    },
  ],
  faqs: [
    {
      question: '¿Cuáles son las reglas del Sudoku?',
      answer:
        'Llena una cuadrícula de 9×9 para que cada dígito del 1 al 9 aparezca una vez en cada fila, cada columna y cada caja de 3×3. Los dígitos impresos se quedan.',
    },
    {
      question: '¿Dónde juego Sudoku online gratis?',
      answer: 'Web Sudoku es un Sudoku gratis en el navegador. Crittermino es otro puzzle, Fillomino, en este sitio.',
    },
    {
      question: '¿Fillomino es lo mismo que el Sudoku?',
      answer:
        'No. El Sudoku mantiene cada dígito único en una línea y una caja. Fillomino usa el número como el tamaño de una región unida. La comparación está en Fillomino y Sudoku.',
    },
  ],
}
