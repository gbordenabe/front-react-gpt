import { useState } from 'react';
import {
  GptMessage,
  MyMessage,
  TypingLoader,
  TextMessageBox,
  GptMessageImage,
  GptMessageSelectableImage,
} from '../../components';
import {
  imageGenerationUseCase,
  imageVariationUseCase,
} from '../../../core/use-cases';

interface Message {
  text: string;
  isGpt: boolean;
  info?: {
    imageUrl: string;
    alt: string;
  };
}

export const ImageTunningPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      isGpt: true,
      text: 'Imagen base',
      info: {
        imageUrl:
          'http://localhost:3000/gpt/image-generation/1709564309265.png',
        alt: 'Imagen base',
      },
    },
  ]);
  const [originalImageAndMask, setOriginalImageAndMask] = useState({
    original: undefined as string | undefined,
    mask: undefined as string | undefined,
  });

  const handleVariation = async () => {
    setIsLoading(true);
    const resp = await imageVariationUseCase(originalImageAndMask.original!);
    setIsLoading(false);
    if (!resp) {
      return setMessages([
        ...messages,
        { text: 'Error al generar la variacion', isGpt: true },
      ]);
    }
    setMessages((prev) => [
      ...prev,
      {
        text: 'Variacion generada',
        isGpt: true,
        info: {
          imageUrl: resp.url,
          alt: resp.alt,
        },
      },
    ]);
  };

  const handlePost = async (text: string) => {
    setIsLoading(true);
    setMessages([...messages, { text, isGpt: false }]);

    const { original, mask } = originalImageAndMask;

    const imageInfo = await imageGenerationUseCase(text, original, mask);

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
    <>
      {originalImageAndMask.original && (
        <div className="fixed flex flex-col items-center top-10 right-10 z-10 fade-in">
          <span>Editando</span>
          <img
            className="border rounded-xl w-36 h-36 object-contain"
            src={
              originalImageAndMask.mask
                ? originalImageAndMask.mask
                : originalImageAndMask.original
            }
            alt="Imagen Original"
          />
          <button onClick={handleVariation} className="btn-primary mt-2">
            Generar variacion
          </button>
        </div>
      )}
      <div className="chat-container">
        <div className="chat-messages">
          <div className="grid grid-cols-12 gap-y-2">
            <GptMessage text="Hola, que imagen deseas generar hoy?" />
            {messages.map((message, index) =>
              message.isGpt ? (
                <GptMessageSelectableImage
                  key={index}
                  text={message.text}
                  imageUrl={message.info?.imageUrl!}
                  alt={message.info?.alt!}
                  onImageSelected={(maskImageUrl) =>
                    setOriginalImageAndMask({
                      original: message.info?.imageUrl,
                      mask: maskImageUrl,
                    })
                  }
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
    </>
  );
};
