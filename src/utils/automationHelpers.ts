import { TOption } from "../routes/automations/Automation";

export function not(a: readonly TOption[], b: readonly TOption[]) {
    return a.filter((value) => b.indexOf(value) === -1);
  }
  
  export function intersection(a: readonly TOption[], b: readonly TOption[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
  }
  
  export function union(a: readonly TOption[], b: readonly TOption[]) {
    return [...a, ...not(b, a)];
  }