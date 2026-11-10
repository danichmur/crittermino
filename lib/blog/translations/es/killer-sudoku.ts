import { list, paragraph, type BlogCopy } from '@/lib/blog/types'

export const killerEs: BlogCopy = {
  title: 'Reglas del sudoku killer',
  description:
    'Reglas del sudoku killer: el Sudoku de siempre, más jaulas que suman un total pequeño. Ningún dígito se repite dentro de una jaula.',
  keywords: ['sudoku killer', 'reglas del sudoku killer', 'killer sudoku', 'sudoku killer online'],
  sections: [
    {
      heading: 'Sudoku, más una jaula',
      blocks: [
        paragraph(
          'El sudoku killer es Sudoku con jaulas dibujadas encima. La cuadrícula de 9×9, las filas, las columnas y las cajas de 3×3 siguen llevando cada dígito del 1 al 9 una vez. Una jaula es un grupo de casillas en línea discontinua con una suma pequeña en la esquina. Los dígitos de esa jaula suman la cifra. Un dígito no se repite dentro de su jaula.',
        ),
        paragraph(
          'Este sitio no reparte jaulas killer. Las reglas son la respuesta a la búsqueda. Una cuadrícula killer para jugar online está en [[https://sudoku.com/killer|el killer de Sudoku.com]]. El Sudoku sin jaulas es las [[/blog/sudoku-rules|reglas del Sudoku]]. El puzzle de sumas que no es Sudoku es el [[/blog/kakuro-rules|Kakuro]].',
        ),
      ],
    },
    {
      heading: 'Qué exige una jaula',
      blocks: [
        list([
          'Cada fila, columna y caja sigue conteniendo del 1 al 9 una vez.',
          'Las casillas de una jaula suman la cifra impresa.',
          'Una jaula no repite un dígito, aunque sus casillas caigan en cajas distintas.',
          'Una jaula puede cruzar el borde de una caja. Las líneas del Sudoku siguen valiendo.',
          'Una jaula de una sola casilla es una pista: esa casilla es la suma.',
          'Las jaulas no se solapan. Cada casilla está en una.',
        ]),
      ],
    },
    {
      heading: 'Una jaula de dos que suma 4',
      blocks: [
        paragraph(
          'Dos casillas de una jaula que suman 4 pueden ser 1 y 3. No pueden ser 2 y 2, porque la jaula prohíbe el repetido y la fila o la caja también lo prohibirían si lo comparten. El orden sigue abierto hasta que una línea u otra jaula lo gasta.',
        ),
        paragraph(
          'Esa pareja es también el dato del Kakuro para una serie de 4. La diferencia es el resto de la cuadrícula. El Kakuro se queda en las series. El sudoku killer todavía tiene que colocar cada dígito una vez en la fila, la columna y la caja. Un 1 que escribes para cerrar una jaula puede ser ilegal tres líneas más allá porque esa caja ya tiene un 1.',
        ),
        paragraph(
          'Fillomino no tiene jaulas ni cajas. Un 4 ahí son cuatro casillas unidas, el perro de Crittermino. Si las sumas eran un desvío y querías formas, la página de [[/how-to-play|cómo jugar]] tiene las reglas más cortas.',
        ),
      ],
    },
    {
      heading: 'Dónde jugar',
      blocks: [
        paragraph(
          '[[https://sudoku.com/killer|Sudoku killer en Sudoku.com]] es la versión con jaulas. [[https://www.websudoku.com/|Web Sudoku]] es la versión sin ellas.',
        ),
        paragraph(
          'El diario y la campaña de Crittermino son Fillomino. Abre el [[/|tablero]] cuando quieras casas de animales en vez de una suma. La lista más amplia es [[/blog/best-free-logic-puzzles-2026|juegos de lógica online gratis]].',
        ),
      ],
    },
  ],
  faqs: [
    {
      question: '¿Cuáles son las reglas del sudoku killer?',
      answer:
        'Se resuelve como Sudoku: del 1 al 9 una vez en cada fila, columna y caja de 3×3. Además, los dígitos de cada jaula discontinua suman la cifra de esa jaula, sin repetir dentro de ella.',
    },
    {
      question: '¿Puede repetirse un dígito dentro de una jaula killer?',
      answer: 'No. Los dígitos de una jaula son todos distintos, y además obedecen las líneas del Sudoku.',
    },
    {
      question: '¿El sudoku killer es lo mismo que el Kakuro?',
      answer:
        'Los dos usan sumas. El Kakuro son series de crucigrama. El sudoku killer son jaulas sobre un Sudoku completo, así que filas, columnas y cajas siguen sin poder repetir un dígito.',
    },
  ],
}
