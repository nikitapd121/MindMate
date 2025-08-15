const { validationResult } = require('express-validator');
const axios = require('axios');

// ====== Helper Functions ======
function detectLanguage(code) {
  const firstLine = code.split('\n')[0].toLowerCase();
  if (firstLine.includes('python')) return 'python';
  if (firstLine.includes('java')) return 'java';
  if (firstLine.includes('c++')) return 'cpp';
  if (firstLine.includes('<?php')) return 'php';
  if (firstLine.includes('using ')) return 'csharp';
  if (firstLine.includes('func ') || firstLine.includes('package ')) return 'go';
  if (firstLine.includes('def ')) return 'ruby';
  if (firstLine.includes('import ') && firstLine.includes('swift')) return 'swift';
  return 'javascript';
}

function analyzeCode(code, language, output) {
  const issues = [];
  const suggestions = [];
  const warnings = [];

  if (code.length > 500) suggestions.push("Code is too long - consider splitting into functions");

  switch (language) {
    case 'javascript':
      if (code.includes('eval(')) issues.push("Avoid eval() - security risk");
      if (code.includes('==')) suggestions.push("Use '===' instead of '=='");
      break;
    case 'python':
      if (code.includes('import *')) warnings.push("Avoid wildcard imports");
      if (!code.includes('if __name__ == "__main__":')) suggestions.push("Add main guard for scripts");
      break;
    case 'java':
      if (!code.includes('public static void main')) warnings.push("Most Java files need a main method");
      break;
    case 'cpp':
      if (code.includes('using namespace std;')) warnings.push("Avoid 'using namespace std' in headers");
      break;
    case 'php':
      if (!code.includes('declare(strict_types=1);')) suggestions.push("Enable strict types for better type safety");
      break;
    case 'go':
      if (!code.includes('func main')) warnings.push("Most Go programs need a main function");
      break;
  }

  return {
    issues: issues.length ? issues : ["No critical issues found"],
    suggestions: suggestions.length ? suggestions : ["Code looks clean!"],
    warnings: warnings.length ? warnings : [],
    ollamaOutput: output || ""
  };
}

const getUserAndResponses = (req) => {
  return {
    user: req.session.user || { name: 'MindMate User' },
    responses: req.session.responses || []
  };
};

// ====== Page Render Controllers ======
exports.dashboard = (req, res) => {
  const { user, responses } = getUserAndResponses(req);
  res.render('member/dashboard', { pageTitle: 'Dashboard', user, responses });
};

exports.dsa = (req, res) => {
  const { user, responses } = getUserAndResponses(req);
  res.render('member/dsa', { pageTitle: 'DSA', user, responses });
};

exports.debug = (req, res) => {
  const { user, responses } = getUserAndResponses(req);
  res.render('member/debug', { pageTitle: 'Debug', user, responses });
};

exports.decision = (req, res) => {
  const { user, responses } = getUserAndResponses(req);
  res.render('member/decision', { pageTitle: 'Decision', user, responses });
};

exports.mvp = (req, res) => {
  const { user, responses } = getUserAndResponses(req);
  res.render('member/mvp', { pageTitle: 'MVP', user, responses });
};

// ====== Debug API using Ollama ======
exports.debugCode = async (req, res) => {
  try {
    // Health check
    await axios.get(`${process.env.OLLAMA_API_URL}`, { timeout: 5000 });
    
    const response = await axios.post(
      `${process.env.OLLAMA_API_URL}/api/generate`,
      {
        model: 'phi3:instruct',
        prompt: `Briefly analyze this code...`,
        stream: false,
        options: {
          num_ctx: 512,
          temperature: 0.3
        }
      },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 120000
      }
    );

    res.json({
      analysis: response.data.response,
      model: 'phi3:instruct'
    });
    
  } catch (err) {
    res.status(500).json({
      error: err.message,
      suggestion: "Try with smaller code or different model"
    });
  }
};
// ====== Logout ======
exports.logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Logout error:", err);
      return res.status(500).send("Failed to log out");
    }
    res.redirect('/');
  });
};
