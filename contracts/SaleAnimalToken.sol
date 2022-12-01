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
    function setForSaleAnimalToken(uint256 _animalTokenId, uint256 _price) public {
        //주인에 해당하는 사람이 맞는지 알아보기 위해 민팅 주소를 불러옴
        address animalTokenOwner = mintAnimalTokenAddress.ownerOf(_animalTokenId);
        
        //판매 전 조건 확인 
        //이 함수를 사용하는 사람이 토큰 주인이 맞으면 통과, 아니면 에러 출력
        require(animalTokenOwner == msg.sender, "Caller is not animal token owner.");
        require(_price > 0, "Price is zero or lower.");
        //해당 토큰의 가격이 0이 아니라면 이미 판매가 진행된 토큰
        require(animalTokenPrices[_animalTokenId] == 0, "This animal token is already on sale.");
        //토큰의 주인이 이 스마트 컨트렉트에 판매 권한을 넘겼는지 확인
        require(mintAnimalTokenAddress.isApprovedForAll(animalTokenOwner, address(this)), "Animal token owner did not approve token.");

        //가격 설정
        animalTokenPrices[_animalTokenId] = _price;
        //판매 중인 토큰 배열에 추가
        onSaleAnimalTokenArray.push(_animalTokenId);
    }

    //구매 함수; payable을 추가하여 폴리곤 네트워크 함수 사용 가능
    function purchaseAnimalToken(uint256 _animalTokenId) public payable {
        //위의 가격 배열에서 토큰 가격을 가져옴
        uint256 price = animalTokenPrices[_animalTokenId];
        address animalTokenOwner = mintAnimalTokenAddress.ownerOf(_animalTokenId);

        require(price > 0, "This animal token is not yet sale.");
        //토큰의 주인이 구매자와 달라야 구매 가능
        require(animalTokenOwner != msg.sender, "Caller is animal token owner.");
        //만약 토큰 가격보다 매틱(돈)을 적게 보냈을 때 애러 띄우기; msg.value는 보내는 매틱(돈)의 양
        require(price <= msg.value, "Caller sent lower than the price.");

        //거래 코드
        //msg.sender가 보내는 매틱의 양 msg.value를 토큰 주인한테 보내는 코드
        payable(animalTokenOwner).transfer(msg.value);
        //토큰을 돈을 보낸 msg.sender에게 보내는 코드
        mintAnimalTokenAddress.safeTransferFrom(animalTokenOwner, msg.sender, _animalTokenId);
        
        //거래 후 변경하는 코드
        //거래가 성사된 토큰 가격 초기화 
        animalTokenPrices[_animalTokenId] = 0;
        //거래가 성사된 토큰을 판매 중인 배열에서 제거
        for(uint256 i = 0; i < onSaleAnimalTokenArray.length; i++) {
            if(animalTokenPrices[onSaleAnimalTokenArray[i]] == 0) {
                onSaleAnimalTokenArray[i] = onSaleAnimalTokenArray[onSaleAnimalTokenArray.length - 1];
                onSaleAnimalTokenArray.pop();
            }
        }
    }

    //프론트에서 사용할 배열 길이 return 함수; 보기전용은 view, 리턴 타입은 uint256
    function getOnSaleAnimalTokenArrayLength() view public returns (uint256) {
        return onSaleAnimalTokenArray.length;

    }

    //MintAnimalToken.sol에서 사용할 토큰 가격 가져오는 함수
    function getAnimalTokenPrice(uint256 _animalTokenId) view public returns (uint256) {
        return animalTokenPrices[_animalTokenId];
    }
}