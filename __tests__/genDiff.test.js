import { test, expect } from '@jest/globals';
import genDiff from '../src/genDiff.js'
import * as path from 'node:path'
import * as fs from "fs"
import { fileURLToPath } from 'url';


const __dirname = path.dirname(fileURLToPath(import.meta.url));

const getFixturePath = (fileName) => {
  const fixturePath = path.join(__dirname, '..', '__fixtures__', fileName);
  return fixturePath;
};

const expectedDataStylish = fs.readFileSync(
  getFixturePath('output.txt'),
  'utf8',
);

test("genDiff", () => {
    expect(genDiff(getFixturePath('file1.json'), getFixturePath('file2.json'))).toBe(expectedDataStylish)
    expect(genDiff(getFixturePath('file1.yml'), getFixturePath('file2.yml'))).toBe(expectedDataStylish)
})