import React, { FC } from 'react'
import { Box, Button, Text } from '@chakra-ui/react'
import AnimalCard from "./AnimalCard";
import { web3 } from '../web3Config';

//내가 가진 animal card의 정보
export interface IMyAnimalCard {
  animalTokenId: string;
  animalType: string;
  animalPrice: string;
}

interface MyAnimalCardProps extends IMyAnimalCard {
  saleStatus: boolean;
  account: string;
}

const MyAnimalCard: FC<MyAnimalCardProps> = ({ animalTokenId, animalType, animalPrice, saleStatus, account }) => {
  return (
    <Box textAlign="center" w={150}>
      <AnimalCard animalType={animalType}/>
      <Box mt={2}>
        {animalPrice === "0" ? (
          <Button>Sale</Button> 
        ) : (
          <Text d="inline-block">
            {web3.utils.fromWei(animalPrice)} Matic
          </Text>
        )}
      </Box>
    </Box>
  );
}

export default MyAnimalCard