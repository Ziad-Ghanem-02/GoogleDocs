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

const AddDocEditors = ({
  doc,
  children,
}: {
  doc: DocType
  children: ReactNode
}) => {
  const [editorUsername, setEditorUsername] = useState(doc.title)
  const queryClient = useQueryClient()

  // Add Editor
  const { mutate: addEditorMutate, isPending: addEditorIsPending } =
    useMutation({
      mutationKey: ['AddDocEditors', doc],
      mutationFn: async () => {
        const response = await axio.put(`/docs/addEditor/${doc.title}`, {
          editor: editorUsername,
        })
        if (response.status === 200) {
          return response.data
        }
        throw new Error(response.data || 'Error renaming document')
      },
      onSuccess: () => {
        toast({
          title: 'Success!',
          description: 'Editor Added!',
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
      editor: '',
    },
  })

  async function onSubmit(data: { editor: string }) {
    setEditorUsername(data.editor)
    addEditorMutate()
  }

  return (
    <>
      <Dialog>
        <DialogTrigger
          asChild
          className=' disabled:opacity-50'
          disabled={addEditorIsPending}
          onSelect={(e) => e.preventDefault()}
        >
          {children}
        </DialogTrigger>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Add Editor</DialogTitle>
            <DialogDescription>Add Editor to the document.</DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='editor'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Editor's Username</FormLabel>
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
                  disabled={addEditorIsPending}
                >
                  <Plus className='mr-2 h-4 w-4' />
                  <span>Add Editor</span>
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AddDocEditors
