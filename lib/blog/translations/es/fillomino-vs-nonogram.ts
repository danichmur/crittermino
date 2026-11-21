import { dog } from '@/lib/blog/cells'
import { board, list, paragraph, type BlogCopy } from '@/lib/blog/types'

export const nonogramEs: BlogCopy = {
  title: 'Fillomino, una alternativa al nonograma',
  description:
    'Un puzzle como un nonograma, sin el dibujo. Fillomino también llena una cuadrícula por lógica. El número es el tamaño de una región dentro de la casilla, no la longitud de un tramo en el borde.',
  keywords: ['alternativa al nonograma', 'puzzles como el picross', 'fillomino y nonograma'],
  sections: [
    {
      heading: 'Si te gustan los nonogramas, prueba Fillomino',
      blocks: [
        paragraph(
          'Si te gustan los nonogramas, prueba Fillomino. Sigues teniendo una cuadrícula, unos números y una solución pensada. Sigues perdiendo cuando una marca probable pinta una casilla que el resto del tablero no puede aceptar. Lo que cambia es dónde se sienta el número y qué cuenta. Un número de nonograma vive en el borde y mide un tramo de tinta. Un número de Fillomino vive en la casilla y mide el tamaño de su casa.',
        ),
        paragraph(
          'Un nonograma, también llamado picross o crucigrama japonés, te pide pintar unas casillas y dejar otras vacías hasta que un dibujo coincida con cada pista del borde. Fillomino te pide llenar cada casilla, de modo que cada grupo conectado sea exactamente tan grande como el número de dentro, y dos grupos del mismo tamaño no compartan un lado. Quien termina nonogramas ya sabe sostener una fila y una columna a la vez. Fillomino gasta esa habilidad en una forma que puede doblarse. El [[/blog/how-to-solve-fillomino-puzzles|tutorial de Fillomino]] recorre un 4×4. Esta página es la traducción. Las [[/blog/japanese-crossword|reglas del nonograma]] se quedan en su página si el dibujo es lo que buscabas.',
        ),
      ],
    },
    {
      heading: 'El número se sienta en otro sitio',
      blocks: [
        paragraph(
          'En un nonograma, un 4 junto a una fila significa cuatro casillas pintadas seguidas, en algún punto de esa línea. Esas cuatro casillas son tinta. No contienen el dígito 4. El dígito ya hizo su trabajo al sentarse en el borde. Puede haber casillas vacías antes del tramo, después, y, cuando la pista tiene más de un número, entre tramos.',
        ),
        paragraph(
          'En Fillomino, un 4 está escrito en las propias casillas. Esas cuatro casillas son la región. Dentro de esa casa no queda nada en blanco, y la casa no tiene que ser una línea recta. Crittermino imprime un animal en lugar del dígito, para que la cuenta se vea sin una segunda leyenda. Un perro son cuatro casillas. La fila de abajo es una casa de perro terminada. Un nonograma puede usar una pista de 4 para un tramo parecido y dejar vacío el resto de una línea más larga. Fillomino no tiene resto de línea que dejar vacío. Cada casilla del tablero entra en alguna casa.',
        ),
        board(
          'Cuatro perros en fila, una región de Fillomino de tamaño 4.',
          'Una casa de cuatro. En Fillomino la fila está terminada y llena. En un nonograma un 4 es tinta contada desde el borde de una línea que aún puede tener casillas vacías.',
          [[dog(), dog(), dog(), dog()]],
        ),
      ],
    },
    {
      heading: 'Primero un dibujo, luego una casa',
      blocks: [
        paragraph(
          'El premio al final de un nonograma es un dibujo. Seguiste porque las pistas estaban apretadas, y el dibujo es cómo ves que las pistas coincidieron. Fillomino te paga con casas cerradas. Una región se vuelve un animal del tamaño justo, y la casilla vecina pierde una opción. No hay un gato escondido que revelar. El gato es la región de tres.',
        ),
        paragraph(
          'Por eso un hábito de nonograma se atasca en el primer tablero de Fillomino. El ojo busca una línea que sombrear y un hueco que guardar. Fillomino no sombrea, y no guarda huecos dentro de una casa. Las casillas de una casa se tocan por un lado completo. Una esquina no las conecta, y una esquina tampoco separa dos casas del mismo tamaño. Dos casas de perro pueden tocarse por una esquina. Dos casas de perro que comparten un lado son una casa de ocho, o dos casas ilegales.',
        ),
        paragraph(
          'Los animales de Crittermino llegan hasta el 6: ratón 2, gato 3, perro 4, panda 5, león 6. El Fillomino de papel también permite un 1 y, en una cuadrícula grande, un 7 o más. Una pista de nonograma puede ser cualquier tramo que quepa en la línea, incluido un 1 y un tramo tan largo como la fila entera. Los géneros comparten una cuenta. No comparten el sitio donde se escribe.',
        ),
      ],
    },
    {
      heading: 'Qué puedes dejar vacío',
      blocks: [
        paragraph(
          'Un nonograma termina con casillas vacías todavía en el tablero. Esos vacíos son parte de la respuesta. Una pista de 2 1 necesita un hueco de al menos una casilla vacía entre los tramos, y el hueco está tan forzado como la tinta. Marcar una casilla vacía es una jugada.',
        ),
        paragraph(
          'Fillomino termina solo cuando no queda ninguna casilla vacía. Una casilla en blanco es una casa sin terminar, no un hueco que estés protegiendo. La separación que le importa a Fillomino es una pared entre dos casas del mismo tamaño. Tamaños distintos pueden compartir esa pared. Una casa de perro puede sentarse contra una casa de gato a lo largo de todo un lado.',
        ),
        list([
          'Nonograma: algunas casillas se quedan vacías, y esas casillas vacías son el fondo del dibujo.',
          'Fillomino: cada casilla pertenece a una casa. Vacío significa que no has terminado.',
          'Nonograma: un número en el borde es la longitud de un tramo de tinta, en orden.',
          'Fillomino: un número en la casilla es el tamaño de toda la casa, y la casa puede doblarse.',
        ]),
      ],
    },
    {
      heading: 'Qué se siente igual',
      blocks: [
        paragraph(
          'Los dos puzzles castigan una marca que solo era probable. Los dos se aprietan cerca del final, cuando una casilla decidida quita una posibilidad y las vecinas siguen. Si te gusta el momento en que una línea de nonograma se desploma porque un tramo ya no cabe, vas a reconocer el momento en que una casa de Fillomino se cierra y la casilla de al lado no puede ser ese animal.',
        ),
        paragraph(
          'Los dos premian la misma pausa. Nombra el límite antes de escribir. En un nonograma esa frase es «esta fila es un 4 en una línea de seis, así que las dos casillas del medio son tinta se deslice el tramo donde se deslice». En Fillomino es «a este perro aún le falta una casilla, y solo un vecino lo mantiene lejos del otro perro». Las palabras cambian. El hábito de decir el límite es la parte que se transfiere.',
        ),
        list([
          'Una solución, cuando el puzzle es honesto. Los niveles publicados de Crittermino están hechos así.',
          'No hace falta un idioma. Los juegos de palabras son otra afición.',
          'Una sesión corta en una cuadrícula pequeña, una larga en una grande.',
          'Una suposición mala es como el tablero se atasca. El arreglo es deshacer, y luego un límite que puedas decir en voz alta.',
        ]),
      ],
    },
    {
      heading: 'Dónde ayuda un hábito de nonograma, y dónde se atasca',
      blocks: [
        paragraph(
          'El hábito que ayuda es el solape. Quien juega nonogramas ya desliza un tramo a lo largo de una línea y marca las casillas que siguen pintadas en cada posición legal. Fillomino hace una pregunta parecida sobre una casa que aún debe casillas: qué vecinos están forzados, porque cualquier otra dirección es una pared, el borde o una casa del mismo tamaño. La cuenta hace el trabajo que antes hacía la pista del borde.',
        ),
        paragraph(
          'El hábito que se atasca es el borde. No hay una columna de pistas que leer, así que mirar el marco no encuentra nada. El otro atasco es dejar un hueco porque a un dibujo suele hacerle falta. Un hueco dentro de lo que esperabas que fuera una casa la parte en dos casas, y entonces cada pieza tiene que ser de su propio tamaño legal. Si querías un perro, las casillas tienen que tocarse por los lados en todo el camino.',
        ),
      ],
    },
    {
      heading: 'Qué cuadrícula abrir',
      blocks: [
        paragraph(
          'Quédate con el dibujo cuando el dibujo es la razón por la que te sentaste. [[https://webpbn.com/|Web Paint-by-Number]] es el conjunto gratis de toda la vida. [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/pattern.html|Pattern de Simon Tatham]] es el mismo género dentro de una colección que también incluye Fillomino. Las [[/blog/japanese-crossword|reglas del crucigrama japonés]] son las pistas del borde en una página.',
        ),
        paragraph(
          'Pasa a Fillomino cuando quieres la misma deducción y no necesitas un dibujo al final. [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/filling.html|Filling de Simon Tatham]] es Fillomino con números de lápiz. Crittermino es la misma forma con animales, una campaña de 300 niveles y una [[/daily-challenge|cuadrícula diaria]] igual para todos. Gratis, en el navegador, sin cuenta. Las [[/how-to-play|reglas]] llevan menos de un minuto.',
        ),
        paragraph(
          'Ninguno sustituye al otro. Si el número que ya conoces es un dígito de Sudoku, la página pareja es [[/blog/fillomino-vs-sudoku|Fillomino y Sudoku]]. Si es una suma, es [[/blog/fillomino-vs-kakuro|Fillomino y Kakuro]]. Una semana de una sola cuadrícula es como averiguas qué silencio te gusta.',
        ),
      ],
    },
  ],
  faqs: [
    {
      question: '¿Cuál es la diferencia entre Fillomino y un nonograma?',
      answer:
        'Un número de nonograma se sienta en el borde y da la longitud de un tramo de tinta. Algunas casillas se quedan vacías, y las pintadas forman un dibujo. Un número de Fillomino se sienta en la casilla y da el tamaño de su región. Cada casilla está llena, la región puede doblarse, y dos regiones del mismo tamaño no pueden compartir un lado.',
    },
    {
      question: 'Si me gusta el picross, ¿me gustará Fillomino?',
      answer:
        'A menudo, si lo que te gusta es el momento en que una línea queda forzada. El picross paga ese momento con un dibujo. Fillomino lo paga con una casa cerrada. El [[/blog/how-to-solve-fillomino-puzzles|tutorial]] es la entrada, y Crittermino es ese puzzle con animales.',
    },
    {
      question: '¿Un nonograma es lo mismo que un crucigrama japonés?',
      answer:
        'Sí. Crucigrama japonés, picross, griddlers y paint-by-number son nombres del mismo puzzle de dibujo con pistas en el borde. Fillomino no es ninguno de esos nombres. La [[/blog/japanese-crossword|página de reglas]] cubre el puzzle del dibujo. Esta página es la diferencia.',
    },
    {
      question: '¿Dónde puedo jugar a cada uno gratis?',
      answer:
        'Nonogramas: [[https://webpbn.com/|Web Paint-by-Number]]. Fillomino con números: [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/filling.html|Filling de Simon Tatham]]. Fillomino con animales: la [[/|página de Crittermino]], incluida una [[/daily-challenge|cuadrícula diaria]].',
    },
  ],
}
