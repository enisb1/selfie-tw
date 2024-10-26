## The following is an explanation of how to deploy the website:

ssh to unibo student machine\
go to /home/web/site232418/selfie-tw\
go to branch 'deploy'\
run 'git pull' to get latest version

cd to client-side\
npm install to install node_modules\
npm run build to create 'dist' build folder\
cd ..

cd to server-side\
npm install to install node_modules\
cd ..

ssh gocker to connect to docker\
start mongo site232418 selfie-tw/server-side/server-deploy.js to start server on 'site232418.tw.cs.unibo.it'\
wait 2 minutes and then check website