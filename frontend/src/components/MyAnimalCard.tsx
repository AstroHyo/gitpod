import React, { FC, useState, ChangeEvent } from 'react'
import { Box, Button, Text, InputGroup, Input, InputRightAddon } from '@chakra-ui/react'
import AnimalCard from "./AnimalCard";
import { saleAnimalTokenAddress, saleAnimalTokenContract, web3 } from '../web3Config';

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
  const [sellPrice, setSellPrice] = useState<string>("");
  const [myAnimalPrice, setMyAnimalPrice] = useState<string>(animalPrice);

  //input의 값이 바뀔 때마다 sellPrice가 그 input으로 set됨
  const onChangeSellPrice = (e: ChangeEvent<HTMLInputElement>) => {
    setSellPrice(e.target.value);
  };

  const onClickSell = async () => {
    try {
      if(!account) return window.alert("계정 연결 필요");
      if(!saleStatus) return window.alert("판매 권한 승인이 필요합니다.");
      //가격을 보내는 인자: web3.utils.toWei
      const response = await saleAnimalTokenContract.methods
        .setForSaleAnimalToken(
          animalTokenId, 
          web3.utils.toWei(sellPrice, "ether")
        )
        .send({ from: account });
        

      if(response.status) {
        setMyAnimalPrice(web3.utils.toWei(sellPrice, "ether"));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box textAlign="center" w={150}>
      <AnimalCard animalType={animalType}/>
      <Box mt={2}>
        {myAnimalPrice === "0" ? (
          <>
            <InputGroup>
              <Input type="number" value={sellPrice} onChange={onChangeSellPrice} />
              <InputRightAddon children="Matic" />
            </InputGroup>
            <Button size="sm" colorScheme="green" mt={2} onClick={onClickSell}>
              Sell
            </Button>
          </>
        ) : (
          <Text d="inline-block">
            {web3.utils.fromWei(myAnimalPrice)} Matic
          </Text>
        )}
      </Box>
    </Box>
  );
}

export default MyAnimalCard