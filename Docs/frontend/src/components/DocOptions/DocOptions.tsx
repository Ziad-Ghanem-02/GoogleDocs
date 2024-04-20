import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Button } from '../ui/button'
import { Ellipsis, ExternalLink, FileX } from 'lucide-react'
import { DocType } from '@/types/types'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axio from '@/lib/axios'
import useSession from '@/hooks/useSession'
import RenameDoc from './RenameDoc'

const DocOptions = ({ doc }: { doc: DocType }) => {
  const session = useSession()
  const queryClient = useQueryClient()

  const { mutate: deleteMutate, isPending: deleteIsPending } = useMutation({
    mutationKey: ['deleteDoc', doc],
    mutationFn: async () => {
      const response = await axio.delete(`/docs/delete/${doc.title}`)
      queryClient.invalidateQueries({ queryKey: ['docs'] })
      return response.data
    },
  })
  return (
    <>
      {session.status === 'authenticated' && (
        <>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='rounded-full' size={'icon'}>
                <Ellipsis size={16} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className='w-56'
              onClick={(e) => {
                e.stopPropagation()
                e.nativeEvent.stopImmediatePropagation()
              }}
            >
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* Rename, delete, Open in a new tab */}
              <DropdownMenuGroup>
                <RenameDoc doc={doc} />
                <DropdownMenuItem
                  className='disabled:cursor-not-allowed disabled:opacity-50'
                  onClick={() => deleteMutate()}
                  disabled={deleteIsPending}
                >
                  <FileX className='mr-2 h-4 w-4' />
                  <span>Delete</span>
                </DropdownMenuItem>
                <Link to={`/doc/${doc.id}`} target='_blank'>
                  <DropdownMenuItem>
                    <ExternalLink className='mr-2 h-4 w-4' />
                    <span>Open in new Tab</span>
                  </DropdownMenuItem>
                </Link>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
    </>
  )
}

export default DocOptions
