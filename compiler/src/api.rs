use std::{fs, io::Write, path::PathBuf, process::Child, thread, time::Duration};

pub enum ExecutionResult {
    CompileTimeError(String),
    RuntimeError(String),
    TimeoutError(String),
    WrongAnswer(String),
    Success,
}

#[derive(serde::Deserialize)]
pub struct Testcase {
    pub timeout: u32,
    pub input: String,
    pub output: String,
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

            let mut timeout = true;
            for _ in 0..testcase.timeout {
                thread::sleep(Duration::new(0, 1000));

                if let Ok(Some(_)) = user_program.try_wait() {
                    timeout = false;

                    let user_program_status = user_program.wait_with_output()?;
                    let stderr = String::from_utf8_lossy(&user_program_status.stderr);
                    let stdout = String::from_utf8_lossy(&user_program_status.stdout);

                    if !user_program_status.status.success() {
                        let error_message = format!(
                            "RuntimeError(Testcase #{0})\nInput:\n{1}\nError message:\n{2}",
                            id + 1,
                            testcase.input,
                            stderr
                        );
                        return Ok(ExecutionResult::RuntimeError(error_message));
                    }

                    if stdout.trim() == testcase.output.trim() {
                        break;
                    }
                    let error_message = format!(
                        "WrongAnswer(Testcase #{0})\nInput:\n{1}\nOutput:\n{2}",
                        id + 1,
                        testcase.input,
                        stdout
                    );
                    return Ok(ExecutionResult::WrongAnswer(error_message));
                }
            }

            if !timeout {
                continue;
            }

            let error_message = format!(
                "Timeout(Testcase #{0})\nTimelimit: {1}ms",
                id + 1,
                testcase.timeout
            );
            return Ok(ExecutionResult::TimeoutError(error_message));
        }

        Ok(ExecutionResult::Success)
    }
}
