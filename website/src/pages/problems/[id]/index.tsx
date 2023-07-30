import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { Header } from "~/components/Header";
import { api } from "~/utils/api";

export default function ProblemPage() {
  const router = useRouter();
  const id = parseInt(router.query.id as string);
  const problem = api.problem.getDescription.useQuery(
    { id },
    { enabled: !!id }
  );

  const submit = api.problem.submit.useMutation();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("cpp");

  if (!problem.data) return <>loading</>;
  return (
    <>
      <Head>
        <title>{problem.data.title}</title>
        <meta
          name="description"
          content="EroJudge - An industry-leading online coding platform"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />
        <hr />
        <h3>{problem.data.title}</h3>
        <p>{problem.data.description}</p>

        <div>
          <div style={{ display: "inline-block" }}>
            <p>輸入說明</p>
            <textarea
              readOnly
              value={problem.data.inputSpec}
              style={{ width: "250px" }}
            />
          </div>
          <div style={{ display: "inline-block" }}>
            <p>輸出說明</p>
            <textarea
              readOnly
              value={problem.data.outputSpec}
              style={{ width: "250px" }}
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
                style={{ width: "250px" }}
              />
            </div>
            <div style={{ display: "inline-block" }}>
              <p>範例輸出 #{idx + 1}</p>
              <textarea
                readOnly
                value={testcase.output}
                style={{ width: "250px" }}
              />
            </div>
          </div>
        ))}
        <hr />
        <h3>送出程式碼</h3>
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          style={{ width: "500px" }}
        />
        <br />
        <select onChange={(e) => setLanguage(e.target.value)}>
          <option value="cpp">c++ (17)</option>
          <option value="py">python (3.9)</option>
        </select>
        <button onClick={() => submit.mutate({ id, code, language })}>
          送出
        </button>
        {submit.data && (
          <>
            <hr />
            <h3>送出結果</h3>
            <p>{submit.data.code}</p>
            <textarea
              readOnly
              value={submit.data.message}
              style={{ width: "500px" }}
            />
          </>
        )}
      </main>
    </>
  );
}
