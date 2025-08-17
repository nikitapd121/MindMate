const { validationResult } = require('express-validator');
const axios = require('axios');

function detectLanguage(code){
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

function analyzeCode(code, language, geminiOutput) {
  const issues=[];
  const suggestions=[];
  const warnings=[];
  if(code.length>500)suggestions.push("Code is too long");
  switch(language){
    case 'javascript':
      if(code.includes('eval('))issues.push("Avoideval()-security risk");
      if(code.includes('=='))suggestions.push("Use'==='instead of'=='");
      break;
    case 'python':
      if(code.includes('import*'))warnings.push("Avoid wildcard imports");
      if(!code.includes('if __name__=="__main__":'))suggestions.push("Add main guard for scripts");
      break;
    case 'java':
      if(!code.includes('public static void main'))warnings.push("Most Java files need a main method");
      break;
    case 'cpp':
      if(code.includes('using namespace std;'))warnings.push("Avoid 'using namespace std' in headers");
      break;
    case'php':
      if(!code.includes('declare(strict_types=1);'))suggestions.push("Enable strict types for better type safety");
      break;
    case 'go':
      if(!code.includes('func main'))warnings.push("Most Go programs need a main function");
      break;
  }

  return {
    issues: issues.length ? issues : ["No critical issues found"],
    suggestions: suggestions.length ? suggestions : ["Code looks clean!"],
    warnings: warnings.length ? warnings : [],
    geminiOutput: geminiOutput || ""
  };
}

const getUserAndResponses = (req) => ({
  user: req.session.user || { name: 'MindMate User' },
  responses: req.session.responses || []
});

exports.logout=(req,res)=>{
  req.session.destroy(err=>{
    if (err) {
      console.error("error:", err);
      return res.status(500).send("Failed to log out");
    }
    res.redirect('/');
  });
};

exports.dashboard=(req,res)=>{
  const{user,responses}=getUserAndResponses(req);
  res.render('member/dashboard', 
    { 
      pageTitle:'Dashboard', 
      user: user, 
      responses:NULL });
};

exports.dsa=(req,res)=>{
  const{user,responses}=getUserAndResponses(req);
  res.render('member/dsa', { 
    pageTitle:'DSA', 
    user, 
    responses });
};

exports.debug=(req,res)=>{
  const{user,responses}=getUserAndResponses(req);
  res.render('member/debug', {
    pageTitle: 'Debug', 
    user, 
    responses});
};

exports.decision=(req,res)=>{
  const{user,responses}=getUserAndResponses(req);
  res.render('member/decision', 
    { pageTitle: 'Decision',
       theme: req.session.theme || 'dark', 
       user, 
       responses, 
       result: null });
};

exports.mvp = (req, res) => {
  const { user, responses } = getUserAndResponses(req);
  res.render('member/mvp', { pageTitle: 'MVP', user, responses });
};

// Debug API using Gemini
exports.debugCode = async (req, res) => {
  try {
    const { code, error, language: clientLang } = req.body;
    if (!code) return res.status(400).json({ error: "Code is required" });

    const language = clientLang || detectLanguage(code);

    // Call Gemini API
    const geminiResponse = await axios.post(
      `${process.env.GEMINI_API_URL}/analyze`,
      { code, language, error },
      {
        headers: {
          'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 120000
      }
    );

    const analysisText = geminiResponse.data?.analysis || "No output from Gemini";
    const result = analyzeCode(code, language, analysisText);

    res.json({ ...result, language });

  } catch (err) {
    console.error("Gemini Debug Error:", err.message);
    res.status(500).json({
      error: err.message,
      suggestion: "Try with smaller code or different language",
      issues: ["Failed to analyze code"],
      warnings: [],
      suggestions: [],
      geminiOutput: ""
    });
  }
};
