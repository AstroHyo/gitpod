import React, { FC } from 'react'
import { Image } from '@chakra-ui/react'

interface MyAnimalCardProps {
  myAnimalTypeArray: string
}

const MyAnimalCard: FC<MyAnimalCardProps> = ({ myAnimalTypeArray }) => {
  return <Image w={150} h={150} borderRadius={10} src={`images/${myAnimalTypeArray}.png`} alt="Animal Card" />
}

export default MyAnimalCard