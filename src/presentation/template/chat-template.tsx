import { useState } from 'react';
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from '../components';


interface Message{
  text: string
  isGpt: boolean
}

export const ChatTemplate = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async (text:string) => {
    setIsLoading(true)
    setMessages([...messages, {text, isGpt: false}])

    setIsLoading(false)
  }


  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text='Hola, puedes escribir tu texto en español, y te ayudo con las correcciones' />
          {
            messages.map((message, index) => (
              message.isGpt 
                ? <GptMessage key={index} text="Esto es de OpenAI" />
                : <MyMessage key={index} text={message.text} />
            ))
          }

          {
            isLoading && (
              <div className='col-start-1 col-end-12 flex justify-center'>
                <TypingLoader/>
              </div>
            )
          }
        </div>
      </div>

      <TextMessageBox 
        onSendMessage={handlePost}
        placeholder='Escribe tu texto aquí'
        disableCorrections
      />
    </div>
  );
};
