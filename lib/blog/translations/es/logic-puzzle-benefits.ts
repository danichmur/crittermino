import { list, paragraph, type BlogCopy } from '@/lib/blog/types'

export const benefitsEs: BlogCopy = {
  title: 'Para qué sirve un puzzle de lógica al día',
  description: 'Una cuadrícula corta te da un trozo de atención terminado. Qué sostiene esa práctica y qué no pretende curar.',
  keywords: ['beneficios de los puzzles de lógica', 'hábito de puzzle diario', 'puzzle mental'],
  sections: [
    {
      heading: 'La cuadrícula tiene meta',
      blocks: [
        paragraph(
          'Casi toda la atención que gastas en internet no termina. Un puzzle de lógica sí. El tablero está lleno, las casas son legales y paras. Ese cierre es la parte útil. Sostuviste unas pocas reglas, las comprobaste contra el tablero y recibiste un sí o un no de las reglas, no de una puntuación hecha para que sigas tocando.',
        ),
        paragraph(
          'Crittermino está hecho para una sentada. Los primeros niveles son una lección de 3×3 o 4×4. Luego vienen tableros de 5×5, 6×6 y 7×7. El [[/daily-challenge|puzzle diario]] es uno de esos tableros, compartido, y el día se acaba.',
        ),
      ],
    },
    {
      heading: 'Qué estás practicando de verdad',
      blocks: [
        paragraph(
          'Practicas un plan corto mientras el tablero cambia. Una casa de perro necesita cuatro casillas unidas. Colocas una y todavía tienes que recordar las otras tres y los animales que no pueden tocarla. Es memoria de trabajo ordinaria, puesta en una tarea con final visible.',
        ),
        paragraph(
          'También practicas deshacer un error seguro. El temblor es inmediato. La casilla está mal, la regla es la misma de hace diez minutos y el arreglo es quitar el animal. Quien juega muchos puzzles se recupera más rápido. La velocidad no es una mejora de personalidad. Es costumbre con este tipo de límite.',
        ),
        list([
          'Nombrar la regla antes de colocar una casilla.',
          'Cerrar una región pequeña para que la grande tenga un borde.',
          'Parar cuando el tablero está listo, en vez de abrir otro por reflejo.',
        ]),
      ],
    },
    {
      heading: 'Lo que un puzzle no hace',
      blocks: [
        paragraph(
          'El hábito de Fillomino no es un tratamiento. No sube un CI medido y no previene la demencia. Quien vende un juego mental con esas promesas vende por delante de la evidencia. El beneficio honesto es la sesión: un problema quieto, un final claro y una regla que puedes explicar a otra persona.',
        ),
        paragraph(
          'Si quieres esa sesión, una cuadrícula basta. Las [[/blog/crittermino-tips-and-strategies|notas de estrategia]] ayudan cuando las reglas aún son nuevas. La [[/how-to-play|página de cómo jugar]] alcanza si prefieres aprender tocando. El recorrido largo está en [[/blog/how-to-solve-fillomino-puzzles|cómo resolver Fillomino]].',
        ),
      ],
    },
    {
      heading: 'Una forma de empezar que se queda pequeña',
      blocks: [
        paragraph(
          'Juega el diario, o el nivel 1 si nunca viste a los animales. Cuando el tablero esté listo, sal del sitio. Lo que la gente nota al cabo de unas semanas es el límite, no el número de la racha. La racha del juego solo anota que volviste. Es un recordatorio, no una puntuación que debas.',
        ),
      ],
    },
  ],
}
