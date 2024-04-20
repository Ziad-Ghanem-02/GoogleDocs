import DocPreview from '@/components/DocPreview'
import SectionContainer from '@/components/SectionContainer'
import { Separator } from '@/components/ui/separator'
import useSession from '@/hooks/useSession'
import axio from '@/lib/axios'
import { DocType } from '@/types/types'
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

const Dashboard = () => {
  const session = useSession()
  const navigate = useNavigate()
  console.log('session', session.status)
  if (session.status === 'unauthenticated') {
    navigate('/')
  }

  const {
    data: docs,
    isError,
    isLoading,
  } = useQuery<DocType[]>({
    queryKey: ['docs', session],
    queryFn: async () => {
      const response = await axio.get(
        `/docs/getUsersDoc/${session.user?.username}`,
      )
      console.log('response', response.data)
      return response.data
    },
  })

  return (
    <>
      <SectionContainer>
        <h1 className='my-5 text-5xl font-bold'>Dashboard</h1>
        <p>This is a preview page for the docs that you have uploaded.</p>
      </SectionContainer>
      <Separator />
      <SectionContainer>
        {isLoading ? (
          <p className='text-bold text-xl'>Loading...</p>
        ) : (
          <>
            {isError ? (
              <p className='text-xl font-bold'>Error fetching docs</p>
            ) : (
              <>
                <div className='grid grid-cols-5 gap-4'>
                  {docs &&
                    docs.map((doc) => (
                      <div key={doc.id}>
                        <DocPreview doc={doc} />
                      </div>
                    ))}
                </div>
              </>
            )}
          </>
        )}
      </SectionContainer>
    </>
  )
}

export default Dashboard
