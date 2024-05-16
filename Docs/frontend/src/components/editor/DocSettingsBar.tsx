import useSession from '@/hooks/useSession'
import { DocType } from '@/types/types'
import { useNavigate } from 'react-router-dom'
import AddDocEditors from '../DocSettings/AddDocEditors'
import { Eye, Info, PenLine } from 'lucide-react'
import { Button } from '../ui/button'
import DocOverview from '../DocSettings/DocOverview'
import { isEditor, isOwner } from '@/lib/permissions'
import AddDocViewers from '../DocSettings/AddDocViewers'

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
              <PenLine className='mr-2 h-4 w-4' />
              <span>Add Editor</span>
            </Button>
          </AddDocEditors>
        </>
      )}
      {(isOwner(doc, user?.username) || isEditor(doc, user?.username)) && (
        <>
          <AddDocViewers doc={doc}>
            <Button>
              <Eye className='mr-2 h-4 w-4' />
              <span>Add Viewer</span>
            </Button>
          </AddDocViewers>
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
