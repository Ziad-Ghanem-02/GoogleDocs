import { DocType } from '@/types/types'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card'

const DocPreview = ({ doc }: { doc: DocType }) => {
  return (
    <>
      <Card className='flex flex-col justify-center gap-2 shadow-md'>
        <CardHeader className='space-y-4'>
          {/* TODO: Make the preview content in the header */}
          <CardTitle className='text-xl font-bold'>{doc.title}</CardTitle>
          <CardDescription>
            <p>{doc.ownerID}</p>
          </CardDescription>
        </CardHeader>
      </Card>
    </>
  )
}

export default DocPreview
