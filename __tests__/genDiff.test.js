import { test, expect } from '@jest/globals';
import genDiff from '../src/genDiff.js'

const template = `{
-follow:false,
host:hexlet.io,
-proxy:123.234.53.22,
-timeout:50,
+timeout:20,
+verbose:true,
}`

test("genDiff", () => {
    expect(genDiff("file1.json", "file2.json")).toBe(template)
    expect(genDiff("file1.yml", "file2.yml")).toBe(template)
    expect(genDiff("file1.yaml", "file2.yaml")).toBe(template)
})