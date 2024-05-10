import { DocType } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'
import { toast } from '../ui/use-toast'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'
import { Plus } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useForm } from 'react-hook-form'
import axio from '@/lib/axios'

const AddDocViewers = ({
  doc,
  children,
}: {
  doc: DocType
  children: ReactNode
}) => {
  const [viewerUsername, setViewerUsername] = useState(doc.title)
  const queryClient = useQueryClient()

  // Add Viewer
  const { mutate: addViewerMutate, isPending: addViewerIsPending } =
    useMutation({
      mutationKey: ['AddDocViewers', doc],
      mutationFn: async () => {
        const response = await axio.put(`/docs/addViewer/${doc.title}`, {
          viewer: viewerUsername,
        })
        if (response.status === 200) {
          return response.data
        }
        throw new Error(response.data || 'Error renaming document')
      },
      onSuccess: () => {
        toast({
          title: 'Success!',
          description: 'Viewer Added!',
        })
        queryClient.invalidateQueries({ queryKey: ['docs'] })
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

  const form = useForm({
    defaultValues: {
      viewer: '',
    },
  })

  async function onSubmit(data: { viewer: string }) {
    setViewerUsername(data.viewer)
    addViewerMutate()
  }

  return (
    <>
      <Dialog>
        <DialogTrigger
          asChild
          className=' disabled:opacity-50'
          disabled={addViewerIsPending}
          onSelect={(e) => e.preventDefault()}
        >
          {children}
        </DialogTrigger>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Add Viewer</DialogTitle>
            <DialogDescription>Add Viewer to the document.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='viewer'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Viewer's Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Username'
                        defaultValue={''}
                        autoFocus
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button type='button' variant='secondary'>
                    Close
                  </Button>
                </DialogClose>
                <Button
                  type='submit'
                  className='px-3'
                  disabled={addViewerIsPending}
                >
                  <Plus className='mr-2 h-4 w-4' />
                  <span>Add Viewer</span>
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddDocViewers
