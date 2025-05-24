import { useLiveQueryProvider } from '@/hooks/LiveQueryProvider'
import { Database } from 'lucide-react'
import { lazy, useRef } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'

const Editor = lazy(() =>
  import('@monaco-editor/react').then((mod) => ({ default: mod.Editor }))
)
export default function SqlQueryView() {
  const { queryObj, queryResult, setQueryObj } = useLiveQueryProvider()

  const queryStatus = queryResult.status
  const editorRef = useRef<typeof Editor | null>(null)

  function handleEditorDidMount(editor: typeof Editor) {
    editorRef.current = editor
  }

  async function executeQuery() {
    // @ts-ignore
    const query = editorRef.current!.getValue() as any as string

    setQueryObj((e) => ({ ...e, query }))
  }

  const defaultValue = `-- Start writing some SQL queries, like SELECT * FROM patients LIMIT 10`

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="flex-none">
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          SQL Query
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0">
        <div className="flex flex-col flex-1 min-h-0 space-y-4">
          <div className="flex-1 min-h-0 border rounded-md overflow-hidden">
            <Editor
              defaultValue={defaultValue}
              // ref={editorRef}
              height="100%"
              language="sql"
              onMount={handleEditorDidMount}
              value={queryObj.query}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                wordWrap: 'on'
              }}
            />
          </div>
          <Button
            onClick={() => executeQuery()}
            disabled={queryStatus === 'loading'}
            className="w-full flex-none"
          >
            Execute Query
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
