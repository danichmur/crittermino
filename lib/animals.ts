import type { Animal } from '@/types/game'

export interface AnimalDef {
  emoji: Animal
  name: string
  size: 2 | 3 | 4 | 5 | 6
  fill: string
  complete: string
  accent: string
  ink: string
  fillClass: string
  completeClass: string
  buttonClass: string
  ringClass: string
}

export const ANIMALS: readonly AnimalDef[] = [
  {
    emoji: '🐭',
    name: 'Mouse',
    size: 2,
    fill: '#E8ECF1',
    complete: '#D2D8E2',
    accent: '#7C8796',
    ink: '#3E4856',
    fillClass: 'bg-[#E8ECF1]',
    completeClass: 'bg-[#D2D8E2]',
    buttonClass: 'bg-[#7C8796]',
    ringClass: 'ring-[#7C8796]',
  },
  {
    emoji: '🐱',
    name: 'Cat',
    size: 3,
    fill: '#FFF4CC',
    complete: '#FFE58A',
    accent: '#E6B325',
    ink: '#8A6A00',
    fillClass: 'bg-[#FFF4CC]',
    completeClass: 'bg-[#FFE58A]',
    buttonClass: 'bg-[#E6B325]',
    ringClass: 'ring-[#E6B325]',
  },
  {
    emoji: '🐶',
    name: 'Dog',
    size: 4,
    fill: '#F6E6D4',
    complete: '#E8CDB0',
    accent: '#C0844A',
    ink: '#6B4124',
    fillClass: 'bg-[#F6E6D4]',
    completeClass: 'bg-[#E8CDB0]',
    buttonClass: 'bg-[#C0844A]',
    ringClass: 'ring-[#C0844A]',
  },
  {
    emoji: '🐼',
    name: 'Panda',
    size: 5,
    fill: '#E8F5E8',
    complete: '#C8EBC8',
    accent: '#3CB371',
    ink: '#1B7A45',
    fillClass: 'bg-[#E8F5E8]',
    completeClass: 'bg-[#C8EBC8]',
    buttonClass: 'bg-[#3CB371]',
    ringClass: 'ring-[#3CB371]',
  },
  {
    emoji: '🦁',
    name: 'Lion',
    size: 6,
    fill: '#FFE5D9',
    complete: '#FFCDB3',
    accent: '#FF8C42',
    ink: '#C05612',
    fillClass: 'bg-[#FFE5D9]',
    completeClass: 'bg-[#FFCDB3]',
    buttonClass: 'bg-[#FF8C42]',
    ringClass: 'ring-[#FF8C42]',
  },
]

const byEmoji = new Map<Animal, AnimalDef>(ANIMALS.map((animal) => [animal.emoji, animal]))
const bySize = new Map<number, AnimalDef>(ANIMALS.map((animal) => [animal.size, animal]))

export const getAnimalByEmoji = (emoji: Animal): AnimalDef => {
  const animal = byEmoji.get(emoji)
  if (!animal) throw new Error(`Unknown animal ${emoji}`)
  return animal
}

export const getAnimalBySize = (size: number): AnimalDef | null => bySize.get(size) ?? null

export const animalFromSize = (size: number): Animal | null => getAnimalBySize(size)?.emoji ?? null
