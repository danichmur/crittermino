import { list, paragraph, type BlogCopy } from '@/lib/blog/types'

export const kakuroEs: BlogCopy = {
  title: 'Reglas del Kakuro',
  description:
    'Reglas del Kakuro: una serie de dígitos suma la pista y ningún dígito se repite dentro de esa serie. Cómo un 4 deja una sola pareja.',
  keywords: ['reglas del kakuro', 'cómo jugar kakuro', 'kakuro online', 'kakuro puzzle'],
  sections: [
    {
      heading: 'Un crucigrama de sumas',
      blocks: [
        paragraph(
          'El Kakuro parece un crucigrama hecho de dígitos. Las casillas blancas forman series, en horizontal y en vertical. Una casilla negra lleva una suma pequeña, y esa suma es el total de la serie a la que apunta. La pista horizontal va abajo en la casilla negra y señala a la derecha. La pista vertical va arriba y señala hacia abajo. Escribes dígitos del 1 al 9. Una serie suma su pista. Ningún dígito se repite dentro de una serie.',
        ),
        paragraph(
          'Crittermino no es Kakuro. En este tablero no hay sumas. Si quieres el Kakuro, [[https://kakuro.com/|Kakuro.com]] reparte puzzles gratis en el navegador. Esta página son las reglas, y luego la bifurcación: quedarte con las sumas o jugar el puzzle de regiones de [[/|este sitio]].',
        ),
      ],
    },
    {
      heading: 'Las dos reglas',
      blocks: [
        list([
          'Una serie es una línea horizontal o vertical de casillas blancas entre muros.',
          'Los dígitos de una serie suman la pista de esa serie.',
          'Los dígitos van del 1 al 9. El cero no se usa.',
          'Un dígito no se repite dentro de su serie.',
          'El mismo dígito puede aparecer en otra serie, incluida la que cruza esta casilla en la otra dirección.',
          'Una casilla pertenece a una serie horizontal y a una vertical. Tiene que cumplir las dos sumas.',
        ]),
      ],
    },
    {
      heading: 'Una serie de dos que suma 4',
      blocks: [
        paragraph(
          'Dos casillas que deben sumar 4 pueden ser 1 y 3. No pueden ser 2 y 2, porque una serie no repite un dígito. El orden todavía no se sabe. Ya se sabe que ninguna de las dos es 2, 4, 5, 6, 7, 8 ni 9.',
        ),
        paragraph(
          'La serie que cruza gasta lo que queda. Si la serie vertical de la primera casilla no acepta un 1, la primera es 3 y la segunda es 1. El Kakuro es esa conversación, suma contra suma, hasta que el orden queda forzado. Una serie de dos que suma 3 es la misma lección con una sola pareja: 1 y 2.',
        ),
        paragraph(
          'El Sudoku nunca pide sumar. Las [[/blog/sudoku-rules|reglas del Sudoku]] miran qué dígito ya está en la línea y la caja. El Kakuro mira qué pareja puede hacer la pista. Fillomino mira cuántas casillas comparten un lado. Tres juegos, tres trabajos para un número.',
        ),
      ],
    },
    {
      heading: 'Dónde jugar Kakuro',
      blocks: [
        paragraph('[[https://kakuro.com/|Kakuro.com]] es un Kakuro gratis. Empieza ahí si la búsqueda era Kakuro.'),
        paragraph(
          'El puzzle de Crittermino es Fillomino con casas de animales. Un perro son cuatro casillas unidas, no una suma de cuatro. La página de [[/how-to-play|cómo jugar]] tiene las tres reglas y un tablero que puedes tocar. El sudoku killer también usa sumas, pero es una jaula encima del Sudoku: [[/blog/killer-sudoku|reglas del sudoku killer]].',
        ),
      ],
    },
  ],
  faqs: [
    {
      question: '¿Cuáles son las reglas del Kakuro?',
      answer:
        'Llena cada serie blanca con dígitos del 1 al 9 que sumen la pista. Ningún dígito se repite dentro de la serie. El cero no se usa. Una casilla tiene que cumplir su suma horizontal y su suma vertical.',
    },
    {
      question: '¿Puede repetirse un dígito en un Kakuro?',
      answer: 'Sí, en series distintas. No puede repetirse dentro de una misma serie.',
    },
    {
      question: '¿El Kakuro es lo mismo que el Sudoku?',
      answer:
        'No. El Sudoku coloca cada dígito una vez por fila, columna y caja. El Kakuro hace que las series sumen una pista, sin repetir dentro de la serie.',
    },
  ],
}
