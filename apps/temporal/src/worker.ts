import { NativeConnection, Worker } from "@temporalio/worker";
import { taskQueueOrderFlow } from "./constants";

async function run() {
  const connection = await NativeConnection.connect({
    address: "temporal:7233",
    // TLS and gRPC metadata configuration goes here.
  });

  const worker = await Worker.create({
    connection,
    taskQueue: taskQueueOrderFlow,
    // Workflows are registered using a path as they run in a separate JS context.
    workflowsPath: require.resolve("./workflows/order"),
  });

  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
