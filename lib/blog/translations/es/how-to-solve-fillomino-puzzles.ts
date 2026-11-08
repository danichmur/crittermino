import { blank, cat, lion, mouse, panda } from '@/lib/blog/cells'
import { board, list, paragraph, type BlogCopy } from '@/lib/blog/types'

const empty = blank()

export const howToEs: BlogCopy = {
  title: 'Cómo resolver puzzles de Fillomino',
  description:
    'Un tutorial de cómo resolver Fillomino: qué significa el número, cómo crecen las regiones y un 4×4 que puedes terminar a mano.',
  keywords: ['cómo resolver fillomino', 'tutorial de fillomino', 'reglas del fillomino', 'puzzle fillomino'],
  sections: [
    {
      heading: 'Qué pide el número',
      blocks: [
        paragraph(
          'Este tutorial enseña cómo resolver Fillomino sin adivinar. El número de una casilla es el tamaño de su región. Un 4 significa cuatro casillas unidas, y cada una de ellas es un 4. Dos regiones de ese tamaño se quedan aparte: nunca comparten un lado. El resto es esa regla, practicada en un 4×4 que puedes comprobar a mano, y luego jugada con los animales de Crittermino.',
        ),
        paragraph(
          'Crittermino es el mismo puzzle. El ratón es 2, el gato 3, el perro 4, el panda 5 y el león 6. Si prefieres tocar en vez de escribir números, la [[/how-to-play|página de cómo jugar]] tiene un tablero que puedes llenar. Esta página se queda con la lógica. Los dibujos usan animales para que el tamaño se vea. En papel, escribe el número.',
        ),
      ],
    },
    {
      heading: 'Las tres reglas',
      blocks: [
        paragraph(
          'Toda cuadrícula legal obedece tres reglas. La cuadrícula está llena: cada casilla pertenece a una región. Una región es una pieza: las casillas se unen por un lado, y una esquina no las conecta. El número de la región es la cuenta de casillas de esa pieza, y el mismo número está escrito en cada casilla de la pieza. Una región de cuatro 4 puede ser una línea recta, un cuadrado o un doblez. La forma puede girar. Sigue siendo una pieza.',
        ),
        paragraph(
          'Las casas del mismo tamaño se quedan aparte. Pueden tocarse por una esquina. Una región de 4 puede compartir un lado con una región de 3. En Crittermino esa frase es: dos casas de perro mantienen una pared entre ellas, y una casa de perro puede sentarse contra una casa de gato. No hay regla de filas, columnas ni cajas. Buscar en una línea el dígito que falta es Sudoku. La [[/blog/fillomino-vs-sudoku|diferencia entre Fillomino y Sudoku]] tiene su propia página. En el resto de este tutorial, mira las regiones.',
        ),
        board(
          'Dos casas de ratón se tocan por una esquina. Cada casa tiene dos casillas.',
          'Legal. Las casas se encuentran en una esquina, así que cada casa de ratón puede seguir siendo de tamaño 2.',
          [
            [mouse(), mouse(), empty, empty],
            [empty, empty, mouse(), mouse()],
          ],
        ),
        board(
          'Dos casas de ratón comparten un lado, y el tablero las marca mal.',
          'Ilegal. Cada pareja tiene el tamaño justo, y las parejas comparten un lado. Mismo tamaño, pared compartida.',
          [
            [mouse('bad'), mouse('bad'), empty],
            [empty, mouse('bad'), mouse('bad')],
          ],
        ),
        board(
          'Tres ratones en fila, una casilla de más.',
          'Ilegal por otra razón. Tres ratones unidos son una casa de tres. Una casa de ratón son dos casillas.',
          [[mouse('bad'), mouse('bad'), mouse('bad')]],
        ),
      ],
    },
    {
      heading: 'El Fillomino de papel y los cinco animales',
      blocks: [
        paragraph(
          'Un número impreso es una pista. La conservas. En papel, Fillomino también permite un 1, una región de una casilla, y tamaños mayores que 6 cuando el tablero tiene sitio. Una región puede existir sin ninguna pista. La descubres por las casillas que quedan. Dos pistas del mismo número pueden estar dentro de una región, y una región puede tener una sola pista.',
        ),
        paragraph(
          'Crittermino usa cinco animales, así que los únicos tamaños son 2, 3, 4, 5 y 6. No hay un ratón de una casilla ni una región de siete. Los hábitos para resolver son los mismos. La paleta es más corta, y por eso un tablero pequeño se termina en una sentada. Los niveles de la campaña usan solo esa paleta. La cuadrícula de abajo también se queda dentro, así que puedes repetir los mismos pasos en el juego.',
        ),
      ],
    },
    {
      heading: 'Cómo resolver Fillomino desde una sola pista',
      blocks: [
        paragraph(
          'En la primera pasada no busques un patrón en toda la cuadrícula. Elige la pista con el número más pequeño. Una región pequeña tiene menos formas. Un 2 en una esquina tiene dos vecinos que comparten un lado. La región necesita exactamente una casilla más, así que se le une exactamente uno de esos vecinos. Puede que aún no sepas cuál. Sí sabes que la región no puede llevarse los dos, porque los dos harían una casa de tres.',
        ),
        paragraph(
          'Una pista grande empuja al otro lado. Un 6 necesita seis casillas unidas. Colócalo contra el borde y cuenta las casillas a las que todavía puede llegar antes de chocar con el borde o con una casa que ya cerraste. Si esa cuenta es menor que seis, la forma es imposible, y la casilla que hay que quitar es la última que añadiste.',
        ),
        paragraph(
          'Di cuántas casillas faltan antes de escribir. «A este gato le falta una casilla» es una decisión. «Esto parece un gato» es una suposición. Las suposiciones hacen imposible el último tercio del tablero. En un puzzle honesto la siguiente casilla está forzada. Los niveles publicados de Crittermino tienen una solución. Si dos colocaciones parecen legales, una de ellas rompe una casa que todavía no has contado.',
        ),
      ],
    },
    {
      heading: 'Pistas iguales que comparten un lado',
      blocks: [
        paragraph(
          'Si dos pistas muestran el mismo número y comparten un lado, son la misma región. Tienen que serlo. Las regiones separadas de ese tamaño no pueden compartir un lado, y estas dos casillas ya lo hacen. Márcalas unidas y busca el resto de la forma. Dos 5 vecinos son dos casillas de una casa de cinco, y a esa casa todavía le faltan tres casillas.',
        ),
        paragraph(
          'La diagonal es otro hecho. Dos 5 que se tocan solo por una esquina pueden ser la misma región, si alguna casilla posterior las conecta, o pueden ser dos regiones. La esquina no obliga a unirlas y no lo prohíbe. Deja esa pareja quieta hasta que hable otra regla. Quien empieza se salta la unión por el lado porque se siente callada. Es la deducción más rápida del puzzle.',
        ),
      ],
    },
    {
      heading: 'Cuenta las casillas que las pistas ya gastaron',
      blocks: [
        paragraph(
          'Antes de inventar una región nueva, suma los tamaños a los que ya te comprometiste. Cada pista de tamaño N reclama N casillas, salvo que hayas demostrado que comparte su región con otra pista de N. Las regiones separadas no pueden compartir esas casillas. Si la suma es mayor que el tablero, la división está mal, y algunas de las pistas iguales son la misma casa.',
        ),
        paragraph(
          'Este paso abre el 4×4 de abajo. El tablero tiene 16 casillas y tres pandas. Un panda es 5. Tres casas de panda separadas reclamarían 15 casillas, y el león, el gato y el ratón siguen necesitando casa. Dos casas de panda reclamarían 10. Un león es 6, un gato 3 y un ratón 2. Diez más seis más tres más dos son 21, que es más que 16. Los tres pandas son una casa de cinco. Esa casa tiene sitio exactamente para dos casillas además de las impresas.',
        ),
        paragraph(
          'Quedan once casillas. El tablero muestra dos leones. Dos casas de león separadas reclamarían 12 casillas, y solo quedan 11, así que los dos leones son una casa de seis aunque todavía no se toquen. Una cuenta que prohíbe una división vale tanto como una pared. Seis más tres más dos son once. Cada casilla que queda es león, gato o ratón. No hay un perro escondido ni un segundo gato.',
        ),
      ],
    },
    {
      heading: 'Un 4×4 que puedes terminar a mano',
      blocks: [
        paragraph(
          'Este es el tablero de salida. Los animales impresos se quedan en el color claro. Las casillas que añaden las reglas van en el color más hondo. Las filas van de arriba abajo, las columnas de izquierda a derecha.',
        ),
        board(
          'Inicio de 4 por 4. Leones en la fila 1 columna 1 y en la fila 3 columna 1. Pandas en la fila 1 columna 4, fila 2 columna 3 y fila 4 columna 4. Gato en la fila 3 columna 2. Ratón en la fila 4 columna 1.',
          'Siete pistas. El león es 6, el panda 5, el gato 3, el ratón 2. Las casillas blancas son tuyas.',
          [
            [lion(), empty, empty, panda()],
            [empty, empty, panda(), empty],
            [lion(), cat(), empty, empty],
            [mouse(), empty, empty, panda()],
          ],
        ),
        paragraph(
          'La cuenta de arriba ya dice que los tres pandas son una casa de cinco, así que puedes añadir exactamente dos casillas. Los pandas impresos no se tocan. Llámalos superior (fila 1, columna 4), medio (fila 2, columna 3) e inferior (fila 4, columna 4). El superior y el medio tienen dos vecinos en común: fila 1 columna 3, y fila 2 columna 4. Una de esas casillas los une. El medio y el inferior no tienen un vecino en común. El camino más corto entre ellos usa dos casillas extra. La casa entera solo puede gastar dos casillas extra, así que la unión del superior con el medio tiene que costar una, y esa casilla tiene que estar en el camino hacia el inferior.',
        ),
        paragraph(
          'La fila 2 columna 4 es esa casilla. Toca al panda superior y al panda medio. La casilla que te queda es la fila 3 columna 4, que toca tanto ese puente como el panda inferior. La casa son los tres pandas impresos más esos dos puentes. El otro puente superior, fila 1 columna 3, une al superior con el medio y deja al panda inferior a dos pasos cuando el presupuesto es de un paso. No cabe. Este par es el único que cabe.',
        ),
        board(
          'Casa del panda cerrada. Pandas nuevos en la fila 2 columna 4 y en la fila 3 columna 4.',
          'Las dos casillas verdes más oscuras son los únicos puentes que unen a los tres pandas en una casa de cinco.',
          [
            [lion(), empty, empty, panda()],
            [empty, empty, panda(), panda('found')],
            [lion(), cat(), empty, panda('found')],
            [mouse(), empty, empty, panda()],
          ],
        ),
        paragraph(
          'El ratón está en la esquina inferior izquierda. Una casa de ratón son dos casillas. Esa esquina tiene dos vecinos: la casilla de arriba y la casilla de la derecha. La de arriba ya es un león, así que sigue siendo un león. La de la derecha está libre. Coloca ahí el ratón. La casa del ratón está cerrada.',
        ),
        board(
          'Casa del ratón cerrada. El segundo ratón está en la fila 4 columna 2.',
          'El ratón de la esquina no puede usar el león que tiene encima. La casilla de la derecha es la segunda casilla del ratón.',
          [
            [lion(), empty, empty, panda()],
            [empty, empty, panda(), panda('found')],
            [lion(), cat(), empty, panda('found')],
            [mouse(), mouse('found'), empty, panda()],
          ],
        ),
        paragraph(
          'Al gato de la fila 3 columna 2 le faltan dos casillas. Su vecino de la izquierda es el león impreso. Su vecino inferior izquierdo es el ratón que acabas de colocar. Los vecinos abiertos están arriba (fila 2, columna 2) y a la derecha (fila 3, columna 3).',
        ),
        paragraph(
          'Supón que el gato se lleva los dos y para: fila 2 columna 2, la pista y fila 3 columna 3. La casilla bajo ese gato de la derecha, fila 4 columna 3, tiene entonces un ratón a la izquierda, un panda a la derecha y un gato arriba. Nada del león puede alcanzarla. Esa casilla quedaría aislada, así que esta forma de gato es ilegal.',
        ),
        paragraph(
          'Supón en cambio que el gato crece hacia arriba y nunca toma la casilla de su derecha. Un intento es la casilla sobre el gato más la casilla sobre esa. La casilla vacía de la fila 1 columna 3 queda entonces tapiada por ese gato y por dos pandas. Otro intento pone un gato en la fila 2 columna 1, entre los dos leones impresos. Los dos caminos que salen del león inferior, arriba y a la derecha, son gatos, así que las dos pistas de león no pueden encontrarse. Los dos intentos rompen la casa de león que la cuenta ya exigía.',
        ),
        paragraph(
          'La forma que queda corre a la derecha del gato y luego baja. Esas dos casillas son gatos. A la casilla de la derecha no le queda otro sitio para crecer: izquierda es el gato, derecha es un panda, arriba es un panda y abajo está libre. Cuando las formas hacia arriba son ilegales, abajo es la única segunda casilla.',
        ),
        board(
          '4 por 4 terminado. Gatos en la fila 3 columna 3 y en la fila 4 columna 3. Los leones llenan la fila 1 columnas 2 y 3, y la fila 2 columnas 1 y 2.',
          'Las casillas amarillas más oscuras cierran al gato. Las seis casillas del león son una casa unida. Cada tamaño aparece una vez.',
          [
            [lion(), lion('found'), lion('found'), panda()],
            [lion('found'), lion('found'), panda(), panda('found')],
            [lion(), cat(), cat('found'), panda('found')],
            [mouse(), mouse('found'), cat('found'), panda()],
          ],
        ),
        paragraph(
          'Cuenta el león. Es dueño de los dos leones impresos, de la fila 1 columnas 2 y 3, y de la fila 2 columnas 1 y 2. Son seis casillas. Se conectan por los lados: a lo largo de la fila de arriba, hacia abajo a la fila 2, y desde el león impreso de abajo hacia arriba a esa misma fila. No se meten en el panda, el gato ni el ratón. La cuadrícula está llena. Las casas del mismo tamaño no se encuentran, porque cada tamaño aparece una vez.',
        ),
        paragraph(
          'Léelo otra vez como método, no como un truco para este dibujo. Cuenta las reclamaciones hasta que una división ya no quepa. Gasta las casillas de sobra en puentes. Cierra la casa más pequeña cuyo vecino ya está bloqueado. Rechaza una forma que aísle una casilla o parta en dos una casa exigida. Las casillas que quedan son la última casa, y todavía compruebas el tamaño y la conexión. Ese ciclo es cómo resolver Fillomino también en una cuadrícula más grande.',
        ),
      ],
    },
    {
      heading: 'Una región sin pista',
      blocks: [
        paragraph(
          'Una región no necesita una pista impresa. En el 4×4 la cuenta usó cada casilla, así que no había nada escondido. En un tablero más grande las casas que puedas demostrar dejarán un parche de casillas vacías. Cuenta ese parche. Si las casillas son una forma unida, y una casa de ese tamaño no comparte ya un lado con ellas, has encontrado una región que no tenía pista. Escribe el número, o el animal, en cada casilla.',
        ),
        paragraph(
          'Si las casillas que sobran no están unidas, son más de una casa escondida. Pártelas de modo que cada pieza tenga un tamaño legal y las piezas iguales se queden aparte. Este suele ser el último paso, y también es donde aparece un puente malo de hace diez minutos. Un sobrante de siete casillas, en un juego que no tiene tamaño 7, es una división que te saltaste o un puente que añadiste demasiado pronto.',
        ),
      ],
    },
    {
      heading: 'Cuando solo cabe un número',
      blocks: [
        paragraph(
          'Después de cerrar unas casas, algunas casillas vacías tienen un solo tamaño legal. Prueba los tamaños de uno en uno. Si 2, 3, 4 y 5 rompen cada uno un tamaño o una pared, la casilla es un 6, aunque todavía no veas las otras cinco casillas de esa casa. Escríbelo. Luego haz crecer la casa desde esa casilla del mismo modo que creció la primera pista.',
        ),
        paragraph(
          'Un tamaño prohibido sigue siendo una pista. Una casilla vacía sentada en la pared entre dos casas de gato terminadas no puede ser un gato. Tiene que ser algún animal. Anota lo que la casilla no puede ser y prueba lo que queda. La gente mira esa casilla como un blanco. Es un blanco con una opción menos que las casillas de alrededor.',
        ),
        list([
          'Cuenta las casillas que todavía le faltan a una casa.',
          'Tacha los vecinos que tocarían otra casa de ese tamaño.',
          'Tacha las formas que no pueden llegar a la cuenta justa antes de chocar con una pared, una casa cerrada o el borde.',
          'Coloca el número solo cuando queda una opción.',
        ]),
      ],
    },
    {
      heading: 'Qué hacer cuando la cuadrícula se calla',
      blocks: [
        paragraph(
          'Deja de añadir números. Busca la casa sin terminar a la que le faltan menos casillas. Ciérrala. Una casa cerrada es una pared por la que tienen que rodear las regiones grandes, y las paredes son lo que hace obvia la siguiente casilla. El ratón y el gato se cierran primero por esta razón. Un león dibujado en el centro en la segunda jugada bloquea cuatro direcciones y es la razón habitual de que un perro tardío no tenga sitio.',
        ),
        paragraph(
          'Si toda casa pequeña ya está cerrada, busca una casilla vacía tocada por dos casas de un tamaño. Esa casilla tiene prohibido ese tamaño. La prohibición a menudo fuerza al animal del lado lejano de una de esas casas, porque a la casa todavía le falta una casilla y acaba de perder una. Luego haz la suma otra vez. Las regiones que has demostrado separadas tienen que caber en las casillas que quedan. Si no caben, dos pistas que mantuviste aparte son una región. Esa revisión suele ser el nudo entero.',
        ),
        paragraph(
          'En Crittermino una región tiembla cuando está unida por los lados y es ilegal. O es más grande de lo que el animal permite, o se ha unido a otra casa del mismo tamaño. Quita la última casilla antes de colocar nada más. Dos regiones rotas en un tablero esconden qué toque causó el problema. Las pistas no se mueven. Si hay un ratón impreso, esa casilla sigue siendo un ratón. Los [[/blog/crittermino-tips-and-strategies|consejos para los cinco animales]] se quedan con la campaña, el temblor y el botón de pista.',
        ),
      ],
    },
    {
      heading: 'Errores que reinician el tablero',
      blocks: [
        list([
          'Leer el número como un dígito de Sudoku y buscar una segunda copia en la fila.',
          'Tratar un toque de esquina como una unión, o como una pared que prohíbe el mismo tamaño.',
          'Mantener aparte dos pistas iguales después de que ya comparten un lado.',
          'Colocar otro animal después de que el tablero ha temblado.',
          'Dibujar la casa más grande por el centro antes de que las casas pequeñas sean paredes.',
        ]),
        paragraph(
          'Adivinar llena el tablero más rápido y luego te atrapa. Cuando no estés seguro, vuelve a la última casilla que podrías explicar en voz alta. Si no puedes decir qué regla la forzó, bórrala. Una cuadrícula al día basta de práctica. El [[/daily-challenge|puzzle diario]] es compartido, cambia a medianoche UTC y terminarlo no salta un nivel de campaña. La [[/|página de inicio]] empieza la campaña en un tablero bastante pequeño para el primer ratón.',
        ),
      ],
    },
  ],
  faqs: [
    {
      question: '¿Cómo se resuelve un puzzle de Fillomino?',
      answer:
        'Lee cada pista como un tamaño. Haz crecer esa región por los lados hasta que tenga ese número de casillas, mantén dos regiones del mismo tamaño sin compartir un lado y llena cada casilla. Empieza por las pistas más pequeñas y por las pistas iguales que ya se tocan. El 4×4 de esta página es el mismo método a un tamaño que puedes comprobar.',
    },
    {
      question: '¿Pueden tocarse dos números iguales en Fillomino?',
      answer:
        'Pueden tocarse por una esquina. Pueden compartir un lado solo cuando son la misma región. Si dos pistas iguales ya comparten un lado, son una región, y todavía tienes que llegar al tamaño impreso.',
    },
    {
      question: '¿Crittermino es el mismo puzzle que Fillomino?',
      answer:
        'Sí. El ratón es 2, el gato 3, el perro 4, el panda 5 y el león 6. El Fillomino de papel también permite un 1 y tamaños por encima de 6. La [[/how-to-play|página de cómo jugar]] es la versión corta de este tutorial, con un tablero que puedes tocar.',
    },
    {
      question: '¿Una región de Fillomino necesita una pista?',
      answer:
        'No. Una región puede estar hecha por completo de casillas que rellenas tú. Cuando las casas demostradas estén cerradas, cuenta las casillas que quedan. Si forman una figura unida de un tamaño legal, esa figura es una región que no tenía pista.',
    },
  ],
}
