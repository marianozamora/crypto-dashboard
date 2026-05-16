#!/usr/bin/env node
// Routes the Vercel build to either the frontend app or Storybook
// based on which project is being built (detected via VERCEL_PROJECT_ID).
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const STORYBOOK_PROJECT_ID = 'prj_DYv70IHbGciVwciDCE67RvZqXVY9'
const OUTPUT_DIR = path.join(__dirname, '..', 'output')

const isStorybook = process.env['VERCEL_PROJECT_ID'] === STORYBOOK_PROJECT_ID

function run(cmd) {
  execSync(cmd, { stdio: 'inherit', cwd: path.join(__dirname, '..') })
}

// Build shared first (both targets need it)
run('cd shared && npm ci && npm run build')

if (isStorybook) {
  run('cd frontend && npm run storybook:build -- --output-dir ../output')
} else {
  run('cd frontend && npm run build')
  fs.renameSync(path.join(__dirname, '..', 'frontend', 'dist'), OUTPUT_DIR)
}
