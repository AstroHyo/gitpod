// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

//민팅 함수 작성
contract MintAnimalToken is ERC721Enumerable {
    constructor() ERC721("HYOnimals", "HIM") {}

    //animalTypes를 관리하는 mapping; 첫번째 uint256은 animalTokenID를 가르킴, 두번째는 animalTypes가; 그래서 id를 입력하면 animalTypes가을 출력
    mapping(uint256 => uint256) public animalTypes;

    function mintAnimalToken() public {
        //아이디 생성
        uint256 animalTokenId = totalSupply() + 1;

        //1~5사이의 랜덤 값을 얻기 위한 코드
        uint256 animalType = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, animalTokenId))) % 5 + 1;

        //animalTokenId를 가지는 새롭게 생성하는 토큰에 1~5사이의 값이 animalTypes로 들어가게 됨
        animalTypes[animalTokenId] = animalType;

        _mint(msg.sender, animalTokenId);
    }
}
