// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./MintAnimalToken.sol";

contract SaleAnimalToken {
    MintAnimalToken public mintAnimalTokenAddress;
    
    //민팅할 때 나온 주소값을 constructor을 이용하여 여기에 불러와서 넣어준다. 
    constructor (address _mintAnimalTokenAddress) {
        mintAnimalTokenAddress = MintAnimalToken(_mintAnimalTokenAddress);
    }

    //가격들을 관리하는 mapping; 첫번째 uint256은 animalTokenID를 가르킴, 두번째는 price; 그래서 id를 입력하면 가격을 출력
    mapping(uint256 => uint256) public animalTokenPrices;
    
    //판매 중인 토큰 배열
    uint256[] public onSaleAnimalTokenArray;

    //판매 등록하는 함수; 무엇을 팔지와 가격을 인수로 받음
    function setForSaleAnimalToken(uint256 _animalTokenID, uint256 _price) public {
        //주인에 해당하는 사람이 맞는지 알아보기 위해 주소를 불러옴
        address animalTokenOwner = mintAnimalTokenAddress.ownerOf(_animalTokenID);
        
        //판매 전 조건 확인 
        //이 함수를 사용하는 사람이 토큰 주인이 맞으면 통과, 아니면 에러 출력
        require(animalTokenOwner == msg.sender, "Caller is not animal token owner.");
        require(_price > 0, "Price is zero or lower.");
        //해당 토큰의 가격이 0이 아니라면 이미 판매가 진행된 토큰
        require(animalTokenPrices[_animalTokenID] == 0, "This animal token is already on sale.");
        //토큰의 주인이 이 스마트 컨트렉트에 판매 권한을 넘겼는지 확인
        require(mintAnimalTokenAddress.isApprovedForAll(animalTokenOwner, address(this)), "Animal token owner did not approve token.");

        //가격 설정
        animalTokenPrices[_animalTokenID] = _price;
        //판매 중인 토큰 배열에 추가
        onSaleAnimalTokenArray.push(_animalTokenID);
    }
}
