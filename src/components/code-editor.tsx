import MonacoEditor, { OnMount } from "@monaco-editor/react";
import { useRef } from "react";
import prettier from "prettier";
import parser from "prettier/parser-babel";
import "./code-editor.css";

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  const editorRef = useRef<any>();

  const handleEditorDidMount: OnMount = (editor, monacoEditor) => {
    editorRef.current = editor;

    monacoEditor.editor.getModels()[0]?.updateOptions({ tabSize: 2 });
  };

  const onFormatClick = () => {
    try {
      // get current value from editor
      const unformatted = editorRef.current.getValue();

      // format that value
      const formatted = prettier
        .format(unformatted, {
          parser: "babel",
          plugins: [parser],
          useTabs: false,
          semi: true,
          singleQuote: true,
        })
        .replace(/\n$/, "");

      // set the formatted value back in the editor
      editorRef.current.setValue(formatted);
    } catch (err) {
      alert("formatting failed");
    }
  };

  return (
    <div className="editor-wrapper">
      <button
        className="button button-format is-primary is-small"
        onClick={onFormatClick}
      >
        Format
      </button>
      <MonacoEditor
        onChange={() => onChange(editorRef.current.getValue())}
        onMount={handleEditorDidMount}
        value={initialValue}
        theme="vs-dark"
        language="javascript"
        height="100%"
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
