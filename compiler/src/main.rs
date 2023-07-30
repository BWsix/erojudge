use actix_web::body::BoxBody;
use actix_web::http::header::ContentType;
use actix_web::{error, web, App, HttpRequest, HttpResponse, HttpServer, Responder};
use serde::Serialize;

mod api;
mod compilers;

#[derive(Serialize)]
struct Response {
    code: String,
    message: String,
}

impl Response {
    fn new(code: &str, message: &str) -> Self {
        Response {
            code: code.to_string(),
            message: message.to_string(),
        }
    }
}

impl Responder for Response {
    type Body = BoxBody;
    fn respond_to(self, _req: &HttpRequest) -> HttpResponse<Self::Body> {
        let body = serde_json::to_string(&self).unwrap();
        HttpResponse::Ok()
            .content_type(ContentType::json())
            .body(body)
    }
}

async fn submit(submission: web::Json<api::Submission>) -> impl Responder {
    use api::ExecutionResult;

    let compiler: &dyn api::Compiler = match submission.language.as_str() {
        "cpp" => &compilers::Cpp{},
        "py" => &compilers::Python{},
        _ => unreachable!(),
    };
    let execution_result = compiler.test(&submission.language, &submission.code, &submission.testcases);
    match execution_result {
        Err(_) => Response::new("System Error", "Something went wrong with our build system."),
        Ok(ExecutionResult::Success) => Response::new("Accepted", "Congrats!"),
        Ok(ExecutionResult::WrongAnswer(msg)) => Response::new("Wrong Answer", &msg),
        Ok(ExecutionResult::RuntimeError(msg)) => Response::new("Runtime Error", &msg),
        Ok(ExecutionResult::TimeoutError(msg)) => Response::new("Timeout Error", &msg),
        Ok(ExecutionResult::CompileTimeError(msg)) => Response::new("Compile Error", &msg),
    }
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    let address = std::env::var("ADDRESS").unwrap_or_else(|_| "127.0.0.1:8080".into());

    HttpServer::new(|| {
        let json_config = web::JsonConfig::default()
            .limit(4096)
            .error_handler(|err, _req| {
                error::InternalError::from_response(err, HttpResponse::Conflict().finish()).into()
            });

        App::new().service(
            web::resource("/submit")
                .app_data(json_config)
                .route(web::post().to(submit)),
        )
    })
    .bind(&address)?
    .run()
    .await
}
