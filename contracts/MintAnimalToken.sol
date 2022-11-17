// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

//민팅 함수 작성
contract MintAnimalToken is ERC721Enumerable {
    constructor() ERC721("HYOnimals", "HIM") {}

    function mintAnimalToken() public {
        uint256 animalTokenId = totalSupply() + 1;

        _mint(msg.sender, animalTokenId);
    }
}