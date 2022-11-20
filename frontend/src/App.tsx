import React, { FC, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Main from "./routes/main";

const App: FC = () => {
  //MetaMask 계정 가져와서 연결하기
  const [account, setAccount] = useState<string>("");

  const getAccount = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setAccount(accounts[0]);
      } else {
        alert("MetaMast를 설치하세요!");
      }
    } catch(error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getAccount();
  }, []);

  //잘 연결됐는지 확인
  useEffect(() => {
    console.log(account);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
