import { RouterOutputs } from "~/utils/api";

export function Editor(props: {
  code: string;
  setCode: (value: string) => void;
  setLanguage: (value: string) => void;
  onClick: () => void;
}) {
  return (
    <>
      <h3>送出程式碼</h3>
      <textarea
        value={props.code}
        onChange={(e) => props.setCode(e.target.value)}
        style={{ width: "500px" }}
      />
      <br />
      <input
        type="file"
        onChange={(e) =>
          e.target.files
            ?.item(0)
            ?.text()
            .then((content) => {
              props.setCode(content);
            })
        }
      />
      <select onChange={(e) => props.setLanguage(e.target.value)}>
        <option value="cpp">c++ (17)</option>
        <option value="c">c (11)</option>
        <option value="py">python (3.9)</option>
      </select>
      <button onClick={props.onClick}>送出</button>
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
      <p>{problem.data.description}</p>

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
