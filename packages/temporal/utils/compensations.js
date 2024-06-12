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
exports.compensate = void 0;
function compensate() {
    return __awaiter(this, arguments, void 0, function* (compensations = []) {
        if (compensations.length > 0) {
            console.log("failures encountered during account opening - compensating");
            for (const comp of compensations) {
                try {
                    console.log(comp.message);
                    yield comp.fn();
                }
                catch (err) {
                    console.log(`failed to compensate`);
                    // swallow errors
                }
            }
        }
    });
}
exports.compensate = compensate;
