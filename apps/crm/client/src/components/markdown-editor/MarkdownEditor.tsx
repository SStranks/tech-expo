import MDEditor from '@uiw/react-md-editor';
import { useState } from 'react';
import rehypeSanitize from 'rehype-sanitize';

function MarkdownEditor(): JSX.Element {
  const [value, setValue] = useState<string | undefined>('');
  return (
    <MDEditor
      value={value}
      onChange={setValue}
      previewOptions={{
        rehypePlugins: [[rehypeSanitize]],
      }}
    />
  );
}

export default MarkdownEditor;
