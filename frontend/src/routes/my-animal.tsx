import React, { FC, useEffect, useState } from "react";
import { Grid } from "@chakra-ui/react";
import { mintAnimalTokenContract } from "../web3Config";
import AnimalCard from "../components/AnimalCard";


interface MyAnimalProps {
    account: string;
}

const MyAnimal: FC<MyAnimalProps> = ({ account }) => {
    //내 animal card를 저장할 배열
    const [animalCardArray, setAnimalCardArray] = useState<string[]>();

    const getAnimalTokens = async () => {
        try {
            //owner가 가진 전체 토큰의 개수 받아오기
            const balanceLength = await mintAnimalTokenContract.methods
                .balanceOf(account)
                .call();

            //for문을 이용하여 보유한 각 카드의 animal type 구하기
            const tempAnimalCardArray = [];

            for(let i=0; i=parseInt(balanceLength); i++) {
                const animalTokenId = await mintAnimalTokenContract.methods
                    .tokenOfOwnerByIndex(account, i)
                    .call();

                const animalType = await mintAnimalTokenContract.methods
                    .animalTypes(animalTokenId)
                    .call();  
                console.log("완료1");

                tempAnimalCardArray.push(animalType);
            }

            //animalTypeArray 넣기
            setAnimalCardArray(tempAnimalCardArray);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        //account를 못 받아 왔을 경우 아무것도 실행하지 않음
        if(!account) return;

        getAnimalTokens();
    }, [account]);

    useEffect(() => {
        console.log(animalCardArray);
    }, [animalCardArray]);
    
    //Grid로 일정 숫자만큼 띄워서 보여주기
    return <Grid templateColumns="repeat(4, 1fr)" gap={8}>
        {animalCardArray && animalCardArray.map((v, i) => {
                return <AnimalCard key={i} animalType={v}/>
            })
        }
    </Grid>
}

export default MyAnimal;