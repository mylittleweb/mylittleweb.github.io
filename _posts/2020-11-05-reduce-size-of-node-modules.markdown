---
layout: post
title:  "Reduce Size Of node_modules"
date:   2020-11-05 23:20:04 -0400
categories: npm
---

**npm install --no-optional**

Prevent optional dependencies from being installed.

**npm prune --production**

Remove packages specified in `devDependencies`, such as linter, type definition, test dependency, etc, after build.

**node-prune: [https://github.com/tj/node-prune](https://github.com/tj/node-prune)**

Remove unnecessary files from `./node_modules` such as markdown, typescript source files and so on.
