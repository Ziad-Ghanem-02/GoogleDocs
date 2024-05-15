import { DocType } from '@/types/types'
import { ReactNode } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import SectionContainer from '../SectionContainer'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { MinusCircle } from 'lucide-react'
import { toast } from '../ui/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axio from '@/lib/axios'
import { titleText } from '@/lib/utils'
import { isViewer } from '@/lib/permissions'
import useSession from '@/hooks/useSession'
import { useNavigate } from 'react-router-dom'

const DocOverview = ({
  doc,
  children,
}: {
  doc: DocType
  children: ReactNode
}) => {
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationKey: ['removeUserPermissions', doc],
    mutationFn: async ({
      accessType,
      username,
    }: {
      accessType: string
      username: string
    }) => {
      const response = await axio.put(
        `/docs/remove${titleText(accessType)}/${doc.title}`,
        {
          [accessType]: username,
        },
      )
      if (response.status === 200) {
        return response.data
      }
      throw new Error(response.data || 'Error renaming document')
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Viewer Removed.',
      })
      queryClient.invalidateQueries({ queryKey: ['doc'] })
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    },
  })

  const { user, status } = useSession()
  const navigate = useNavigate()
  if (status === 'unauthenticated') {
    navigate('/')
  }

  return (
    <>
      <Dialog>
        <DialogTrigger
          asChild
          className=' disabled:opacity-50'
          onSelect={(e) => e.preventDefault()}
        >
          {children}
        </DialogTrigger>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle className='text-3xl'>Info</DialogTitle>
            <DialogDescription>Document info.</DialogDescription>
          </DialogHeader>
          <SectionContainer variant='wide'>
            {doc.editors.length === 0 && doc.viewers.length === 0 && (
              <div className='flex h-full items-center justify-center p-0 font-semibold'>
                No other users have access to this document.
              </div>
            )}
            {doc.editors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Editors</CardTitle>
                </CardHeader>
                <CardContent>
                  {doc.editors.map((editor) => (
                    <div
                      key={editor}
                      className='flex items-center justify-between py-2'
                    >
                      {editor}
                      {!isViewer(doc, user?.username) && (
                        <Button
                          size={'icon'}
                          disabled={isPending}
                          onClick={() => {
                            mutate({
                              accessType: 'editor',
                              username: editor,
                            })
                          }}
                        >
                          <MinusCircle className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
            {doc.viewers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className='text-lg'>Viewers</CardTitle>
                </CardHeader>
                <CardContent>
                  {doc.viewers.map((viewer) => (
                    <div
                      key={viewer}
                      className='flex items-center justify-between py-2'
                    >
                      {viewer}
                      {!isViewer(doc, user?.username) && (
                        <Button
                          size={'icon'}
                          disabled={isPending}
                          onClick={() => {
                            mutate({
                              accessType: 'viewer',
                              username: viewer,
                            })
                          }}
                        >
                          <MinusCircle className='h-4 w-4' />
                        </Button>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </SectionContainer>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default DocOverview
