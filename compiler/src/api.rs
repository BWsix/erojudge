use std::{fs, io::Write, path::PathBuf, process::Child, thread, time::Duration};
use wait_timeout::ChildExt;

pub enum ExecutionResult {
    CompileTimeError(String),
    RuntimeError((usize, String)),
    TimeoutError((usize, String)),
    WrongAnswer((usize, String)),
    Success,
}

#[derive(serde::Deserialize)]
pub struct Testcase {
    pub timeout: u64,
    pub input: String,
    pub output: String,
    pub hide_output: Option<bool>,
}

#[derive(serde::Deserialize)]
pub struct Submission {
    pub code: String,
    pub language: String,
    pub testcases: Vec<Testcase>,
}

pub trait Compiler {
    fn build(
        &self,
        user_upload_path: &PathBuf,
        built_program_path: &PathBuf,
    ) -> Result<Option<ExecutionResult>, Box<dyn std::error::Error>>;
    fn get_process(
        &self,
        built_program_path: &PathBuf,
    ) -> Result<Child, Box<dyn std::error::Error>>;
    fn test(
        &self,
        language: &str,
        code: &str,
        testcases: &Vec<Testcase>,
    ) -> Result<ExecutionResult, Box<dyn std::error::Error>> {
        let tmp_dir = tempfile::tempdir()?;

        let user_upload_path = tmp_dir.path().join(format!("userupload.{}", language));
        fs::write(&user_upload_path, code)?;

        let built_program_path = tmp_dir.path().join("userupload");
        if let Some(error) = self.build(&user_upload_path, &built_program_path)? {
            return Ok(error);
        }

        for (id, testcase) in testcases.iter().enumerate() {
            let mut user_program = self.get_process(&built_program_path)?;

            let mut stdin = user_program.stdin.take().unwrap();
            let input = testcase.input.to_owned();
            thread::spawn(move || {
                stdin.write_all(input.as_bytes()).unwrap();
            });

            match user_program.wait_timeout(Duration::from_millis(testcase.timeout))? {
                Some(_) => {
                    let user_program_status = user_program.wait_with_output()?;

                    if !user_program_status.status.success() {
                        let stderr = String::from_utf8_lossy(&user_program_status.stderr);
                        let error_message =
                            format!("Input:\n{}\n\nError message:\n{}", testcase.input, stderr);
                        return Ok(ExecutionResult::RuntimeError((id, error_message)));
                    }

                    let stdout = String::from_utf8_lossy(&user_program_status.stdout);
                    if stdout.trim() == testcase.output.trim() {
                        continue;
                    }
                    let error_message = if testcase.hide_output.is_some() {
                        format!("Your program failed on a hidden testcase, how unlucky!")
                    } else {
                        format!("Input:\n{}\n\nOutput:\n{}", testcase.input, stdout)
                    };
                    return Ok(ExecutionResult::WrongAnswer((id, error_message)));
                }
                None => {
                    let error_message = format!("Time limit: {}ms", testcase.timeout);
                    return Ok(ExecutionResult::TimeoutError((id, error_message)));
                }
            };
        }

        Ok(ExecutionResult::Success)
    }
}
