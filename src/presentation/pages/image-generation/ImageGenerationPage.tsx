import { useState } from 'react';
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
  GptMessageImage,
} from '../../components';
import { imageGenerationUseCase } from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  };
}

export const ImageGenerationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages([...messages, { text, isGpt: false }]);

    const imageInfo = await imageGenerationUseCase(text);

    setIsLoading(false);

    if (!imageInfo) {
      return setMessages([
        ...messages,
        { text: 'Error al generar la imagen', isGpt: true },
      ]);
    }

    setMessages((prev) => [
      ...prev,
      {
        text,
        isGpt: true,
        info: {
          imageUrl: imageInfo.url,
          alt: imageInfo.alt,
        },
      },
    ]);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <GptMessage text="Hola, que imagen deseas generar hoy?" />
          {messages.map((message, index) =>
            message.isGpt ? (
              <GptMessageImage
                key={index}
                text={message.text}
                imageUrl={message.info?.imageUrl!}
                alt={message.info?.alt!}
              />
            ) : (
              <MyMessage key={index} text={message.text} />
            ),
          )}

          {isLoading && (
            <div className="col-start-1 col-end-12 flex justify-center">
              <TypingLoader />
            </div>
          )}
        </div>
      </div>

      <TextMessageBox
        onSendMessage={handlePost}
        placeholder="Escribe tu texto aquí"
        disableCorrections
      />
    </div>
  );
};
