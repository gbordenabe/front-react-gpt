import { useState } from 'react';
import { GptMessage, MyMessage, TypingLoader, TextMessageBox } from '../../components';
import { prosConsUseCase } from '../../../core/use-cases';


interface Message{
  text: string
  isGpt: boolean
}

export const ProsConsPage = () => {

  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const handlePost = async (text:string) => {
    setIsLoading(true)
    setMessages([...messages, {text, isGpt: false}])

    const {ok, content} = await prosConsUseCase(text)

    setIsLoading(false)
    
    if(!ok) return
    setMessages(prev => [...prev, {text: content, isGpt: true}])
  }


  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='grid grid-cols-12 gap-y-2'>
          <GptMessage text='Hola, puedes escribir tu texto en español, y te ayudo con las correcciones' />
          {
            messages.map((message, index) => (
              message.isGpt 
                ? <GptMessage key={index} text={messages[1].text} />
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
