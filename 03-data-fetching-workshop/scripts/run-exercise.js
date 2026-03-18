#!/usr/bin/env node

import { readdirSync, existsSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";
import chalk from "chalk";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

// ─────────────────────────────────────────────────────────────────────────────
// Find all exercises across all sessions
// ─────────────────────────────────────────────────────────────────────────────

function findExercises() {
  const exercises = [];
  const entries = readdirSync(rootDir, { withFileTypes: true });

  for (const entry of entries) {
    // Look for session folders (01-*, 02-*, etc.)
    if (entry.isDirectory() && /^\d{2}-/.test(entry.name)) {
      const exercisesDir = join(rootDir, entry.name, "exercises");
      if (existsSync(exercisesDir)) {
        const exerciseEntries = readdirSync(exercisesDir, {
          withFileTypes: true,
        });
        for (const ex of exerciseEntries) {
          if (ex.isDirectory() && /^\d{2}-/.test(ex.name)) {
            const testFile = join(exercisesDir, ex.name, "exercise.test.js");
            if (existsSync(testFile)) {
              const num = ex.name.split("-")[0];
              exercises.push({
                number: num,
                name: ex.name,
                session: entry.name,
                testFile,
                path: join(exercisesDir, ex.name),
              });
            }
          }
        }
      }
    }
  }

  return exercises.sort((a, b) => {
    if (a.session !== b.session) return a.session.localeCompare(b.session);
    return a.number.localeCompare(b.number);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// List available exercises
// ─────────────────────────────────────────────────────────────────────────────

function listExercises(exercises) {
  console.log(chalk.bold("\nAvailable Exercises:\n"));

  let currentSession = "";
  for (const ex of exercises) {
    if (ex.session !== currentSession) {
      currentSession = ex.session;
      console.log(chalk.cyan(`  ${currentSession}/`));
    }
    console.log(
      chalk.white(`    ${chalk.yellow(ex.number)}  ${ex.name.slice(3)}`)
    );
  }

  console.log(chalk.dim("\nUsage: npm run exercise <number>"));
  console.log(chalk.dim("Example: npm run exercise 01\n"));
}

// ─────────────────────────────────────────────────────────────────────────────
// Run an exercise test
// ─────────────────────────────────────────────────────────────────────────────

function runExercise(exercise) {
  console.log(
    chalk.bold(
      `\nRunning: ${chalk.cyan(exercise.session)} → ${chalk.yellow(exercise.name)}\n`
    )
  );

  const vitest = spawn("npx", ["vitest", "run", exercise.testFile], {
    cwd: rootDir,
    stdio: "inherit",
  });

  vitest.on("close", (code) => {
    process.exit(code);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────────────────────────────────────

const exercises = findExercises();
const arg = process.argv[2];

if (!arg) {
  listExercises(exercises);
  process.exit(0);
}

// Find matching exercise
const match = exercises.find((ex) => ex.number === arg.padStart(2, "0"));

if (!match) {
  console.log(chalk.red(`\nExercise "${arg}" not found.\n`));
  listExercises(exercises);
  process.exit(1);
}

runExercise(match);
