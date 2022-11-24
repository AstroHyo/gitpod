import React, { FC, useState } from "react";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { mintAnimalTokenContract } from "../web3Config";
import AnimalCard from "../components/AnimalCard";

interface MainProps {
    //account는 주소
    account: string;
}

const Main: FC<MainProps> = ({ account }) => {
    const [newAnimalType, setNewAnimalType] = useState<string>();

    //mint 하는 함수
    const onClickMint = async () => {
        try {
            if (!account) return;

            //mint하는 코드; (컨트랙트 이름).methods.(실행할 함수(+인자)).(기능) 형식으로 코드 작성
            const response = await mintAnimalTokenContract.methods
                .mintAnimalToken()
                .send({ from: account });
            
            //위의 민팅 함수가 정상적으로 실행됐을 경우,
            if(response.status) {
                //owner가 가진 전체 토큰의 개수 받아오기
                const balanceLength = await mintAnimalTokenContract.methods
                    .balanceOf(account)
                    .call();

                //가장 마지막으로 민팅한 토큰 아이디 구하기
                const animalTokenId = await mintAnimalTokenContract.methods
                    .tokenOfOwnerByIndex(account, parseInt(balanceLength, 10) - 1)
                    .call();

                //해당 토큰의 animal type 구하기
                const animalType = await mintAnimalTokenContract.methods
                    .animalTypes(animalTokenId)
                    .call(); 
                
                //새로운 토큰에 animal type 넣기
                setNewAnimalType(animalType);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Flex w="full" h="100vh" justifyContent="center" alignItems="center" direction="column">
            <Box>
                {newAnimalType ? (
                    <AnimalCard animalType={newAnimalType} />
                ) : (
                    <Text>Let's mint Animal Card!!!</Text>
                )}
            </Box>
            <Button mt={4} size="sm" colorScheme="blue" onClick={onClickMint}>Mint</Button>
        </Flex>
    );
};

export default Main;