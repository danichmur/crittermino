import { paragraph, type BlogCopy } from '@/lib/blog/types'

export const tipsEs: BlogCopy = {
  title: 'Consejos y estrategias de Crittermino',
  description: 'Cómo se portan las cinco casas, qué significa el temblor y cómo usar una pista sin regalar el tablero.',
  keywords: ['consejos crittermino', 'estrategia fillomino', 'puzzle de animales'],
  sections: [
    {
      heading: 'Cinco tamaños, cinco personajes',
      blocks: [
        paragraph(
          'El ratón es 2, el gato 3, el perro 4, el panda 5, el león 6. Di el tamaño cuando coloques. «A este gato le falta una casilla» es una jugada. «Esto parece un gato» es una suposición. Los animales son los números. No son pegatinas sobre una cuadrícula escondida.',
        ),
        paragraph(
          'Los niveles 1 a 5 son lecciones: una casa de ratón, luego los vecinos más grandes, luego un caso en el que dos casas del mismo tamaño comparten pared y el tablero tiembla. Juega eso antes de buscar estrategia. La [[/how-to-play|página de reglas]] tiene la misma lección en una pantalla.',
        ),
      ],
    },
    {
      heading: 'Qué te dice el temblor',
      blocks: [
        paragraph(
          'Una región tiembla cuando está unida por los lados y es ilegal. O es más grande de lo que el animal permite, o se ha juntado con otra casa del mismo tamaño. Tocarse por una esquina no tiembla. Si el tablero tiembla, quita la última casilla antes de colocar nada más. Dos regiones rotas en el mismo tablero esconden cuál fue el toque.',
        ),
        paragraph(
          'Las pistas no se mueven. Si hay un ratón impreso, esa casilla sigue siendo un ratón. El puzzle consiste en construir alrededor. Borrarlo no es una opción, por eso un toque ahí no hace nada.',
        ),
      ],
    },
    {
      heading: 'Cierra primero las casas pequeñas',
      blocks: [
        paragraph(
          'En los tableros de 5×5 la paleta es ratón, gato y perro. Cierra cada ratón que veas. Dos casillas se buscan rápido, y cada ratón terminado es una pared. Luego los gatos. El perro necesita cuatro casillas y se queda el pasillo que dejaron las casas menores.',
        ),
        paragraph(
          'El panda entra en el nivel 21. El león en el nivel 36. Un león de seis casillas en un tablero de 6×6 o 7×7 ya es media partida. Dibújalo primero junto al borde, no en el centro. Un león en el medio cierra cuatro direcciones a la vez, y por eso un perro tardío se queda sin sitio.',
        ),
      ],
    },
    {
      heading: 'La pista, el diario y la campaña',
      blocks: [
        paragraph(
          'El botón de pista señala una casilla forzada o dibuja una casa de la solución. Úsalo cuando ya puedas nombrar la casilla que no te convence. Como primer movimiento se salta la única habilidad que enseña el puzzle.',
        ),
        paragraph(
          'La campaña tiene 300 niveles, y el mismo número es el mismo puzzle para todos. El [[/daily-challenge|reto diario]] toma uno de esos tableros para el día UTC. Ganarlo no mueve tu nivel de campaña ni lo marca como hecho. Puedes encontrarlo otra vez más adelante, ya en tu camino.',
        ),
        paragraph(
          'La versión larga, con un 4×4 que puedes terminar a mano, está en [[/blog/how-to-solve-fillomino-puzzles|cómo resolver Fillomino]]. La comparación con el Sudoku está en [[/blog/fillomino-vs-sudoku|Fillomino y Sudoku]].',
        ),
      ],
    },
  ],
}
