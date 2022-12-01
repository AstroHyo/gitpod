// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

import "SaleAnimalToken.sol";

//민팅 함수 작성
contract MintAnimalToken is ERC721Enumerable {
    constructor() ERC721("HYOnimals", "HIM") {}

    SaleAnimalToken public saleAnimalToken;

    //animalTypes를 관리하는 mapping; 첫번째 uint256은 animalTokenId를 가르킴, 두번째는 animalTypes가; 그래서 id를 입력하면 animalTypes가을 출력
    mapping(uint256 => uint256) public animalTypes;

    //토큰의 데이터들을 담을 수 있는 변수 틀
    struct  AnimalTokenData {
        uint256 animalTokenId;
        uint256 animalType;
        uint256 animalPrice;
    }

    function mintAnimalToken() public {
        //아이디 생성
        uint256 animalTokenId = totalSupply() + 1;

        //1~5사이의 랜덤 값을 얻기 위한 코드
        uint256 animalType = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, animalTokenId))) % 5 + 1;

        //animalTokenId를 가지는 새롭게 생성하는 토큰에 1~5사이의 값이 animalTypes로 들어가게 됨
        animalTypes[animalTokenId] = animalType;

        _mint(msg.sender, animalTokenId);
    }

    //토큰의 정보(id, type, price)를 모두 가져오는 함수; memory는 블록체인에 저장되는 것이 아닌 일시적으로 저장되는 것
    function getAnimalTokens(address _animalTokenOwner) view public returns (AnimalTokenData[] memory) {
        uint256 balanceLength = balanceOf(_animalTokenOwner);

        //토큰이 있는지 체크, 없으면 error message 띄우기
        require(balanceLength != 0, "Owner doesn't have tokens.");

        AnimalTokenData[] memory animalTokenData = new AnimalTokenData[](balanceLength);

        //만든 배열에 각 토큰의 정보 넣기 
        for(uint256 i = 0; i < balanceLength; i++) {
            uint256 animalTokenId = tokenOfOwnerByIndex(_animalTokenOwner, i);
            uint256 animalType = animalTypes[animalTokenId]; //mapping이라 대괄호 
            uint256 animalPrice = saleAnimalToken.getAnimalTokenPrice(animalTokenId);

            animalTokenData[i] = AnimalTokenData(animalTokenId, animalType, animalPrice);
        }

        return animalTokenData;
    }

    function setSaleAnimalToken(address _saleAnimalToken) public {
        saleAnimalToken = SaleAnimalToken(_saleAnimalToken);
    }
}
