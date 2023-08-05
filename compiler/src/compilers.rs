use crate::api;
use std::{
    fs,
    process::{Command, Stdio},
};

pub struct Cpp {}
impl api::Compiler for Cpp {
    fn build(
        &self,
        user_upload_path: &std::path::PathBuf,
        built_program_path: &std::path::PathBuf,
    ) -> Result<Option<api::ExecutionResult>, Box<dyn std::error::Error>> {
        let build_status = Command::new("g++")
            .arg(&user_upload_path)
            .arg("-std=c++17")
            .arg("-o")
            .arg(&built_program_path)
            .output()?;
        if !build_status.status.success() {
            let error_message = String::from_utf8(build_status.stderr)?;
            return Ok(Some(api::ExecutionResult::CompileTimeError(error_message)));
        } else {
            Ok(None)
        }
    }
    fn get_process(
        &self,
        built_program_path: &std::path::PathBuf,
    ) -> Result<std::process::Child, Box<dyn std::error::Error>> {
        Ok(Command::new(built_program_path)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()?)
    }
}

pub struct C {}
impl api::Compiler for C {
    fn build(
        &self,
        user_upload_path: &std::path::PathBuf,
        built_program_path: &std::path::PathBuf,
    ) -> Result<Option<api::ExecutionResult>, Box<dyn std::error::Error>> {
        let build_status = Command::new("gcc")
            .arg(&user_upload_path)
            .arg("-std=c11")
            .arg("-o")
            .arg(&built_program_path)
            .output()?;
        if !build_status.status.success() {
            let error_message = String::from_utf8(build_status.stderr)?;
            return Ok(Some(api::ExecutionResult::CompileTimeError(error_message)));
        } else {
            Ok(None)
        }
    }
    fn get_process(
        &self,
        built_program_path: &std::path::PathBuf,
    ) -> Result<std::process::Child, Box<dyn std::error::Error>> {
        Ok(Command::new(built_program_path)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()?)
    }
}

pub struct Python {}
impl api::Compiler for Python {
    fn build(
        &self,
        user_upload_path: &std::path::PathBuf,
        built_program_path: &std::path::PathBuf,
    ) -> Result<Option<api::ExecutionResult>, Box<dyn std::error::Error>> {
        let content = fs::read_to_string(user_upload_path)?;
        fs::write(built_program_path, content)?;
        Ok(None)
    }
    fn get_process(
        &self,
        built_program_path: &std::path::PathBuf,
    ) -> Result<std::process::Child, Box<dyn std::error::Error>> {
        Ok(Command::new("python3")
            .arg(built_program_path)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()?)
    }
}

pub struct BrainFuck {}
impl api::Compiler for BrainFuck {
    fn build(
        &self,
        user_upload_path: &std::path::PathBuf,
        built_program_path: &std::path::PathBuf,
    ) -> Result<Option<api::ExecutionResult>, Box<dyn std::error::Error>> {
        let content = fs::read_to_string(user_upload_path)?;
        fs::write(built_program_path, content)?;
        Ok(None)
    }
    fn get_process(
        &self,
        built_program_path: &std::path::PathBuf,
    ) -> Result<std::process::Child, Box<dyn std::error::Error>> {
        let content = fs::read_to_string(built_program_path)?;
        let compiler_location = std::env::var("BRAINFUCK_COMPILER_LOCATION")
            .unwrap_or_else(|_| "./target/debug/brainfuck".into());

        Ok(Command::new(compiler_location)
            .arg(content)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .stderr(Stdio::piped())
            .spawn()?)
    }
}
