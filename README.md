# Dynamic Analyses 

<!---
[Wiki](https://github.com/Berkeley-Correctness-Group/DLint/wiki) | [Configuring](https://github.com/Berkeley-Correctness-Group/DLint/wiki/DLint-Developer-Guide#how-to-configure-dlint-checkers) | [Checkers](https://github.com/Berkeley-Correctness-Group/DLint/wiki/DLint-Checkers) | [Develop](https://github.com/Berkeley-Correctness-Group/DLint/wiki/DLint-Developer-Guide) | [Mailing List](https://groups.google.com/forum/#!forum/dlint)
-->


This repository contains dynamic analyses for JavaScript code based on [Jalangi2](https://github.com/Samsung/jalangi2). It mainly consists of analysis from [JITProf](https://github.com/Berkeley-Correctness-Group/JITProf) and [DLint](https://github.com/Berkeley-Correctness-Group/DLint).

What is DLint?
--------------

DLint is a tool for dynamically checking JavaScript coding practices.   

Briefly speaking, [JSHint](http://jshint.com/), [JSLint](http://www.jslint.com/) and [ESLint](http://eslint.org/) uses static analysis (scan the code) to find bad coding practices, while DLint uses dynamic analysis (by analysing runtime behavior) to do the detection. 

By analyzing runtime information, DLint is capable of capturing violations of coding practices missed by those static analysis tools.
(See an [online demo](https://www.eecs.berkeley.edu/~gongliang13/jalangi_ff/demo_integrated.htm) of dynamic analysis.)

For more details, a [Wiki page](https://github.com/Berkeley-Correctness-Group/DLint/wiki) and a [technical report](http://www.eecs.berkeley.edu/Pubs/TechRpts/2015/EECS-2015-5.pdf) is available (to appear in [ISSTA'15](http://issta2015.cs.uoregon.edu/) soon).

What is JITProf?
----------------
JITProf is a tool that tells you which part of your JavaScript code may be slow on JIT-engine. We call those slow code **JIT-unfriendly code**.  
For more details, see this [GitHub repository](https://github.com/Berkeley-Correctness-Group/JITProf) and a [technical report](http://www.eecs.berkeley.edu/Pubs/TechRpts/2014/EECS-2014-144.pdf) is available.


Install DLint
--------------
Copy and Paste the following command in your console to install [Jalangi2](https://github.com/Samsung/jalangi2) and dynamic analyses
```
mkdir dymAnalysis
cd dymAnalysis
git clone https://github.com/Samsung/jalangi2.git
cd jalangi2
npm install
cd ..
git clone https://github.com/JacksonGL/dynamicAnalyses.git
cd jalangi2
rm -rf tmp
mkdir tmp
cd ..
```

### Run DLint in Browser
Under ```jalangi2/tmp``` directory:
```
../../dynamicAnalyses/scripts/dlint.sh
```
This command sets a web proxy, open a web page with your browser (e.g., Chrome or Safari).
Click the ```Jalangi``` button on your web page to view the analysis result.  
To close the web proxy, simply rerun the above command.

### Unit Test for DLint
Under ```dynamicAnalyses``` directory:
```
node tests/dlint/runAllTests.js 
```

### Run JITProf in Browser
Under ```jalangi2/tmp``` directory:
```
../../dynamicAnalyses/scripts/jitprof.sh
```
This command sets a web proxy, open a web page with your browser (e.g., Chrome or Safari).
Click the ```Jalangi``` button on your web page to view the analysis result.  
To close the web proxy, simply rerun the above command.

### Run JITProf on a Single File
Under ```dynamicAnalyses``` directory:
```
node ../jalangi2/src/js/commands/jalangi.js --inlineIID --inlineSource --analysis ../jalangi2/src/js/sample_analyses/ChainedAnalysesNoCheck.js --analysis src/js/analyses/jitprof/utils/Utils.js --analysis src/js/analyses/jitprof/utils/RuntimeDB.js --analysis src/js/analyses/jitprof/TrackHiddenClass.js  --analysis src/js/analyses/jitprof/AccessUndefArrayElem.js --analysis src/js/analyses/jitprof/SwitchArrayType.js tests/jitprof/JITAwareTest
```
