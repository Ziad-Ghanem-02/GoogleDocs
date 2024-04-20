import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader } from './ui/card'
import axio from '@/lib/axios'
import { useMutation } from '@tanstack/react-query'
import { DocType } from '@/types/types'

const AddDoc = () => {
  const { mutate: createDocMutate, isPending: createDocIsPending } =
    useMutation<DocType>({
      mutationKey: ['createDoc'],
      mutationFn: async () => {
        const response = await axio.post(`/docs/create`)
        return response.data
      },
      onSuccess: (data) => {
        console.log('Document Created')
        window.location.href = `/docs/${data.id}`
      },
    })
  return (
    <>
      {/* 
        TODO: Wrap it in a button to be able to disable it 
        once clicked to prevent mutliple creation of documents 
        while processing doc creation request 
      */}
      <button
        className='text-left'
        onClick={() => createDocMutate()}
        disabled={createDocIsPending}
      >
        <Card className='flex h-80 cursor-pointer flex-col justify-between gap-2 rounded-md shadow-md'>
          <CardHeader className='flex grow items-center justify-center p-2 pb-0'>
            <Plus size={100} className='stroke-accent' />
          </CardHeader>
          <CardContent className='h-20'>
            <h6 className='text-lg font-semibold'>New Document</h6>
            <p className='text-sm text-muted-foreground'>
              Click here to createDoc a new document
            </p>
          </CardContent>
        </Card>
      </button>
    </>
  )
}

export default AddDoc
