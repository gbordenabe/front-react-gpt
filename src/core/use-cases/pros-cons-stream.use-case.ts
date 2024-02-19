
export const prosConsStreamUseCase = async (prompt: string) => {
  try {
    const resp = await fetch(`${import.meta.env.VITE_GPT_API}/pros-cons-discusser-stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt }),
    })
    
    if (!resp.ok) throw new Error('No se pudo realizar la accion')

    const reader = resp.body?.getReader()
    if(!reader) return null

    return reader
  }
  catch (error)
  {
    return null
  }
}