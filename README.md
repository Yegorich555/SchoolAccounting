# SchoolAccounting

## Info

This is frontend project based on Webpack and React  
React version: 16.8.6  
Webpack version: 4.35  

## How to run project

1. Open project in VSCode (for example)
2. Run command ```npm i``` in terminal (console) for installing all required packages (Node.js is required: https://nodejs.org/en/)
3. For builing project you can use the following commands:
	- ```npm run build``` or ```npm run build-prod``` - building production version (minimized and optimized). The project will be builded into ```build``` folder. You can change destination in ```webpack.common.js (line 19: const destPath = path.resolve(__dirname, "./build/");)```  
	- ```npm run build-dev``` - building development version
	- ```npm run serve``` - building development hot-reloaded version with webpack-dev-server (the basic command for development)

Basic configuration mentioned here (coming soon): https://github.com/Yegorich555/FromScratch_React 
