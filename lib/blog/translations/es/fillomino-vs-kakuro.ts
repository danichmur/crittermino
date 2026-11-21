import { mouse } from '@/lib/blog/cells'
import { board, list, paragraph, type BlogCopy } from '@/lib/blog/types'

export const kakuroVsEs: BlogCopy = {
  title: 'Fillomino, una alternativa al Kakuro',
  description:
    'Un puzzle como el Kakuro, sin las sumas. Fillomino conserva la cuadrícula tranquila. El número es el tamaño de una región, no un total al que tiene que llegar un tramo de dígitos.',
  keywords: ['alternativa al kakuro', 'puzzles como el kakuro', 'fillomino y kakuro'],
  sections: [
    {
      heading: 'Si te gusta el Kakuro, prueba Fillomino',
      blocks: [
        paragraph(
          'Si te gusta el Kakuro, prueba Fillomino. Sigues teniendo una cuadrícula, unas pistas impresas y una solución pensada. Sigues perdiendo cuando un dígito probable te pinta en una esquina. Lo que cambia es el trabajo del número. El Kakuro usa un número como suma. Fillomino usa un número como tamaño.',
        ),
        paragraph(
          'El Kakuro te pide llenar tramos rectos con dígitos del 1 al 9 de modo que cada tramo sume su pista, y que ningún dígito se repita dentro de ese tramo. Fillomino te pide hacer crecer regiones de modo que el número de una casilla sea el tamaño de su región, y que dos regiones del mismo tamaño no compartan un lado. Quien resuelve Kakuro ya sabe sostener dos límites sobre una casilla. Fillomino gasta esa habilidad en la forma, no en la aritmética. El [[/blog/how-to-solve-fillomino-puzzles|tutorial de Fillomino]] recorre un 4×4. Esta página es la traducción. Las [[/blog/kakuro-rules|reglas del Kakuro]] se quedan en su página si las sumas son lo que buscabas.',
        ),
      ],
    },
    {
      heading: 'Primero una suma, luego un tamaño',
      blocks: [
        paragraph(
          'En Kakuro, un 4 pequeño en una casilla negra es un total. El tramo blanco al que apunta tiene que sumar 4. Un tramo de dos casillas que suma 4 puede ser 1 y 3. No puede ser 2 y 2, porque un tramo no puede repetir un dígito. Puede que aún no sepas el orden. Sí sabes que ninguna de las dos casillas es un 2.',
        ),
        paragraph(
          'En Fillomino, un 2 es un tamaño. La casa son dos casillas, y las dos son de ese tamaño. La repetición que el Kakuro acaba de prohibir es la región entera. Crittermino imprime un animal en lugar del dígito, para que no tengas que recordar que la marca es una cuenta. Un ratón son dos casillas. La pareja de abajo es una casa de ratón terminada. El Kakuro la rechazaría a primera vista.',
        ),
        board(
          'Dos ratones que comparten un lado, una región de Fillomino de tamaño 2.',
          'Una casa de dos. En Fillomino la repetición es la región. En Kakuro un tramo no puede repetir un dígito, así que 2 y 2 nunca es una suma legal.',
          [[mouse(), mouse()]],
        ),
        paragraph(
          'Los animales de Crittermino llegan hasta el 6: ratón 2, gato 3, perro 4, panda 5, león 6. El Fillomino de papel también permite un 1 y, en una cuadrícula grande, un 7 o más. El Kakuro está fijo en los dígitos del 1 al 9, y un tramo es solo tan largo como las casillas blancas entre paredes. Un tramo largo de Kakuro sigue siendo aritmética. Una región larga de Fillomino sigue siendo una cuenta de casillas.',
        ),
      ],
    },
    {
      heading: 'Primero tramos rectos, luego formas',
      blocks: [
        paragraph(
          'El Kakuro solo lee líneas rectas. Un tramo horizontal sale a la derecha desde su pista hasta una pared. Un tramo vertical baja. Una casilla está en un tramo horizontal y en un tramo vertical, y tiene que cumplir las dos sumas. La forma de una «región» no es una pregunta. Si las casillas no comparten un lado completo en línea recta, no son un tramo.',
        ),
        paragraph(
          'A Fillomino la línea casi no le importa. Una casa es una pieza, la pieza tiene el número justo de casillas, y otra pieza de ese tamaño no comparte un lado. La pieza puede doblarse. Un cuadrado de cuatro perros es una casa de perro legal. El Kakuro no puede ver ese cuadrado como una unidad. Vería dos parejas horizontales y dos verticales, y luego exigiría un dígito distinto en cada casilla de cada pareja.',
        ),
        paragraph(
          'Las casillas de Fillomino se unen por un lado. Una esquina no las conecta, y una esquina tampoco separa dos casas iguales. Dos casas de ratón pueden tocarse por una esquina. Dos casas de ratón que comparten un lado son una casa de cuatro, o dos casas ilegales, y las dos lecturas fallan.',
        ),
      ],
    },
    {
      heading: 'Qué puedes repetir',
      blocks: [
        paragraph(
          'El Kakuro se pasa el puzzle frenando repeticiones dentro de un tramo y luego comprobando un total. El mismo dígito puede aparecer en otro tramo. No puede aparecer dos veces en el tramo que estás llenando. Un Kakuro terminado se comprueba sumando.',
        ),
        paragraph(
          'Fillomino exige la repetición dentro de la casa: un tamaño de 2 son dos del mismo animal, lado con lado, en una pieza. La repetición que prohíbe es otra. Dos casas separadas de ese tamaño no pueden compartir un lado. No hay nada que sumar. Un Fillomino terminado se comprueba contando casillas y mirando paredes.',
        ),
        list([
          'Kakuro: dígitos del 1 al 9, sin cero, sin repetición dentro de un tramo, y el tramo suma su pista.',
          'Fillomino: cada casa una vez, al tamaño escrito dentro, apartada de las otras casas de ese tamaño.',
          'Kakuro: una casilla debe dos sumas, horizontal y vertical.',
          'Fillomino: una casilla debe una casa, y la pared que comparte le dice al vecino qué animal no puede ser.',
        ]),
      ],
    },
    {
      heading: 'Qué se siente igual',
      blocks: [
        paragraph(
          'Los dos son cuadrículas de lápiz y lógica con una solución pensada cuando quien las compone es honesto. Los dos castigan una suposición que solo era probable. Los dos se aprietan cerca del final, cuando las últimas casillas quedan forzadas por tramos o casas que ya colocaste. Si te gusta el momento en que un tramo de Kakuro acepta su último dígito porque nada más suma, vas a reconocer el momento en que una casa de Fillomino se cierra y la casilla vecina pierde una opción.',
        ),
        paragraph(
          'Los dos premian la misma pausa. Nombra el límite antes de escribir. En Kakuro esa frase es «estas dos casillas suman 4, así que son 1 y 3 en algún orden». En Fillomino es «a este ratón aún le falta una casilla, y solo un vecino lo mantiene lejos del otro ratón». Las palabras cambian. El hábito de decir el límite es la parte que se transfiere.',
        ),
        list([
          'Una solución, cuando el puzzle es honesto. Los niveles publicados de Crittermino están hechos así.',
          'Pistas que no puedes cambiar.',
          'Una sesión corta en una cuadrícula pequeña, una larga en una grande.',
          'No hace falta un idioma. Los juegos de palabras son otra afición.',
        ]),
      ],
    },
    {
      heading: 'Dónde ayuda un hábito de Kakuro, y dónde se atasca',
      blocks: [
        paragraph(
          'El hábito que ayuda es la lista corta. Quien juega Kakuro ya mira un tramo y tacha cada dígito que no puede estar. Una suma de 4 en dos casillas deja 1 y 3. Fillomino pide la misma lista con otro traje: de qué tamaños puede ser aún esta casilla vacía, una vez que las paredes, el borde y las casas ya colocadas han gastado el resto. El tutorial recorre esa cuenta en un 4×4 de verdad.',
        ),
        paragraph(
          'El hábito que se atasca es la suma, y el reflejo de que un dígito repetido es un error. En un tablero de Fillomino una fila de cuatro perros puede ser una casa terminada y legal. Sumarlos es la pregunta equivocada. Separarlos porque se repiten también es la pregunta equivocada. Pregunta si son una pieza del tamaño justo, y si esa pieza comparte un lado con otra pieza del mismo tamaño.',
        ),
      ],
    },
    {
      heading: 'Qué cuadrícula abrir',
      blocks: [
        paragraph(
          'Quédate con el Kakuro cuando quieres las sumas. [[https://kakuro.com/|Kakuro.com]] reparte puzzles gratis en el navegador. Las [[/blog/kakuro-rules|reglas del Kakuro]] de este sitio son los dos límites en una página, incluido el tramo de dos que suma 4.',
        ),
        paragraph(
          'Pasa a Fillomino cuando la aritmética se siente automática y quieres que el límite sea una forma. [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/filling.html|Filling de Simon Tatham]] es Fillomino con números de lápiz, y los tamaños no se limitan a los cinco animales. Crittermino es la misma forma con animales, una campaña de 300 niveles y una [[/daily-challenge|cuadrícula diaria]] igual para todos. Gratis, en el navegador, sin cuenta. Las [[/how-to-play|reglas]] llevan menos de un minuto.',
        ),
        paragraph(
          'Ninguno sustituye al otro. Si el número que ya conoces es un dígito de Sudoku, la página pareja es [[/blog/fillomino-vs-sudoku|Fillomino y Sudoku]]. Si es un tramo de tinta en el borde de un dibujo, es [[/blog/fillomino-vs-nonogram|Fillomino y un nonograma]]. Una semana de una sola cuadrícula es como averiguas qué silencio te gusta.',
        ),
      ],
    },
  ],
  faqs: [
    {
      question: '¿Cuál es la diferencia entre Fillomino y Kakuro?',
      answer:
        'En Kakuro un número es una suma. Un tramo recto de dígitos suma esa pista, y ningún dígito se repite dentro del tramo. En Fillomino un número es un tamaño: la región tiene esas casillas, cada casilla lleva ese tamaño, y la región puede doblarse. Dos regiones del mismo tamaño no pueden compartir un lado. Fillomino no tiene sumas.',
    },
    {
      question: 'Si me gusta el Kakuro, ¿me gustará Fillomino?',
      answer:
        'A menudo, si lo que te gusta es una lista corta de jugadas legales y una cuadrícula que castiga una suposición. El Kakuro arma esa lista con sumas. Fillomino la arma contando casillas y paredes. El [[/blog/how-to-solve-fillomino-puzzles|tutorial]] es la entrada, y Crittermino es ese puzzle con animales.',
    },
    {
      question: '¿Por qué 2 y 2 es legal en un puzzle y no en el otro?',
      answer:
        'El Kakuro prohíbe un dígito repetido dentro de un tramo, así que dos casillas que suman 4 son 1 y 3, nunca 2 y 2. Fillomino exige la repetición: una casa de ratón son dos ratones que comparten un lado. El mismo par de marcas es el error en Kakuro y la región terminada en Fillomino.',
    },
    {
      question: '¿Dónde puedo jugar a cada uno gratis?',
      answer:
        'Kakuro: [[https://kakuro.com/|Kakuro.com]]. Fillomino con números: [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/filling.html|Filling de Simon Tatham]]. Fillomino con animales: la [[/|página de Crittermino]], incluida una [[/daily-challenge|cuadrícula diaria]].',
    },
  ],
}
