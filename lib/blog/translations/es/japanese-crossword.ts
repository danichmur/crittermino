import { list, paragraph, type BlogCopy } from '@/lib/blog/types'

export const crosswordEs: BlogCopy = {
  title: 'Crucigrama japonés',
  description:
    'Un crucigrama japonés es un nonograma, también llamado picross. Los números del borde son la longitud de los tramos pintados.',
  keywords: ['crucigrama japonés', 'nonograma', 'picross', 'reglas del nonograma'],
  sections: [
    {
      heading: 'Los números están en el borde',
      blocks: [
        paragraph(
          'Un crucigrama japonés es un nonograma. En inglés también se llama picross o griddlers. No es un crucigrama de palabras y no está escrito en japonés. Las pistas son tramos de casillas pintadas. Cada fila y cada columna lista esos tramos en orden. Pintas casillas y dejas otras vacías hasta que el dibujo coincide con todas las pistas.',
        ),
        paragraph(
          'Crittermino no pinta un dibujo. Si la búsqueda era ese puzzle, juega uno en [[https://webpbn.com/|Web Paint-by-Number]]. Las reglas están aquí. La cuadrícula de este sitio es Fillomino, enlazada desde [[/how-to-play|cómo jugar]].',
        ),
      ],
    },
    {
      heading: 'Tramos, en orden, con un hueco',
      blocks: [
        list([
          'Un número es la longitud de un tramo pintado.',
          'Una pista de 3 en una fila corta significa tres casillas pintadas seguidas.',
          'Una pista de 2 1 significa un tramo de dos, luego al menos una casilla vacía, luego un tramo de uno.',
          'Los tramos siguen el orden escrito, de izquierda a derecha o de arriba abajo.',
          'Puede haber casillas vacías antes del primer tramo y después del último.',
          'Las columnas obedecen la misma regla, de arriba abajo.',
          'Una casilla está pintada o vacía. No se coloca un dígito.',
        ]),
        paragraph(
          'En una fila de cinco casillas, la pista 5 pinta la fila entera. La pista 3 tiene que cubrir tres seguidas, así que la casilla del centro está pintada se deslice el tramo hacia el extremo que sea. Ese solapamiento es la primera deducción. Marcas las casillas que comparten todas las colocaciones legales y dejas los extremos hasta que una columna diga más.',
        ),
      ],
    },
    {
      heading: 'No es un crucigrama de palabras',
      blocks: [
        paragraph(
          'En la cuadrícula no hay letras. Un nonograma terminado es un dibujo: una cara, una herramienta, un animal pequeño. La lógica cuenta tramos, no vocabulario. Crucigrama japonés y nonograma son dos nombres de la misma cuadrícula.',
        ),
        paragraph(
          'Fillomino también llena casillas, y ahí acaba el parecido. El tamaño de una región de Fillomino está escrito dentro. Los números del nonograma viven fuera y describen tinta, no un poliominó. [[/blog/how-to-solve-fillomino-puzzles|Cómo resolver Fillomino]] es el otro método. [[/blog/best-free-logic-puzzles-2026|Juegos de lógica online gratis]] guarda los dos en una lista.',
        ),
      ],
    },
    {
      heading: 'Dónde jugar',
      blocks: [
        paragraph(
          '[[https://webpbn.com/|Web Paint-by-Number]] es un conjunto grande y gratis de nonogramas. [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/pattern.html|Pattern de Simon Tatham]] es el mismo género en su colección.',
        ),
        paragraph(
          'Si quieres regiones en vez de un dibujo, la [[/|página de Crittermino]] es un Fillomino: ratón 2, gato 3, perro 4, panda 5, león 6. Sin descarga y sin cuenta.',
        ),
      ],
    },
  ],
  faqs: [
    {
      question: '¿Qué es un crucigrama japonés?',
      answer:
        'Un puzzle de dibujo, también llamado nonograma o picross. Los números del borde dicen cuánto mide cada tramo pintado y en qué orden. Pintas las casillas que las pistas ya obligan.',
    },
    {
      question: '¿Qué significa una pista de nonograma 2 1?',
      answer: 'Un tramo pintado de dos casillas, luego al menos una vacía, luego un tramo pintado de una casilla, en ese orden.',
    },
    {
      question: '¿Un crucigrama japonés es lo mismo que Fillomino?',
      answer: 'No. Un nonograma arma un dibujo a partir de cuentas en el borde. Fillomino divide la cuadrícula en regiones cuyo tamaño está escrito en las casillas.',
    },
  ],
}
