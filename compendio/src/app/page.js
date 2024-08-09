'use client'

import { Box, Typography, Stack, TextField, Button, Icon} from "@mui/material";
import { useEffect, useState, useRef, classes} from "react";
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';


export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm the Headstarter support assistant. How can I help you today?",
    },
  ]);
  
  const [mode, setMode] = useState('light');
  const [bgOne, setBgOne] = useState("#D9D9D9");
  const [bgTwo, setBgTwo] = useState("#BDC3C7");
  const [bgThree, setBgThree] = useState("#FFFFFF");
  const [bgFour, setBgFour] = useState("#786fa6");
  const [colorOne, setcolorOne] = useState('#111');
  const [glowOne, setglowOne] = useState('0 0 30px 1px #786fa6');
  const [buttonOne, setbuttonOne] = useState('#786fa6');
  const [buttonTwo, setbuttonTwo] = useState('#fff');

  

  const darkMode = () => {
    if (mode === "light") {
      setMode("dark");
      setBgOne("#34495e");
      setBgTwo("#2c3e50");
      setBgThree("#111");
      setBgFour("#1abc9c");
      setcolorOne('#fff');
      setglowOne('0 0 40px 4px #D6A2E8');
      setbuttonOne('#786fa6');
    }
  };

  const lightMode = () => {
    if (mode === "dark") {
      setMode("light");
      setBgOne("#D9D9D9");
      setBgTwo("#BDC3C7");
      setBgThree("#FFFFFF");
      setBgFour("#E67E22");
      setcolorOne('#111');
      setglowOne('0 0 30px 1px #786fa6');
      setbuttonOne('#786fa6');
    }
  };

  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;

    setIsLoading(true);
    setMessage('');
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: '' }
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST', // Use POST method
        headers: {
          'Content-Type': 'application/json' // Set content type
        },
        body: JSON.stringify({
          messages: [
            { role: "user", content: message }
          ]
        }) // Send the messages in the request body
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      let result = '';
      await reader.read().then(function processText({ done, value }) {
        if (done) {
          return result;
        }
        const text = decoder.decode(value || new Int8Array(), { stream: true });
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: lastMessage.content + text
            }
          ];
        });
        return reader.read().then(processText);
      });

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const styles = theme => ({
    multilineInput:
    {
      color:'#fff'
    }

  })


  useEffect(() => {
    document.title = "Compendio";
    scrollToBottom();
  }, [messages]);

  

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
          width={'14vw'}

          backgroundColor={bgOne}
          borderRadius={'2em'}
          top={'2vh'}
          left={'7vw'}
          padding={'1em'}
          display={'flex'}
          alignContent={'center'}
        >
          <Box
          margin={'0 2em'}
          onClick={lightMode}
          >
            <LightModeOutlinedIcon
              sx={{ color:colorOne, transition:'0.5s', '&:hover':{
                transform: 'scale(1.3)'
              } }}
            ></LightModeOutlinedIcon>
          </Box>
          
          <Typography
            sx={{ color: mode === 'light' ? colorOne : colorOne }}
          >|</Typography>

          <Box
          margin={'0 2em'}
          onClick={darkMode}
          >
            <DarkModeOutlinedIcon
              sx={{ color:colorOne, transition:'0.5s', '&:hover':{
                transform: 'scale(1.3)'
              } }}
            ></DarkModeOutlinedIcon>
          </Box>
          
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
          color={colorOne}
          textAlign={'center'}
          fontSize={'2em'}
        >
          Hi, John Doe!
        </Typography>
        <Typography
        color={colorOne}
        textAlign={'center'}
        fontSize={'0.8em'}
        >
          Bio
        </Typography>
        <Box
          width={'100%'}
          height={'35vh'}
          position={'absolute'}
          bottom={'0'}
          left={'0'}
        >
          
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
          spacing={5}
          flexGrow={1}
          overflow={'auto'}
          maxHeight={'100%'}
          disabled={isLoading}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display={'flex'}
              width={'95%'}
              justifyContent={
                message.role === 'assistant' ? 'flex-start' : 'flex-end'
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
        <Box width={'80%'}>
          <TextField
            id="outlined-textarea"
            placeholder="Hey"
            multiline
            fullWidth
            label="Message Compendio"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: colorOne,
                '& fieldset': {
                  borderColor: colorOne,
                },
                '&:hover fieldset': {
                  borderColor: bgFour,
                },
                '&.Mui-focused fieldset': {
                  borderColor: bgFour, 
                },
              },
              '& .MuiInputLabel-root': {
                color: colorOne, 
              },
            }}
            InputProps={{
              sx: {
                color: colorOne,
              },
            }}
            InputLabelProps={{
              sx: {
                color: colorOne, 
              },
            }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          >
          </TextField>
        </Box>
        <Button
          onClick={sendMessage}
          disabled={isLoading}
          sx={{
            backgroundColor: buttonOne, 
            color: 'white',
            '&:hover': {
              backgroundColor: buttonTwo,
              color: 'black'
            },}}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </Button>
      </Box>
    </Box>
  );
}
