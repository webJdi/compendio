'use client'

import { Box, Head} from "@mui/material";
import Image from "next/image";
import { useEffect } from "react";




export default function Home() {
  useEffect(() =>{
    document.title = "Compendio"
  
  
  },[]);

  const bgOne = "#D9D9D9";
  const bgTwo = "#BDC3C7"


  return (
    
    <Box
        backgroundColor={bgOne}
        width={'100vw'}
        height={'100vh'}
        position={'relative'}
    >
        <Box
          position={'absolute'}
          width={'28vw'}
          height={'100vh'}
          top={'0'}
          left={'0'}
          backgroundColor={bgTwo}
        >

        </Box>

    </Box>
    
  );
}
