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
exports.orderWorkflow = void 0;
const workflow_1 = require("@temporalio/workflow");
const constants_1 = require("../../constants");
const utils_1 = require("../../utils");
const isOrderQuery = (0, workflow_1.defineQuery)("isOrder");
const exitWFSignal = (0, workflow_1.defineSignal)("exit");
const paymentSignal = (0, workflow_1.defineSignal)("payment");
// Activities Interface from outside worker [order worker]
const { order, revertOrder, notifyOrder, revertNotifyOrder } = (0, workflow_1.proxyActivities)({
    taskQueue: constants_1.taskQueueOrder, // use task queue from order worker
    retry: {
        maximumAttempts: 2,
    },
    startToCloseTimeout: "30s",
    heartbeatTimeout: "10s",
});
// Activities Interface from outside worker [payment worker]
const { payment, revertPayment, notifyPayment, revertNotifyPayment } = (0, workflow_1.proxyActivities)({
    taskQueue: constants_1.taskQueuePayment, // use task queue from payment worker
    retry: {
        maximumAttempts: 2,
    },
    startToCloseTimeout: "30s",
    heartbeatTimeout: "10s",
});
function orderWorkflow(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const compensations = [];
        const exited = new workflow_1.Trigger();
        const triggerPayment = new workflow_1.Trigger();
        try {
            // Flow order step
            let isOrder = false;
            (0, workflow_1.setHandler)(isOrderQuery, () => isOrder);
            yield new Promise((f) => setTimeout(f, 10000));
            isOrder = yield order(data);
            // successfully called, so clear if a failure occurs later
            compensations.unshift({
                message: "reversing order",
                fn: () => revertOrder(data),
            });
            yield notifyOrder(data);
            compensations.unshift({
                message: "reversing order",
                fn: () => revertNotifyOrder(data),
            });
            // Flow payment step
            (0, workflow_1.setHandler)(paymentSignal, (dataP) => __awaiter(this, void 0, void 0, function* () {
                try {
                    yield payment(dataP);
                    // successfully called, so clear if a failure occurs later
                    compensations.unshift({
                        message: "reversing payment",
                        fn: () => revertPayment(dataP),
                    });
                    yield notifyPayment(dataP);
                    // successfully called, so clear if a failure occurs later
                    compensations.unshift({
                        message: "reversing payment",
                        fn: () => revertNotifyPayment(dataP),
                    });
                    triggerPayment.resolve();
                }
                catch (err) {
                    triggerPayment.reject(err);
                }
            }));
            // Flow shipping step
            // TODO
            (0, workflow_1.setHandler)(exitWFSignal, () => {
                exited.resolve();
            });
            yield triggerPayment;
            yield exited;
        }
        catch (err) {
            if ((0, workflow_1.isCancellation)(err)) {
                console.log("Workflow cancelled along with its activity");
            }
            else {
                yield (0, utils_1.compensate)(compensations);
                throw err;
            }
        }
    });
}
exports.orderWorkflow = orderWorkflow;
//# sourceMappingURL=index.js.map