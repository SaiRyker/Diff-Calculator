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

const stylish = fs.readFileSync(getFixturePath('stylishTemplate.txt'),'utf8');

const plain = fs.readFileSync(getFixturePath('plainTemplate.txt'),'utf8');

const json = fs.readFileSync(getFixturePath('jsonTemplate.txt'),'utf8');

test("genDiff", () => {
    expect(genDiff(getFixturePath("file1.json"), getFixturePath("file2.json"), 'plain')).toBe(plain)
    expect(genDiff(getFixturePath("file1.json"), getFixturePath("file2.json"), 'stylish')).toBe(stylish)
    expect(genDiff(getFixturePath("file1.json"), getFixturePath("file2.json"), 'json')).toBe(json)
})