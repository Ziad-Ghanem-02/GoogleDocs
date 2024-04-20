import { DocType } from '@/types/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
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
import { DropdownMenuItem } from '../ui/dropdown-menu'
import { FilePenLine } from 'lucide-react'
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

const RenameDoc = ({ doc }: { doc: DocType }) => {
  const [newTitle, setNewTitle] = useState(doc.title)
  const queryClient = useQueryClient()
  const { mutate: renameMutate, isPending: renameIsPending } = useMutation({
    mutationKey: ['renameDoc', doc],
    mutationFn: async () => {
      const response = await axio.put(`/docs/rename/${doc.title}`, {
        title: newTitle,
      })
      if (response.status === 200) {
        return response.data
      }
      throw new Error(response.data || 'Error renaming document')
    },
    onSuccess: () => {
      toast({
        title: 'Success!',
        description: 'Document Renamed',
      })
      queryClient.invalidateQueries({ queryKey: ['docs'] })
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
      title: doc.title,
    },
  })

  async function onSubmit(data: { title: string }) {
    setNewTitle(data.title)
    renameMutate()
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <DropdownMenuItem
            className=' disabled:opacity-50'
            disabled={renameIsPending}
            onSelect={(e) => e.preventDefault()}
          >
            <FilePenLine className='mr-2 h-4 w-4' />
            <span>Rename</span>
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>Rename</DialogTitle>
            <DialogDescription>
              Rename the document to a new name.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
              <FormField
                control={form.control}
                name='title'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Title'
                        defaultValue={doc.title}
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
                  disabled={renameIsPending}
                >
                  <FilePenLine className='mr-2 h-4 w-4' />
                  <span>Rename</span>
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default RenameDoc
