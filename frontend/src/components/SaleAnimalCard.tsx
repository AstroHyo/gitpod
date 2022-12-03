import React, { FC, useEffect, useState } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import AnimalCard from"./AnimalCard";
import { mintAnimalTokenContract, saleAnimalTokenContract, web3 } from "../web3Config";

interface SaleAnimalCardProps {
    animalType: string;
    animalTokenId: string;
    animalPrice: string;
    account: string;
    getOnSaleAnimalTokens: () => Promise<void>;
}

const SaleAnimalCard: FC<SaleAnimalCardProps> = ({ 
    animalType, 
    animalPrice, 
    animalTokenId, 
    account, 
    getOnSaleAnimalTokens
}) => {
    //해당 card를 구매가능한지 안한지 저장하는 변수
    const [isBuyable, setIsBuyable] = useState<boolean>(false);

    const getAnimalTokenOwner = async () => {
        try {
            const response= await mintAnimalTokenContract.methods
                .ownerOf(animalTokenId)
                .call();

            //card 주인(판매자)의 account와 구매자의 account가 같은지 확인
            setIsBuyable(
                response.toLocaleLowerCase() === account.toLocaleLowerCase()
            );
        } catch(error) {
            console.error(error);
        }
    }
    
    const onClickBuy = async () => {
        try {
            if(!account) return;

            const response = await saleAnimalTokenContract.methods
                .purchaseAnimalToken(animalTokenId)
                .send({ from: account, value: animalPrice });

                //트렌젝션이 성공적으로 왔을 때
                if(response.status) {
                    getOnSaleAnimalTokens();
                }
        } catch (error) {
            console.error(error);
        }
    } 
    
    useEffect(() => {
        getAnimalTokenOwner();
    }, [])

    return (
        <Box textAlign="center" w={150}>
            <AnimalCard animalType={animalType}/>
            <Box>
                <Text d="inline-block">
                    {web3.utils.fromWei(animalPrice)} Matic
                </Text>
                <Button size="sm" colorScheme="green" m={2} disabled={isBuyable} onClick={onClickBuy}>
                    Buy
                </Button>
            </Box>
        </Box>
    );
}

export default SaleAnimalCard;
