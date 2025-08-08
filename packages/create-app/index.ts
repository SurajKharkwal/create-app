import { promptUser } from "./src/promptUser";

async function main() {
  const data = await promptUser();
  console.log(data);
}

main().catch((err) => console.log(err));
