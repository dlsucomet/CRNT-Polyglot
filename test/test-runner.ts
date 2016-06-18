export interface TestFile {
  name: string;
  run(t: Tester);
}

import { Test as ReactionTextConversion } from './reaction-text-conversion'
import { Test as ControlFileGeneration } from './control-file-generation'
import { Test as ErnestFileGeneration } from './ernest-file-generation'
import { Test as CrntoolboxFileGeneration } from './crntoolbox-file-generation'

let tests: Array<TestFile> = [
  new ReactionTextConversion(),
  new ControlFileGeneration(),
  new ErnestFileGeneration(),
  new CrntoolboxFileGeneration(),
];


export class Tester {
  numTests = 0;
  numPass = 0;
  errors: Array<string> = [];

  test(expectation: boolean, description: string = "<no description given>") {
    this.numTests++;
    if (expectation === true) {
      this.numPass++;
    } else {
      this.errors.push(`test #${this.numTests}: ${description}`);
    }
  }
}


declare var process;

for (let t of tests) {
  let tester = new Tester();
  let testName = t.name;
  process.stdout.write("\x1b[7mTESTING\x1b[0m " + testName);

  let crashed = false;
  let stackTrace: Array<string> = null;
  let startTime = new Date().getTime();
  try {
    t.run(tester);
  } catch (e) {
    crashed = true;
    try {
      stackTrace = e.stack.split("\n");
    } catch (_) {
      stackTrace = [e.toString()];
    }
  }
  let endTime = new Date().getTime();

  let allPass = tester.numPass === tester.numTests;
  let score = `${tester.numPass}/${tester.numTests}`;
  let timeTaken = (endTime - startTime) / 1000;
  
  if (allPass && !crashed) {
    process.stdout.write("\x1b[0G\x1b[42;37;1mPASS\x1b[0m " + testName + ` (${score} in ${timeTaken}s)\n`);
  } else {
    process.stdout.write("\x1b[0G\x1b[41;37;1mFAIL\x1b[0m " + testName + ` (${score} in ${timeTaken}s)\n`);
    for (let err of tester.errors) {
      process.stdout.write("  " + err + "\n");
    }
    if (crashed) {
      process.stdout.write(" CRASHED after test #" + tester.numTests + "\n");
      for (let line of stackTrace) {
        process.stdout.write("    " + line + "\n");
      }
    }
  }
}
