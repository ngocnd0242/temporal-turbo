"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_1 = require("@temporalio/worker");
const constants_1 = require("./constants");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        const connection = yield worker_1.NativeConnection.connect({
            address: "temporal:7233",
            // TLS and gRPC metadata configuration goes here.
        });
        const worker = yield worker_1.Worker.create({
            connection,
            taskQueue: constants_1.taskQueueOrderFlow,
            // Workflows are registered using a path as they run in a separate JS context.
            workflowsPath: require.resolve("./workflows/order"),
        });
        yield worker.run();
    });
}
run().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=worker.js.map