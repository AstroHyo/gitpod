import React, { FC, useEffect, useState } from "react";
import { Flex, Text, Button, Grid } from "@chakra-ui/react";
import { mintAnimalTokenContract, saleAnimalTokenAddress, saleAnimalTokenContract } from "../web3Config";
import MyAnimalCard, { IMyAnimalCard } from "../components/MyAnimalCard";

interface MyAnimalProps {
    account: string;
}

const MyAnimal: FC<MyAnimalProps> = ({ account }) => {
    //내 animal card를 저장할 배열
    const [animalCardArray, setAnimalCardArray] = useState<IMyAnimalCard[]>();
    //판매 권한 상태를 받아올 수 있는 변수
    const [saleStatus, setSaleStatus] = useState<boolean>(false);

    //내 animal card 배열을 가져오는 함수
    const getAnimalTokens = async () => {
        try {
            //owner가 가진 전체 토큰의 개수 받아오기
            const balanceLength = await mintAnimalTokenContract.methods
                .balanceOf(account)
                .call();

            //for문을 이용하여 보유한 각 카드의 animal type 구하기
            const tempAnimalCardArray = [];

            for(let i=0; i < parseInt(balanceLength); i++) {
                const animalTokenId = await mintAnimalTokenContract.methods
                    .tokenOfOwnerByIndex(account, i)
                    .call();

                const animalType = await mintAnimalTokenContract.methods
                    .animalTypes(animalTokenId)
                    .call();  

                const animalPrice = await saleAnimalTokenContract.methods
                    .animalTokenPrices(animalTokenId)
                    .call();
                
                tempAnimalCardArray.push({animalTokenId, animalType, animalPrice});
            }

            //animalTypeArray 넣기
            setAnimalCardArray(tempAnimalCardArray);
        } catch (error) {
            console.error(error);
        }
    };

    //내 판매 권한의 승인 여부를 가져오는 함수
    const getIsApprovedForAll = async () => {
        try {
            const response = await mintAnimalTokenContract.methods
                .isApprovedForAll(account, saleAnimalTokenAddress)
                .call();

            if(response) {
                setSaleStatus(response);
            }
        } catch (error) {
            console.error(error);
        }
    }

    //판매 권한 변경 버튼을 눌렀을 때 바꿔주는 버튼 함수 
    const onClickApproveToggle = async () => {
        try {
            if(!account) return;
            
            const response = await mintAnimalTokenContract.methods
                .setApprovalForAll(saleAnimalTokenAddress, !saleStatus)
                .send({ from:account });
            
            //위의 response에 값이 정상적으로 들어온 경우 현재 saleStatus의 반대 상태로 변경
            if(response.status) {
                setSaleStatus(!saleStatus);
            }
        } catch(error) {
            console.log(error);
        }
    }

    useEffect(() => {
        //account를 못 받아 왔을 경우 아무것도 실행하지 않음
        if(!account) return;

        getIsApprovedForAll();
        getAnimalTokens();
    }, [account]);

    
    useEffect(() => {
        console.log(animalCardArray);
    }, [animalCardArray]);
    
    //Grid로 일정 숫자만큼 띄워서 보여주기
    return (
        <>
        <Flex alignItems="center">
            <Text display="inline-block">
                Sale Status : {saleStatus ? "True" : "False"}
            </Text>
            <Button size="xs" ml={2} colorScheme={saleStatus ? "red" : "blue"} onClick={onClickApproveToggle}>
                {saleStatus ? "Cancel" : "Approve"}
            </Button>
        </Flex>
        <Grid templateColumns="repeat(5, 1fr)" gap={8} mt={4}>
            {animalCardArray && animalCardArray.map((v, i) => {
                    return (
                        <MyAnimalCard 
                            key={i} 
                            animalTokenId={v.animalTokenId}
                            animalType={v.animalType}
                            animalPrice={v.animalPrice}
                            saleStatus={saleStatus}
                            account={account}
                        />
                    );
                })
            }
        </Grid>
    </>
    );
}

export default MyAnimal;