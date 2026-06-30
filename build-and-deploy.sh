#!/bin/sh
# Set Node version
# export NVM_DIR=$HOME/.nvm;
# source $NVM_DIR/nvm.sh;
# nvm use --lts # Use latest Node.js version

# Data pipeline updates
# node inputs/fec/fetch.js
# node inputs/coverage/fetch.js

# node process/legislative-candidates.js
# node process/main.js

# Build
# node ./inputs/processGeneralResults.mjs
node ./inputs/processData.js

npm run build

# Deploy
aws s3 sync build s3://projects.wyofile.com/election-guide-2026 --profile wyofile --delete
# aws s3 cp src/data/candidate-data.json s3://projects.wyofile.com/data/election-guide-2026/candidate-data.json --profile wyofile
aws cloudfront create-invalidation --profile wyofile --distribution-id E1LSUP0GLMODKL --paths "/election-guide-2026/*"