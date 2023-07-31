import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.problem.deleteMany({ where: {} });
  await prisma.problem.create({
    data: {
      title: "再見，世界",
      description: "請寫一個程式，從stdin讀取一個姓名，並對他說再見。",
      inputSpec: "輸入總共一行，內含一組文字",
      outputSpec: "輸出題目指定的文字。",
      testcases: {
        create: [
          { is_example: true, input: "bob", output: "goodbye, bob" },
          { is_example: false, input: "alice", output: "goodbye, alice" },
        ],
      },
    },
  });

  await prisma.problem.create({
    data: {
      title: "簡易加法",
      description: "請寫一個程式，讀入兩個數字，並求出它們的和。",
      inputSpec:
        "輸入共一行，內含有兩個整數 a, b，以空白隔開，a, b絕對值皆小於10^6。",
      outputSpec: "輸出該兩整數的和。",
      testcases: {
        create: [
          { is_example: true, input: "5 10", output: "15" },
          { is_example: true, input: "1 2", output: "3" },
          { is_example: false, input: "47 22", output: "69" },
          { is_example: false, input: "500 -80", output: "420" },
        ],
      },
    },
  });

  await prisma.problem.create({
    data: {
      title: "困難加法",
      description:
        "請寫一個程式，讀入兩個羅馬數字，並輸出兩數字的和。\n" +
        "參考:\n" +
        "https://leetcode.com/problems/integer-to-roman/\n" +
        "https://leetcode.com/problems/roman-to-integer/\n",
      inputSpec: "輸入總共兩行，每行一個小於2000的羅馬數字。",
      outputSpec: "輸出一行，包含一個羅馬數字。",
      testcases: {
        create: [
          {
            is_example: true,
            input: "LXIX\nCCCLI", // 69 + 351
            output: "CDXX", // 420
          },
          {
            is_example: true,
            input: "DCCCXLV\nCDXCII", // 845 + 492
            output: "MCCCXXXVII", // 1337
          },
          {
            is_example: false,
            input: "CMLXXXVII\nDCCLXXXIX", // 987 + 789
            output: "MDCCLXXVI", // 1776
            hide_output: true,
          },
          {
            is_example: false,
            input: "MCDXCIX\nMCMXCIX", // 1499 + 1999
            output: "MMMCDXCVIII", // 3498
            hide_output: true,
          },
        ],
      },
    },
  });

  await prisma.problem.create({
    data: {
      title: "費氏數列",
      description:
        "求出費氏數列第n項的值\nFib(0) = 0, Fib(1) = 1, Fib(n) = Fib(n - 1) + Fib(n - 2) for n >= 2",
      inputSpec: "輸入共一行，爲一個整數n。(2 <= n <= 35)",
      outputSpec: "輸出Fib(n)",
      testcases: {
        create: [
          { is_example: true, input: "2", output: "1" },
          { is_example: true, input: "3", output: "2" },
          { is_example: true, input: "4", output: "3" },
          { is_example: false, input: "10", output: "55" },
          { is_example: false, input: "20", output: "6765" },
          { is_example: false, input: "35", output: "9227465", timeout: 50 },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
