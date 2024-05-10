import useSession from '@/hooks/useSession'
import { DocType } from '@/types/types'
import { useNavigate } from 'react-router-dom'
import AddDocEditors from '../DocSettings/AddDocEditors'
import { Info, Plus } from 'lucide-react'
import { Button } from '../ui/button'
import DocOverview from '../DocSettings/DocOverview'
import { isEditor, isOwner } from '@/lib/permissions'

{
  /* TODO: Document Settings: Add editors, viewers. Rename & Delete document */
}

const DocSettingsBar = ({ doc }: { doc: DocType }) => {
  const { user, status } = useSession()
  const navigate = useNavigate()
  if (status === 'unauthenticated') {
    navigate('/')
  }

  return (
    <>
      {isOwner(doc, user?.username) && (
        <>
          <AddDocEditors doc={doc}>
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              <span>Add Editor</span>
            </Button>
          </AddDocEditors>
        </>
      )}
      {isEditor(doc, user?.username) && (
        <>
          <AddDocEditors doc={doc}>
            <Button>
              <Plus className='mr-2 h-4 w-4' />
              <span>Add Viewer</span>
            </Button>
          </AddDocEditors>
          {/* <RenameDoc doc={doc} /> */}
        </>
      )}
      <DocOverview doc={doc}>
        <Button>
          <Info className='mr-2 h-4 w-4' />
          <span>Overview</span>
        </Button>
      </DocOverview>
    </>
  )
}

export default DocSettingsBar
