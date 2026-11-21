import { list, paragraph, type BlogCopy } from '@/lib/blog/types'

export const workoutEs: BlogCopy = {
  title: 'Tu nuevo entrenamiento mental de cada día',
  description:
    'Qué le pide al cerebro una cuadrícula lógica terminada, y qué cambia de verdad cuando repites ese trabajo.',
  keywords: ['entrenamiento mental diario', 'puzzle para el cerebro', 'un puzzle desarrolla el cerebro'],
  sections: [
    {
      heading: 'El entrenamiento es un tablero cerrado',
      blocks: [
        paragraph(
          'Un entrenamiento mental aquí no es una puntuación ni una racha. Es un tablero que cierras. Sostienes unos pocos tamaños, rechazas una casilla que rompe una regla y paras cuando cada casa es legal. El [[/daily-challenge|puzzle diario]] es esa tanda. Los primeros niveles son de 3×3 o 4×4. Luego vienen tableros de 5×5, 6×6 y 7×7. Con uno al día basta.',
        ),
      ],
    },
    {
      heading: 'Qué hace el cerebro mientras tocas',
      blocks: [
        paragraph(
          'Tres trabajos van a la vez. La memoria de trabajo sostiene el plan que aún no está en el tablero. Una casa de perro necesita cuatro casillas unidas. Después de la primera, las otras tres siguen teniendo que existir en tu cabeza, junto con los animales que no pueden compartir pared con ella.',
        ),
        paragraph(
          'La inhibición es la pausa antes de un toque malo. El animal obvio suele estar mal. La regla tiene que ganar al dedo. Cuando la casilla se pone roja, la pausa falló, y el siguiente intento usa la misma regla.',
        ),
        paragraph(
          'La atención mantiene viva una restricción mientras miras a otro sitio. Un ratón cerrado en la esquina sigue siendo un muro para el perro que construyes al otro lado. Son trabajos normales de los sistemas que sostienen un plan y lo comprueban. La cuadrícula solo hace visible la comprobación.',
        ),
        list([
          'Sostener las casillas que a una casa aún le faltan.',
          'Parar el toque que la regla no permite.',
          'Recordar un ratón cerrado mientras trabajas el lado lejano.',
        ]),
      ],
    },
    {
      heading: 'Qué cambia cuando repites el trabajo',
      blocks: [
        paragraph(
          'Mejorar en un puzzle es un cambio físico, y es estrecho. Las neuronas que se activan juntas en el mismo problema se activan con más facilidad la vez siguiente. Así se asienta cualquier habilidad: el camino que usas sale más barato. Tras una serie de tableros ves el ratón de la esquina antes de adivinar, y notas dos casas del mismo tamaño a punto de tocarse. Ese reconocimiento es el cambio. Vive en este tipo de cuadrícula.',
        ),
        paragraph(
          'No se convierte en una puntuación de CI más alta. No rebobina la edad y no protege contra una enfermedad. Un mes de Crittermino te hace mejor en puzzles de regiones con una regla de tamaño. Una promesa más grande se pasa de la evidencia. Las notas sobre [[/blog/logic-puzzle-benefits|para qué sirve un puzzle de lógica al día]] se quedan en ese límite.',
        ),
        paragraph(
          'La dosis importa. Un tablero terminado es una repetición que el cerebro puede guardar. Una cadena larga de tableros de más es más toques, no un cambio más hondo. La actualización útil es el problema que resolviste y luego dejaste.',
        ),
      ],
    },
    {
      heading: 'Cómo hacer el entrenamiento',
      blocks: [
        paragraph(
          'Si los animales son nuevos, empieza en el nivel 1. Las tres reglas están en [[/how-to-play|cómo jugar]]: un ratón son 2 casillas, un gato son 3, un perro son 4, y las casas del mismo tamaño no comparten pared. Di el tamaño antes de tocar. Cuando el tablero esté listo, cierra la pestaña. Vuelve por la cuadrícula de mañana, no por una segunda esta noche.',
        ),
      ],
    },
  ],
  faqs: [
    {
      question: '¿Un puzzle diario desarrolla el cerebro?',
      answer:
        'Desarrolla la habilidad que repites. El cerebro cambia para que esa habilidad salga más barata de poner en marcha. Una cuadrícula lógica no sube un CI medido.',
    },
    {
      question: '¿Cuánto dura el entrenamiento?',
      answer:
        'Un tablero diario. Los primeros ocupan cerca de un minuto. Un 7×7 tarda más. La duración es el tablero, no un temporizador que debas.',
    },
    {
      question: '¿Cuándo empieza a sentirse más fácil?',
      answer:
        'Cuando las reglas dejan de ser noticia. La primera señal es nombrar el animal antes del toque y deshacer una casilla roja sin empezar el tablero de nuevo.',
    },
  ],
}
