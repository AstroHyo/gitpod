import React, { FC, useEffect, useState } from "react";
import { Grid, Flex, Box, Text, Button } from "@chakra-ui/react";
import AnimalCard from"./AnimalCard";
import { web3 } from "../web3Config";

interface SaleAnimalCardProps {
    animalType: string;
    animalPrice: string;
}

const SaleAnimalCard: FC<SaleAnimalCardProps> = ({ animalType, animalPrice, }) => {
    return (
        <Box textAlign="center" w={150}>
            <AnimalCard animalType={animalType}/>
            <Box>
                <Text d="inline-block">
                    {web3.utils.fromWei(animalPrice)} Matic
                </Text>
                <Button size="sm" colorScheme="green" m={2}>Buy</Button>
            </Box>
        </Box>
    );
}

export default SaleAnimalCard;
