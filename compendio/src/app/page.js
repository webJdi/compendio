'use client'

import { Box, Head, Typography, Stack, TextField, Button} from "@mui/material";
import Image from "next/image";
import { useEffect, useState, useRef} from "react";



export default function Home() {

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) => [
      ...messages,
      {role: "user", content: message},
      {role: "assistant", content: ''}
    ])

    const response = fetch('/api/chat',{
    }).then( async(res) => {
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      
      let result = ''
      return reader.read().then(function processText({done, value})
        {if(done)
        {
          return result
        }
        const text = decoder.decode(value || new Int8Array(), {stream:true})
        setMessages((messages)=>{
          let lastMessage = messages[messages.length -1]
          let otherMessages = messages.slice(0, messages.length -1)
          return([
            ...otherMessages,
            {
              ...lastMessage,
              content:lastMessage.content + text
            }
          ])

        })
        return reader.read().then(processText) 
      }
    )
    })
    if (!message.trim() || isLoading) return;
    setIsLoading(true)
    setIsLoading(false)
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() =>{
    document.title = "Compendio"
    scrollToBottom()
  },[messages]);

  const bgOne = "#D9D9D9";
  const bgTwo = "#BDC3C7"
  const bgThree = "#FFFFFF"
  const bgFour = "#E67E22"


  return (
    

    <Box
        backgroundColor={bgOne}
        width={'100vw'}
        height={'100vh'}
        position={'relative'}
    >
        {/*/////////// Left pane //////////////*/}
        <Box
          position={'absolute'}
          width={'28vw'}
          height={'100vh'}
          top={'0'}
          left={'0'}
          backgroundColor={bgTwo}
        >
          {/*///////// Menu /////////// */}
          <Box
          position={'absolute'}
          width={'20vw'}
          height={'10vh'}
          backgroundColor={bgOne}
          borderRadius={'2em'}
          top={'2vh'}
          left={'4vw'}
          >

          </Box>

          {/* ////////////// DP placeholder ///////////////////// */}

          <Box
            width={'200px'}
            height={'200px'}
            borderRadius={'50%'}
            backgroundColor={bgOne}
            margin={'9em auto'}
            marginBottom={'0.5em'}
            boxShadow={' 0 0 30px 1px #786fa6'}
          >
          </Box>
          <Typography
            color={bgThree}
            textAlign={'center'}
            fontSize={'2em'}
          >
          Hi, John Doe!
          </Typography>


          <Box
            width={'100%'}
            height={'35vh'}
            position={'absolute'}
            bottom={'0'}
            left={'0'}
          >
            <Typography
              color={bgThree}
              fontSize={'1.2em'}
              margin={'0.5em'}
            >
              Chats
            </Typography>
            <Stack>

            </Stack>
          </Box>
          


        </Box>
        {/* ///////////////// Left pane ends here ////////////////// */}
        <Box
        position={'absolute'}
        right={0}
        top={0}
        height={'90vh'}
        padding={'1em'}
        width={'62vw'}
        >

        
          <Stack
                direction={'column'}
                spacing={2}
                flexGrow={1}
                overflow={'auto'}
                maxHeight={'100%'}
                onChange={(e) => setMessage(e.target.value)}
                
                disabled={isLoading}>
                  {messages.map((message, index) => (
                    <Box
                      key={index}
                      display={'flex'}
                      justifyContent={
                        message.role === 'assistant' ? 'flex-start':'flex-end'
                      }
                    >
                      <Box color={'#fff'} padding={'1em'} borderRadius={'2em'} bgcolor={
                        message.role === 'assistant' ? '#786fa6' : '#cf6a87'
                      }>
                        {message.content}
                      </Box>
                    </Box>
                  ))}
                  <div ref={messagesEndRef} />
                </Stack>
            </Box>
        <Box
        position={"fixed"}
        bottom={'5vh'}
        right={'3vw'}
        width={'62vw'}
        display={'flex'}
        alignContent={'center'}
        >
          <Box
          width={'80%'}
          >
            <TextField
            id="outlined-textarea"
            placeholder="Hey"
            multiline
            fullWidth
            label="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            >
            </TextField>
          </Box>
            <Button
            variant="contained"
            onClick={sendMessage}
            disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </Button>
        </Box>

    </Box>
    
  );
}
