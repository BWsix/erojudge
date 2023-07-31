import { cpp } from "@codemirror/lang-cpp";
import { python } from "@codemirror/lang-python";
import { vim } from "@replit/codemirror-vim";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import CodeMirror from "@uiw/react-codemirror";
import { useState } from "react";
import { type RouterOutputs } from "~/utils/api";

export function Editor(props: {
  code: string;
  setCode: (value: string) => void;
  language: string;
  readOnly?: boolean;
}) {
  const [useDark, setUseDark] = useState(true);
  const [useVim, setUseVim] = useState(true);

  let language = cpp();
  if (props.language === "c") language = cpp();
  if (props.language === "cpp") language = cpp();
  if (props.language === "py") language = python();
  const theme = useDark ? githubDark : githubLight;
  const extensions = [language, vim({ status: true })];
  if (!useVim) extensions.pop(); // need to pop vim this way to satisfy typing

  return (
    <>
      <input
        type="checkbox"
        checked={useVim}
        onChange={(e) => setUseVim(e.target.checked)}
      />
      <label>vim</label>

      <input
        type="checkbox"
        checked={useDark}
        onChange={(e) => setUseDark(e.target.checked)}
      />
      <label>dark theme</label>

      <CodeMirror
        value={props.code}
        onChange={(value) => props.setCode(value)}
        theme={theme}
        extensions={extensions}
        readOnly={props.readOnly}
        contentEditable={props.readOnly}
      />
    </>
  );
}

export function ProblemDescription(problem: {
  data: RouterOutputs["problem"]["getDescription"];
}) {
  if (!problem.data) return <>loading</>;
  return (
    <>
      <h3>{problem.data.title}</h3>
      <p>
        {problem.data.description.split("\n").map((line) => (
          <>
            {line}
            <br />
          </>
        ))}
      </p>

      <div>
        <div style={{ display: "inline-block" }}>
          <p>輸入說明</p>
          <textarea
            readOnly
            value={problem.data.inputSpec}
            style={{ width: "350px" }}
          />
        </div>
        <div style={{ display: "inline-block" }}>
          <p>輸出說明</p>
          <textarea
            readOnly
            value={problem.data.outputSpec}
            style={{ width: "350px" }}
          />
        </div>
      </div>

      {problem.data.testcases.map((testcase, idx) => (
        <div key={idx}>
          <div style={{ display: "inline-block" }}>
            <p>範例輸入 #{idx + 1}</p>
            <textarea
              readOnly
              value={testcase.input}
              style={{ width: "350px" }}
            />
          </div>
          <div style={{ display: "inline-block" }}>
            <p>範例輸出 #{idx + 1}</p>
            <textarea
              readOnly
              value={testcase.output}
              style={{ width: "350px" }}
            />
          </div>
        </div>
      ))}
    </>
  );
}
