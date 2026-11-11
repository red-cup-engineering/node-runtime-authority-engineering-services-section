import assert from "node:assert/strict";
import test from "node:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { assayNodePackageAuthority } from "@red-cup-engineering/node-package-authority-assay-service";

test("PACKAGE-AUTHORITY-QUICKSTART", async t => {
  const root = await mkdtemp(join(tmpdir(), "package-authority-example-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  const child = join(root, "services", "widget");
  await mkdir(child, { recursive: true });
  await writeFile(join(child, "package.json"), '{"name":"widget","version":"1.0.0"}');
  await writeFile(join(child, "package-lock.json"), '{"lockfileVersion":3}');
  const report = await assayNodePackageAuthority(root);
  assert.deepEqual(report.authorityCounts, { npm: 1 });
  assert.deepEqual(report.conflicts, []);
});
