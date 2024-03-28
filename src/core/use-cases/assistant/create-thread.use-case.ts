export const createThreadUseCase = async () => {
  try {
    const resp = await fetch(
      `${import.meta.env.VITE_ASSISTANT_API}/create-thread`,
      {
        method: 'POST',
      },
    );

    const { threadId } = await resp.json();
    console.log({ threadId });

    return threadId;
  } catch (error) {
    throw new Error('Error creating thread');
  }
};
