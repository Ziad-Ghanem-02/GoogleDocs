import { Plus } from 'lucide-react'
import { Card, CardContent, CardHeader } from './ui/card'

const AddDoc = () => {
  return (
    <>
      <Card
        className='flex h-80 cursor-pointer flex-col justify-between gap-2 rounded-md shadow-md'
        onClick={() => {
          console.log('Add new document')
        }}
      >
        <CardHeader className='flex grow items-center justify-center p-2 pb-0'>
          <Plus size={100} className='stroke-accent' />
        </CardHeader>
        <CardContent className='h-20'>
          <h6 className='text-lg font-semibold'>New Document</h6>
          <p className='text-sm text-muted-foreground'>
            Click here to create a new document
          </p>
        </CardContent>
      </Card>
    </>
  )
}

export default AddDoc
