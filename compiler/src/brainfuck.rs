use std::{collections::HashMap, io::Read};

fn loop_parser(code: &String) -> HashMap<usize, usize> {
    let mut map = HashMap::new();
    let mut stack = Vec::<usize>::new();

    for (i, c) in code.chars().enumerate() {
        match c {
            '[' => stack.push(i),
            ']' => {
                if stack.len() == 0 {
                    eprintln!("Syntax error: mismatched closing delimiter `]` at index {i}");
                    std::process::exit(1);
                }
                let left_index = stack.pop().unwrap();
                map.insert(left_index, i);
                map.insert(i, left_index);
            }
            _ => {}
        }
    }

    map
}

fn main() {
    let args = std::env::args().collect::<Vec<_>>();

    let code = args.get(1).expect("Usage: brainfuck [code]");
    let loop_indicies = &loop_parser(code);
    let mut input = String::new();
    std::io::stdin().read_to_string(&mut input).unwrap();
    let mut input = input.trim().chars().into_iter();

    let mut cells: [u8; 30_000] = [0; 30_000];
    let mut pointer = 0;
    let code = code.chars().collect::<Vec<_>>();
    let mut code_index = 0;

    while code_index < code.len() {
        match code[code_index] {
            '>' => pointer += 1,
            '<' => pointer -= 1,
            '+' => match cells[pointer] {
                255 => cells[pointer] = 0,
                _ => cells[pointer] += 1,
            },
            '-' => match cells[pointer] {
                0 => cells[pointer] = 255,
                _ => cells[pointer] -= 1,
            },
            '.' => print!("{}", cells[pointer] as char),
            ',' => cells[pointer] = input.next().unwrap_or_default() as u8,
            '[' if cells[pointer] == 0 => code_index = *loop_indicies.get(&code_index).unwrap(),
            ']' if cells[pointer] != 0 => code_index = *loop_indicies.get(&code_index).unwrap(),
            _ => {}
        };

        code_index += 1;
    }
}
