import { list, paragraph, type BlogCopy } from '@/lib/blog/types'

export const kenkenEs: BlogCopy = {
  title: 'Reglas del KenKen',
  description:
    'Reglas del KenKen: del 1 al n una vez en cada fila y columna, y cada jaula da en el blanco con +, −, × o ÷.',
  keywords: ['reglas del kenken', 'cómo jugar kenken', 'kenken puzzle', 'kenken online'],
  sections: [
    {
      heading: 'Filas, columnas y una jaula',
      blocks: [
        paragraph(
          'El KenKen es una cuadrícula de n×n. Un 4×4 usa los dígitos 1, 2, 3 y 4. Un 6×6 usa del 1 al 6. Cada dígito aparece una vez en cada fila y una vez en cada columna. No hay cajas de 3×3. Las líneas gruesas marcan jaulas. Cada jaula muestra un blanco y una operación: sumar, restar, multiplicar o dividir. Los dígitos de la jaula, en algún orden, producen ese blanco.',
        ),
        paragraph(
          'Crittermino no es KenKen. Estos animales no tienen aritmética. Los puzzles oficiales están en [[https://www.kenkenpuzzle.com/|KenKen Puzzle]]. Esta página es el reglamento, y el tablero de este sitio es Fillomino.',
        ),
      ],
    },
    {
      heading: 'Cómo se lee una jaula',
      blocks: [
        list([
          'Una jaula marcada 3+ en dos casillas son dos dígitos que suman 3.',
          'En un 4×4 esos dígitos son 1 y 2. Ninguna otra pareja de 1–4 suma 3 sin repetir, y una fila tampoco puede repetir.',
          'Una jaula 7+ en tres casillas necesita tres dígitos distintos del conjunto de la cuadrícula que sumen 7.',
          'Una jaula de una casilla no tiene operación. El número de la esquina es el dígito.',
          'Restar y dividir no miran el orden. Puedes ordenar los dígitos para que salga el resultado.',
          'Una jaula 2÷ es una pareja en la que el mayor dividido entre el menor da 2. En un 4×4 es 2 y 1, o 4 y 2.',
          'Una jaula 1− es una pareja con una diferencia de 1.',
        ]),
      ],
    },
    {
      heading: 'Dónde miente el hábito del Sudoku',
      blocks: [
        paragraph(
          'La caja del Sudoku no está aquí. Un dígito puede sentarse cerca de sí mismo en una esquina mientras no comparta fila ni columna. La jaula es el límite extra, y la jaula es aritmética, no un tamaño de región. Las [[/blog/sudoku-rules|reglas del Sudoku]] y las [[/blog/killer-sudoku|reglas del sudoku killer]] conservan las cajas de 9×9. El KenKen quita las cajas y nombra la operación.',
        ),
        paragraph(
          'Las jaulas del sudoku killer son solo sumas, siempre del 1 al 9, y las cajas del Sudoku siguen. Una jaula de KenKen puede ser un producto o un cociente, y el conjunto de dígitos es el tamaño de la cuadrícula. El Kakuro también son sumas, pero en series de crucigrama, no en un cuadrado latino. Las [[/blog/kakuro-rules|reglas del Kakuro]] son esa otra suma.',
        ),
      ],
    },
    {
      heading: 'Dónde jugar KenKen',
      blocks: [
        paragraph('[[https://www.kenkenpuzzle.com/|KenKen Puzzle]] es el sitio oficial. Empieza en un 4×4 o un 6×6 si las jaulas son nuevas.'),
        paragraph(
          'Si querías una cuadrícula sin aritmética, Crittermino es Fillomino: cada casa de animal es un número fijo de casillas, unidas por el lado, y dos casas del mismo tamaño no comparten pared. Las [[/how-to-play|reglas]] y el [[/|juego]] están en este sitio. Sin descarga y sin cuenta.',
        ),
      ],
    },
  ],
  faqs: [
    {
      question: '¿Cuáles son las reglas del KenKen?',
      answer:
        'En una cuadrícula de n×n, coloca del 1 al n una vez en cada fila y cada columna. Los dígitos de cada jaula tienen que combinarse con la operación impresa para dar el blanco impreso. Una jaula de una casilla es ese dígito.',
    },
    {
      question: '¿Importa el orden en una jaula de KenKen?',
      answer:
        'En la resta y la división, no. Vale cualquier orden que produzca el blanco. Usas el dígito mayor menos, o dividido entre, el menor.',
    },
    {
      question: '¿El KenKen es un tipo de Sudoku?',
      answer:
        'Es un cuadrado latino, así que filas y columnas no repiten un dígito. No tiene cajas. Las jaulas usan suma, resta, multiplicación o división. El Sudoku usa cajas y no usa aritmética.',
    },
  ],
}
