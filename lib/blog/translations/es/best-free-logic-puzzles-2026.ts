import { list, paragraph, type BlogCopy } from '@/lib/blog/types'

export const listEs: BlogCopy = {
  title: 'Juegos de lógica online gratis',
  description:
    'Juegos de lógica online gratis, sin descarga: Fillomino, Sudoku, nonogramas, puentes, luz, galaxias y cuadrículas lógicas.',
  keywords: [
    'juegos de logica online gratis',
    'puzzles japoneses',
    'nonograma',
    'picross',
    'juegos de logica online',
  ],
  sections: [
    {
      heading: 'Qué se ganó un sitio en esta lista',
      blocks: [
        paragraph(
          'Estos son juegos de lógica gratis que puedes abrir en un navegador en 2026. Cada uno enseña una regla en cerca de un minuto y luego te pide terminar una cuadrícula en una sentada. Sin instalar nada desde una tienda. Sin cuenta para empezar. La lista no es un ranking, y nadie pagó por un puesto. Son ocho maneras de deducir, más una palabra diaria para la noche en que quieras idioma en vez de forma. Al lado de Fillomino están otros puzzles Nikoli: Bridges, Light Up y Galaxies, más nonogramas y cuadrículas lógicas. Las reglas del [[/blog/sudoku-rules|Sudoku]], el [[/blog/kakuro-rules|Kakuro]], el [[/blog/killer-sudoku|sudoku killer]], el [[/blog/kenken-rules|KenKen]] y el [[/blog/japanese-crossword|crucigrama japonés]] tienen página propia.',
        ),
        paragraph(
          'Crittermino está en la lista porque este sitio es ese juego. Las otras entradas son puzzles de otras personas. Están aquí porque se juegan bien y porque a quien le gusta una cuadrícula quieta a menudo le apetece un segundo tipo otro día. Si un enlace de abajo deja de ser gratis, deja de pertenecer aquí.',
        ),
      ],
    },
    {
      heading: 'Crittermino',
      blocks: [
        paragraph(
          'Un tablero de Fillomino jugado con casas de animales. Llenas cada casilla. El ratón son 2 casillas, el gato 3, el perro 4, el panda 5, el león 6. Una casa se une lado con lado, y dos casas del mismo tamaño no pueden compartir pared. Hay una campaña de 300 niveles. El mismo número de nivel es el mismo puzzle para todos. La [[/daily-challenge|cuadrícula diaria]] toma uno de esos tableros para el día UTC, y terminarla no salta tu nivel de campaña.',
        ),
        paragraph(
          'Es gratis, en el navegador, sin descarga y sin cuenta. Empieza en la [[/|página de inicio]]. Las reglas, con un tablero que puedes tocar, están en [[/how-to-play|cómo jugar]]. Si quieres el método escrito, [[/blog/how-to-solve-fillomino-puzzles|cómo resolver Fillomino]] recorre un 4×4 entero. Si llegas desde el Sudoku, lee primero [[/blog/fillomino-vs-sudoku|Fillomino y Sudoku]] para que el número no te mienta.',
        ),
      ],
    },
    {
      heading: 'Filling de Simon Tatham',
      blocks: [
        paragraph(
          'Filling es Fillomino con números en vez de animales. El número que escribes es el tamaño de su región, y las regiones iguales no pueden tocarse por un lado. El Fillomino de papel también permite una región de 1 y tamaños por encima de 6, y esta versión conserva esa paleta más ancha. La colección lleva años siendo gratis. La [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/filling.html|versión de navegador de Filling]] no pide instalar nada.',
        ),
        paragraph(
          'Si ya te gusta Crittermino, es el mismo deporte con un uniforme más quieto. También es la elección correcta cuando quieres practicar el paso de contar del tutorial con tamaños que los animales no incluyen. Otros puzzles de Tatham aparecen más abajo. Solo, en la misma colección, es Sudoku, si prefieres tener todas las cuadrículas en un sitio.',
        ),
      ],
    },
    {
      heading: 'Web Sudoku',
      blocks: [
        paragraph(
          '[[https://www.websudoku.com/|Web Sudoku]] es un bloc de Sudoku sencillo: dígitos del 1 al 9, filas, columnas y cajas. Es la recomendación correcta cuando quieres el límite clásico y no quieres un tablero temático. La habilidad es escanear unidades hasta que una casilla tenga un solo dígito legal. Esa habilidad se siente pariente de Fillomino y luego, en el primer tablero, no lo es. La [[/blog/fillomino-vs-sudoku|diferencia entre Fillomino y Sudoku]] es qué trabajo tiene el número.',
        ),
        paragraph(
          'Juega al Sudoku el día que quieras una regla en la que ya confías. Juega a Fillomino el día en que las filas se sientan automáticas. Los dos son juegos de lógica gratis en el sentido que importa aquí: una cuadrícula, un final, sin instalar. Una semana de solo uno de ellos te dice qué silencio te gusta mejor que cualquier lista.',
        ),
      ],
    },
    {
      heading: 'Puzzle Bridges',
      blocks: [
        paragraph(
          'Bridges te da islas en agua abierta. Cada isla tiene un número. Dibujas puentes entre islas, en horizontal o en vertical, hasta que cada isla tenga exactamente ese número de extremos de puente y todas las islas queden conectadas. Los puentes no se cruzan. Como mucho dos puentes unen la misma pareja de islas. [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/bridges.html|Bridges de Tatham]] es una versión gratis limpia.',
        ),
        paragraph(
          'La sensación se parece a la fase tardía de un Fillomino. Un número es una deuda, y la geografía limita cómo se puede pagar. Una isla en una esquina con un 4 tiene muy pocas direcciones legales, igual que un ratón en una esquina tiene muy pocas casillas legales. A quien le gustó contar los puentes del panda en el tutorial de Fillomino suele gustarle el primer puente forzado de aquí, por la misma razón.',
        ),
      ],
    },
    {
      heading: 'Puzzle Light Up',
      blocks: [
        paragraph(
          'Light Up, también llamado Akari, es una cuadrícula de casillas blancas y paredes negras. Colocas bombillas en casillas blancas. Una bombilla ilumina su fila y su columna hasta una pared. Cada casilla blanca tiene que estar iluminada. Dos bombillas no pueden verse. Algunas casillas negras llevan un número, y ese número es cuántas bombillas se sientan contra sus lados. [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/lightup.html|Light Up de Tatham]] es gratis en el navegador.',
        ),
        paragraph(
          'Cabe entre los juegos de lógica gratis porque la deducción es local y de pronto global. Una casilla negra marcada con 4 en un sitio abierto quiere cuatro bombillas. Una casilla negra marcada con 0 prohíbe a todos los vecinos. El 0 es el mismo regalo que dos pistas iguales de Fillomino que ya comparten un lado: la regla ya gastó la elección, y tu trabajo es marcar lo que sigue.',
        ),
      ],
    },
    {
      heading: 'Nonograma',
      blocks: [
        paragraph(
          'Un nonograma, también llamado picross, llena un dibujo a partir de cuentas en los bordes. Cada fila y cada columna lista las longitudes de los tramos pintados, en orden, con al menos una casilla vacía entre tramos. Deduces qué casillas son tinta y cuáles se quedan vacías. No hay un tamaño de región al estilo Fillomino. Estás leyendo tramos. [[https://webpbn.com/|Web Paint-by-Number]] es el conjunto gratis de toda la vida. [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/pattern.html|Pattern de Tatham]] es el mismo género cuando ya tienes abierta su colección.',
        ),
        paragraph(
          'Las últimas diez casillas de un nonograma y las últimas diez de un tablero de Crittermino se desploman por la misma razón. Cuando el tablero está apretado, una casilla pintada quita un tramo que ya no cabe, y el resto de la línea sigue. A quien le gusta ese clic suelen gustarle los dos. El dibujo del final es un extra. La lógica es el punto.',
        ),
      ],
    },
    {
      heading: 'Puzzle Galaxies',
      blocks: [
        paragraph(
          'Galaxies, también llamado Spiral Galaxies o Tentai Show, parte la cuadrícula en regiones con simetría rotacional. Cada galaxia tiene una marca de centro, en una casilla, un borde o una esquina, y la región se ve igual después de un medio giro alrededor de esa marca. No estás emparejando un número con un tamaño. Estás haciendo que cada casilla obedezca a un centro. [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/galaxies.html|Galaxies de Tatham]] es un buen conjunto gratis.',
        ),
        paragraph(
          'Es la pieza más lejos del Sudoku en esta lista, y por eso está aquí. Si el «el número es un tamaño» de Fillomino ya se siente familiar, la simetría es un límite nuevo que sigue usando un lápiz y una meta. Los primeros movimientos los fuerzan centros junto al borde. Los últimos son la misma estrechez que una casa de león que se cierra.',
        ),
      ],
    },
    {
      heading: 'Cuadrículas lógicas',
      blocks: [
        paragraph(
          'Una cuadrícula lógica es otro género, y aun así cabe en una lista de juegos de lógica gratis. Emparejas personas, lugares y objetos con pistas como «el panadero no está junto al violín». Llenas un cruce de sí y no hasta que cada categoría encaja. [[https://logic.puzzlebaron.com/|Puzzle Baron]] es un conjunto grande y gratis de esas cuadrículas.',
        ),
        paragraph(
          'No es Fillomino, y un juego de Fillomino no es una cuadrícula lógica. Si el estilo de pista es lo que buscabas, empieza ahí. Si querías regiones y tamaños, quédate con Filling o Crittermino. Las dos son deducción. No entrenan el mismo ojo. Las notas sobre [[/blog/logic-puzzle-benefits|para qué sirve un puzzle de lógica al día]] se quedan con el hábito de terminar, elijas la cuadrícula que elijas.',
        ),
      ],
    },
    {
      heading: 'Una palabra diaria, si querías idioma',
      blocks: [
        paragraph(
          '[[https://www.nytimes.com/games/wordle/index.html|Wordle]] es una palabra de cinco letras al día. No es un puzzle de regiones y no es Sudoku. Está en esta página porque es el hábito más limpio de «un puzzle, y ya está» en la web, y es gratis en el navegador. Juega cuando quieras idioma. Sáltatelo cuando la búsqueda que te trajo era de cuadrículas.',
        ),
        paragraph(
          'El diario de Crittermino es la versión en cuadrícula de ese hábito. Un tablero, el mismo para todos, y el día se acaba. No necesitas los dos. Tampoco necesitas una racha. La parte útil es el final.',
        ),
      ],
    },
    {
      heading: 'Cómo elegir uno para hoy',
      blocks: [
        list([
          'Quieres formas y una campaña corta: Crittermino.',
          'Quieres Fillomino con números de lápiz, incluidos tamaños fuera del 2 al 6: Filling de Simon Tatham.',
          'Quieres dígitos en filas y cajas: Web Sudoku.',
          'Quieres un número que es una deuda en un mapa: Bridges.',
          'Quieres luz, paredes y unas bombillas forzadas: Light Up.',
          'Quieres un dibujo que sale de cuentas en el borde: un nonograma.',
          'Quieres simetría en vez de tamaño: Galaxies.',
          'Quieres pistas de «quién tiene la cebra»: Puzzle Baron.',
          'Quieres una palabra compartida y luego parar: Wordle.',
        ]),
        paragraph(
          'Una cuadrícula terminada basta para un día. Si la regla aún es nueva, juega el tamaño más fácil que ofrezca el sitio y vete cuando esté listo. Los juegos de lógica gratis se convierten fácil en una pila de pestañas abiertas. La pila no es la afición. El tablero terminado sí.',
        ),
      ],
    },
  ],
  faqs: [
    {
      question: '¿Cuáles son los mejores juegos de lógica gratis en 2026?',
      answer:
        'Para una sesión en el navegador sin instalar: Crittermino y Filling de Simon Tatham para Fillomino, Web Sudoku para dígitos, Bridges, Light Up y Galaxies de Tatham, Web Paint-by-Number para nonogramas y Puzzle Baron para cuadrículas lógicas. Wordle es la palabra diaria si querías idioma.',
    },
    {
      question: '¿Crittermino es gratis?',
      answer:
        'Sí. Es un Fillomino en el navegador. No hay descarga, ni cuenta, ni anuncios. El [[/daily-challenge|puzzle diario]] es una cuadrícula para todos y cambia a medianoche UTC.',
    },
    {
      question: '¿Por dónde empiezo si ya juego al Sudoku?',
      answer:
        'Lee [[/blog/fillomino-vs-sudoku|Fillomino y Sudoku]] y luego juega un tablero pequeño. El Fillomino con números es [[https://www.chiark.greenend.org.uk/~sgtatham/puzzles/js/filling.html|Filling de Simon Tatham]]. La versión con animales es Crittermino, y el [[/blog/how-to-solve-fillomino-puzzles|tutorial]] muestra una resolución completa.',
    },
    {
      question: '¿Hace falta una cuenta?',
      answer:
        'No para los juegos de esta lista. Crittermino guarda el progreso en el dispositivo. Los otros te dejan empezar una cuadrícula sin iniciar sesión. Si un sitio pide cuenta antes del primer puzzle, elige otro.',
    },
  ],
}
