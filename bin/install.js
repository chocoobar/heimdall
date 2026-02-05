#!/usr/bin/env node

/**
 * Heimdall SRE Agent Installer
 * 
 * This script copies Heimdall agent files to the target project's .agent directory.
 * Supports both standalone installation and integration with existing agent frameworks.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const PACKAGE_ROOT = path.resolve(__dirname, '..');
const AGENT_DIR_NAME = '.agent';
const HEIMDALL_DIR_NAME = 'heimdall';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

function log(message, color = colors.reset) {
  if (!process.argv.includes('--silent')) {
    console.log(`${color}${message}${colors.reset}`);
  }
}

function logHeader() {
  log('\n🛡️  Heimdall SRE Agent Installer', colors.cyan + colors.bright);
  log('━'.repeat(40), colors.cyan);
}

function copyRecursive(src, dest) {
  const stats = fs.statSync(src);
  
  if (stats.isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const files = fs.readdirSync(src);
    for (const file of files) {
      // Skip node_modules and git directories
      if (file === 'node_modules' || file === '.git') continue;
      copyRecursive(path.join(src, file), path.join(dest, file));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

function detectProjectRoot() {
  // Start from current working directory and look for project markers
  let dir = process.cwd();
  const markers = ['package.json', 'pom.xml', 'go.mod', 'Cargo.toml', '.git'];
  
  while (dir !== path.parse(dir).root) {
    for (const marker of markers) {
      if (fs.existsSync(path.join(dir, marker))) {
        return dir;
      }
    }
    dir = path.dirname(dir);
  }
  
  // Fallback to current working directory
  return process.cwd();
}

function install() {
  logHeader();
  
  const projectRoot = detectProjectRoot();
  const agentDir = path.join(projectRoot, AGENT_DIR_NAME);
  const heimdallDir = path.join(agentDir, HEIMDALL_DIR_NAME);
  
  log(`\n📁 Project root: ${projectRoot}`, colors.blue);
  log(`📂 Installing to: ${heimdallDir}`, colors.blue);
  
  // Create directories
  if (!fs.existsSync(agentDir)) {
    fs.mkdirSync(agentDir, { recursive: true });
    log('\n✓ Created .agent directory', colors.green);
  }
  
  if (fs.existsSync(heimdallDir)) {
    log('\n⚠️  Heimdall directory already exists. Updating...', colors.yellow);
  }
  
  // Directories to copy
  const dirsToCopy = ['agents', 'sre-knowledge', 'templates', 'workflows'];
  const filesToCopy = ['config.yaml', 'module-help.csv'];
  
  // Copy directories
  for (const dir of dirsToCopy) {
    const src = path.join(PACKAGE_ROOT, dir);
    const dest = path.join(heimdallDir, dir);
    
    if (fs.existsSync(src)) {
      copyRecursive(src, dest);
      log(`✓ Copied ${dir}/`, colors.green);
    }
  }
  
  // Copy files
  for (const file of filesToCopy) {
    const src = path.join(PACKAGE_ROOT, file);
    const dest = path.join(heimdallDir, file);
    
    if (fs.existsSync(src)) {
      // Ensure directory exists
      const destDir = path.dirname(dest);
      if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
      }
      fs.copyFileSync(src, dest);
      log(`✓ Copied ${file}`, colors.green);
    }
  }
  
  // Create activation instructions
  const activationPath = path.join(heimdallDir, 'ACTIVATE.md');
  const activationContent = `# Heimdall SRE Agent

## Quick Start

To activate Heimdall, tell your AI assistant:

\`\`\`
Load and activate the Heimdall agent from .agent/heimdall/agents/heimdall.md
\`\`\`

## Configuration

Edit \`.agent/heimdall/config.yaml\` to customize:
- Your name (user_name)
- Output folder locations
- MCP integration settings
- Prometheus endpoint

## Available Commands

Once activated, Heimdall provides these commands:
- **[TI] Triage Issue** - Analyze JIRA issues and identify root causes
- **[CP] Create Postmortem** - Generate RCA and COE documents
- **[DP] Debug Prometheus** - Validate and optimize PromQL queries
- **[PA] Performance Analysis** - Analyze metrics and recommend optimizations
- **[RC] Runbook Creation** - Create structured SRE runbooks
- **[CI] CI/CD Reliability** - Analyze pipeline health
- **[ST] SLO/SLI Tracking** - Define service level objectives
- **[OH] On-Call Handoff** - Generate handoff documentation
- **[CA] Cost Analysis** - Analyze infrastructure costs

## MCP Integration

For JIRA/Confluence integration, install the Atlassian MCP server:
https://github.com/atlassian/atlassian-mcp-server
`;
  
  fs.writeFileSync(activationPath, activationContent);
  log(`✓ Created ACTIVATE.md`, colors.green);
  
  // Success message
  log('\n' + '━'.repeat(40), colors.cyan);
  log('🎉 Heimdall installed successfully!', colors.green + colors.bright);
  log('\n📖 Next steps:', colors.yellow);
  log(`   1. Edit ${path.relative(projectRoot, path.join(heimdallDir, 'config.yaml'))}`, colors.reset);
  log('   2. Tell your AI: "Activate Heimdall from .agent/heimdall"', colors.reset);
  log('\n🛡️  Guardian of reliability, at your service.\n', colors.cyan);
}

// Run installation
try {
  install();
} catch (error) {
  log(`\n❌ Installation failed: ${error.message}`, colors.red);
  process.exit(1);
}
