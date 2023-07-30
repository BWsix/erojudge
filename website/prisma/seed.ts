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
          { example: true, input: "bob", output: "goodbye, bob" },
          { example: false, input: "alice", output: "goodbye, alice" },
        ],
      },
    },
  });
  await prisma.problem.create({
    data: {
      title: "簡易加法",
      description: "請寫一個程式，讀入兩個數字，並求出它們的和。",
      inputSpec:
        "每組輸入共一行，內含有兩個整數 a, b，以空白隔開。a, b絕對值皆小於10^6。",
      outputSpec: "對於每組輸入，輸出該兩整數的和。",
      testcases: {
        create: [
          { example: true, input: "34 35", output: "69" },
          { example: true, input: "500 -80", output: "420" },
          { example: false, input: "1 1", output: "2" },
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
