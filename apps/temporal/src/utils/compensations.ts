import { ICompensation } from "../types";

export async function compensate(compensations: ICompensation[] = []) {
  if (compensations.length > 0) {
    console.log("failures encountered during account opening - compensating");
    for (const comp of compensations) {
      try {
        console.log(comp.message);
        await comp.fn();
      } catch (err) {
        console.log(`failed to compensate`);
        // swallow errors
      }
    }
  }
}
