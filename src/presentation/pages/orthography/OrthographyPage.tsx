import { useState } from 'react';
import { GptMessage, GptOrthographyMessage, MyMessage, TextMessageBox, TypingLoader } from '../../components';
import { orthographyUseCase } from '../../../core/use-cases';

interface Message{
  text: string
  isGpt: boolean
  info?: {
    userScore: number
    errors: string[]
    message: string
  }
}

export const OrthographyPage = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async (text:string) => {
    setIsLoading(true)
    setMessages([...messages, {text, isGpt: false}])

    const data = await orthographyUseCase(text)
    if(!data.ok){
      setMessages(prev => [...prev, {text: 'No se pudo realizar la correccion', isGpt: true}])
    } else {
      setMessages(prev => [...prev, {text: data.message, isGpt: true, info: {
        userScore: data.userScore,
        errors: data.errors,
        message: data.message
      
      }}])
    }

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
                ? <GptOrthographyMessage key={index}
                    errors = {message.info!.errors}
                    message = {message.info!.message}
                    userScore = {message.info!.userScore}
                />
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
