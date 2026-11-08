import { dog } from '@/lib/blog/cells'
import { board, list, paragraph, type BlogCopy } from '@/lib/blog/types'

export const vsEs: BlogCopy = {
  title: 'Fillomino y Sudoku',
  description:
    'La diferencia entre Fillomino y Sudoku, en reglas claras. Si te gusta el Sudoku, prueba Fillomino: la cuadrícula sigue quieta y el número cambia de trabajo.',
  keywords: ['diferencia entre fillomino y sudoku', 'fillomino vs sudoku', 'puzzle alternativo al sudoku'],
  sections: [
    {
      heading: 'Si te gusta el Sudoku, prueba Fillomino',
      blocks: [
        paragraph(
          'Si te gusta el Sudoku, prueba Fillomino. Sigues teniendo una cuadrícula, unas pistas impresas y una solución pensada. Sigues perdiendo cuando una jugada «probable» te pinta en un rincón. Lo que cambia es el trabajo del número. Ese trabajo es la diferencia entre Fillomino y Sudoku, y es la razón de que un hábito fuerte de Sudoku se sienta perdido los primeros diez minutos.',
        ),
        paragraph(
          'El Sudoku te pide colocar dígitos para que cada fila, columna y caja contenga cada dígito una vez. Fillomino te pide hacer crecer regiones para que el número de una casilla sea el tamaño de su región. Quien lleva años con el Sudoku ya sabe sostener tres límites a la vez. Fillomino gasta esa habilidad en la forma, no en las líneas. El [[/blog/how-to-solve-fillomino-puzzles|tutorial de Fillomino]] es el método, con un 4×4 que puedes terminar a mano. Esta página es la traducción.',
        ),
      ],
    },
    {
      heading: 'El número significa otra cosa',
      blocks: [
        paragraph(
          'En Sudoku, un 4 es el valor cuatro. Aparece una vez en la fila, una vez en la columna y una vez en la caja. Ver un segundo 4 en esa fila significa que la línea está mal. En Fillomino, un 4 es un tamaño. Cada casilla de esa región es un 4, y la región tiene cuatro casillas. Una hilera recta de cuatro 4 es una región terminada y legal. Es la forma ordinaria de una casa de tamaño 4 cuando tiene sitio.',
        ),
        paragraph(
          'Crittermino convierte el tamaño en un animal para que no tengas que recordar que el dígito es una cuenta. Un perro son cuatro casillas. Dos casas de perro siguen sin poder compartir pared. Esa pared es la versión Fillomino de «este dígito ya está usado». El dibujo de abajo es una casa de perro. En Sudoku la misma hilera de cuatros sería el error que las reglas existen para impedir.',
        ),
        board(
          'Cuatro perros en fila, una región Fillomino de tamaño 4.',
          'Una casa de cuatro. En Fillomino está terminada y es legal. En Sudoku, cuatro 4 en una fila rompen la línea.',
          [[dog(), dog(), dog(), dog()]],
        ),
        paragraph(
          'Los animales de Crittermino llegan hasta 6: ratón 2, gato 3, perro 4, panda 5, león 6. El Fillomino de papel también permite un 1 y, en un tablero grande, un 7 o más. El Sudoku está fijo en 1 a 9, normalmente en nueve filas y nueve cajas. Las cuadrículas de Fillomino vienen en muchos tamaños. Un 4×4 es un puzzle de verdad. Un 10×10 es más largo. La regla no gana piezas nuevas cuando crece el tablero. Las regiones solo tienen más sitio para doblarse.',
        ),
      ],
    },
    {
      heading: 'Primero líneas, luego formas',
      blocks: [
        paragraph(
          'El Sudoku prohíbe repeticiones dentro de una línea y de una caja. La forma de una región apenas importa, siempre que el dígito esté en una casilla legal. Puedes resolver mucho Sudoku escaneando: qué dígitos faltan en esta fila y cuáles de ellos puede aceptar todavía la caja. Las marcas de lápiz viven en las casillas, y el límite vive en las líneas.',
        ),
        paragraph(
          'Fillomino apenas mira las filas. Le importa que una región sea una pieza, que la pieza tenga el número justo de casillas y que otra pieza de ese tamaño no comparta un lado. Las casillas se unen por un borde. Una esquina no las conecta, y una esquina tampoco separa dos regiones iguales. Dos casas de tamaño 4 pueden tocarse por una esquina y las dos ser legales. Esas mismas dos casas compartiendo un lado son una casa de ocho, o dos casas ilegales, y las dos lecturas fallan.',
        ),
        paragraph(
          'Por eso la primera sesión se siente lenta. Buscar en una fila el dígito que falta no hace nada, porque una fila puede estar llena del mismo número cuando esas casillas son una región, y también puede tener varios números sin un conjunto que completar. Miras hacia fuera desde una pista y preguntas cómo puede crecer la casa. «Qué casillas pueden seguir perteneciendo a este 3» sustituye a «qué dígitos faltan en esta fila».',
        ),
      ],
    },
    {
      heading: 'Qué se puede repetir',
      blocks: [
        paragraph(
          'El Sudoku se pasa el puzzle entero frenando repeticiones. Fillomino exige repeticiones dentro de una región: un tamaño 5 son cinco 5, lado con lado, en una pieza. La repetición que Fillomino prohíbe es otra. Dos regiones separadas de tamaño 5 no pueden compartir un lado. Por eso dos pistas iguales que ya comparten un lado son la misma región. No hay elección. Márcalas unidas y busca las casillas que todavía les faltan.',
        ),
        paragraph(
          'Las pistas del Sudoku son valores que no puedes cambiar, y también te dicen dónde se gastó ese valor. Las pistas de Fillomino son tamaños que no puedes cambiar, y te dicen cuánto tiene que crecer un vecindario. Una pista no dice que la región esté terminada. Un solo 5 impreso todavía necesita cuatro casillas. Un 5 impreso junto a otro 5 impreso necesita tres, porque esas dos ya cuentan.',
        ),
        list([
          'Sudoku: cada dígito una vez por fila, columna y caja.',
          'Fillomino: cada región una vez, del tamaño escrito dentro, apartada de otras regiones de ese tamaño.',
          'Sudoku: la última casilla vacía de una unidad suele estar forzada por los dígitos que ya están.',
          'Fillomino: la última casilla de una casa suele estar forzada por el tamaño que todavía debe y por la pared que no debe tocar.',
        ]),
      ],
    },
    {
      heading: 'Lo que se siente igual',
      blocks: [
        paragraph(
          'Los dos puzzles son cuadrículas de boli y lógica con una solución pensada cuando quien las compone es honesto. Los dos castigan una suposición que solo era probable. Los dos se aprietan cerca del final, cuando las últimas casillas las fuerzan dígitos o casas que ya colocaste. Si te gusta el momento en que una caja de Sudoku acepta su último dígito, vas a reconocer el momento en que una casa de Fillomino se cierra y la casilla vecina pierde una opción.',
        ),
        paragraph(
          'Los dos premian la misma pausa. Nombra el límite antes de escribir. En Sudoku la frase es «a esta caja le falta un 7, y solo una casilla puede tenerlo». En Fillomino es «a este gato le falta una casilla, y solo un vecino lo mantiene lejos del otro gato». Cambian las palabras. El hábito de decir el límite es la parte que se transfiere. Quien escribe marcas en Sudoku puede escribir la misma nota en Fillomino: los tamaños que una casilla no puede ser.',
        ),
        list([
          'Una solución, cuando el puzzle es honesto. Los niveles publicados de Crittermino están hechos así.',
          'Pistas que no puedes cambiar.',
          'Una sesión corta en una cuadrícula pequeña, una larga en una grande.',
          'No hace falta idioma. Los juegos de palabras son otra afición.',
        ]),
      ],
    },
    {
      heading: 'Dónde ayuda el hábito de Sudoku, y dónde se atasca',
      blocks: [
        paragraph(
          'El hábito que ayuda es negarse a adivinar, más la calma ante una cuadrícula que parece incompleta. El Sudoku temprano enseña que una casilla de aspecto vacío suele estar forzada por casas que no estás mirando. Fillomino es la misma lección con las casas sustituidas por formas que crecen. La cuenta de casillas es la casa nueva. Si tres regiones separadas de tamaño 5 necesitaran más casillas de las que tiene el tablero, esas pistas son menos regiones de las que pensabas. El tutorial recorre esa cuenta en un 4×4 de verdad.',
        ),
        paragraph(
          'El hábito que se atasca es el escaneo de la fila. Va a seguir tirando del ojo, porque lleva años teniendo razón. Cuando una fila de Fillomino parece «llena de 4», pregunta si esos 4 son una región del tamaño justo o dos regiones que comparten pared. La fila en sí no es la pregunta. El otro atasco es tratar la caja de 3×3 como algo especial. Fillomino no tiene cajas. Un bloque de 2×2 del mismo número son simplemente cuatro casillas que hay que leer como forma: una región, o varias, y solo algunas de esas lecturas tienen un tamaño legal.',
        ),
      ],
    },
    {
      heading: 'Qué cuadrícula abrir',
      blocks: [
        paragraph(
          'Quédate con el Sudoku cuando quieras la comodidad de una regla con la que ya sueñas. [[https://www.websudoku.com/|Web Sudoku]] es un bloc sencillo: dígitos del 1 al 9, filas, columnas y cajas. [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/solo.html|Solo de Simon Tatham]] es el mismo juego dentro de una colección gratis que también incluye Fillomino.',
        ),
        paragraph(
          'Pasa a Fillomino cuando las filas se sientan automáticas y quieras que el límite sea una forma. [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/filling.html|Filling de Simon Tatham]] es Fillomino con números de lápiz, y los tamaños no se limitan a los cinco animales. Crittermino es la misma forma con animales, una campaña de 300 niveles y una [[/daily-challenge|cuadrícula diaria]] igual para todos. Gratis, en el navegador, sin cuenta. Las [[/how-to-play|reglas]] llevan menos de un minuto si Fillomino es el que no has probado.',
        ),
        paragraph(
          'Ninguno sustituye al otro. Una semana de solo uno de ellos es como averiguas qué silencio te gusta. Si después de esa semana quieres un estante más ancho, la [[/blog/best-free-logic-puzzles-2026|lista de 2026]] guarda Fillomino, Sudoku y unos puzzles que no usan ni filas ni regiones.',
        ),
      ],
    },
  ],
  faqs: [
    {
      question: '¿Cuál es la diferencia entre Fillomino y Sudoku?',
      answer:
        'En Sudoku un 4 es un valor que aparece una vez en la fila, la columna y la caja. En Fillomino un 4 es un tamaño: la región tiene cuatro casillas, y cada casilla es un 4. Dos regiones del mismo tamaño no pueden compartir un lado. Fillomino no tiene regla de fila, columna ni caja.',
    },
    {
      question: '¿Si me gusta el Sudoku, me va a gustar Fillomino?',
      answer:
        'A menudo, sí. Los dos son cuadrículas quietas con una solución y pistas que no puedes cambiar. Fillomino te pide hacer crecer formas en vez de escanear líneas. El [[/blog/how-to-solve-fillomino-puzzles|tutorial]] es la entrada, y Crittermino es ese puzzle con animales.',
    },
    {
      question: '¿Fillomino es más difícil que el Sudoku?',
      answer:
        'Un Fillomino pequeño es más fácil que un Sudoku duro, y un Fillomino grande es una sesión larga. La dificultad es el tablero que tienes delante, no el nombre del puzzle. La habilidad que se transfiere es nombrar un límite antes de escribir. La que no se transfiere es buscar en una fila el dígito que falta.',
    },
    {
      question: '¿Dónde puedo jugar a cada uno gratis?',
      answer:
        'Sudoku: [[https://www.websudoku.com/|Web Sudoku]]. Fillomino con números: [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/filling.html|Filling de Simon Tatham]]. Fillomino con animales: la [[/|página de Crittermino]], con un [[/daily-challenge|puzzle diario]].',
    },
  ],
}
