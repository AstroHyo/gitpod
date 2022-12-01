import React, { FC, useEffect, useState } from "react";
import { Grid, Flex, Box, Text, Button } from "@chakra-ui/react";
import { IMyAnimalCard } from "../components/MyAnimalCard";
import { mintAnimalTokenContract, saleAnimalTokenContract } from "../web3Config";


interface SaleAnimalProps {
    account: string;
}

const SaleAnimal: FC<SaleAnimalProps> = ({ account }) => {
    const [saleAnimalCard, setSaleAnimalCard] = useState<IMyAnimalCard[]>();

    //현재 판매 상태인 토큰을 가져오는 함수
    const getOnSaleAnimalTokens = async () => {
        try {
            //판매 토큰 배열 길이 가져오기
            const onSaleAnimalTokenArrayLength = await saleAnimalTokenContract.methods
                .getOnSaleAnimalTokenArrayLength()
                .call();

            const tempOnSaleArray: IMyAnimalCard[] = [];

            //판매 토큰 정보 가져와 배열에 넣기
            for(let i = 0; i < parseInt(onSaleAnimalTokenArrayLength); i++) {
                const animalTokenId = await saleAnimalTokenContract.methods
                    .onSaleAnimalTokenArray(i)
                    .call();
                
                const animalType = await mintAnimalTokenContract.methods
                    .animalTypes(animalTokenId)
                    .call(); 
                
                const animalPrice = await saleAnimalTokenContract.methods
                    .animalTokenPrices(animalTokenId)
                    .call();              
                    
                tempOnSaleArray.push({animalTokenId, animalType, animalPrice})
            }

            setSaleAnimalCard(tempOnSaleArray);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getOnSaleAnimalTokens();
    }, []);

    return <Grid mt={4} templateColumns="repeat(4, 1fr)" gap={8}></Grid>;
};

export default SaleAnimal;
