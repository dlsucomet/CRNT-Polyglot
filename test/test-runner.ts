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

function ansiEscape(text: string, ...codes: Array<number>) {
  return "\x1b[" + codes.join(";") + "m " + text + " \x1b[0m";
}
const inverted = (text: string) => ansiEscape(text, 7);
const onGreen = (text: string) => ansiEscape(text, 42, 37, 1);
const onRed = (text: string) => ansiEscape(text, 41, 37, 1);

for (let t of tests) {
  let tester = new Tester();
  let testName = t.name;
  process.stdout.write(inverted("TESTING") + " " + testName);

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

  process.stdout.write("\x1b[0G"); // move cursor to the start of the line
  if (allPass && !crashed) {
    process.stdout.write(onGreen("PASS") + " " + testName + `(${score} in ${timeTaken}s)\n`);
  } else {
    process.stdout.write(onRed("FAIL") + " " + testName + ` (${score} in ${timeTaken}s)\n`);
    tester.errors.forEach(err => process.stdout.write("  " + err + "\n"));
    if (crashed) {
      process.stdout.write(" CRASHED after test #" + tester.numTests + "\n");
      stackTrace.forEach(line => process.stdout.write("    " + line + "\n"));
    }
  }
}
