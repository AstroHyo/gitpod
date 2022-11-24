import React, { FC, useState } from "react";
import { Box, Text, Flex, Button } from "@chakra-ui/react";
import { mintAnimalTokenContract } from "../web3Config";
import MyAnimalCard from "../components/MyAnimalCard";


interface MyAnimalProps {
    account: string;
}

const MyAnimal: FC<MyAnimalProps> = ({ account }) => {
    //내 animal card를 저장할 배열
    const [animalCardArray, setAnimalCardArray] = useState<string[]>();

    const getAnimalTokens = async () => {
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

                //for문을 이용하여 보유한 각 카드의 아이디 구하기
                const animalTokenIdArray = [];
                for(var i=0; i<balanceLength; i++) {
                    const animalTokenId = await mintAnimalTokenContract.methods
                    .tokenOfOwnerByIndex(account, i)
                    .call();
                    animalTokenIdArray[i] = animalTokenId;
                }

                //for문을 이용하여 보유한 각 카드의 animal type 구하기
                const animalTypeArray = [];
                for(var i=0; i<balanceLength; i++) {
                    const animalType = await mintAnimalTokenContract.methods
                    .animalTypes(animalTokenIdArray[i])
                    .call(); 
                    animalTypeArray[i] = animalType;
                }

                //animalTypeArray 넣기
                setAnimalCardArray(animalTypeArray);
            }

        } catch (error) {
            console.error(error);
        }
    }
    return (
        <Flex w="full" h="100vh" justifyContent="center" alignItems="center" direction="column">
            <Box>
                {animalCardArray ? (
                    <MyAnimalCard myAnimalTypeArray={animalCardArray} />
                ) : (
                    <Text>Let's mint Animal Card!!!</Text>
                )}
            </Box>
        </Flex>
    );
}


export default MyAnimal;