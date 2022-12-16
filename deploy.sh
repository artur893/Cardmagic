echo "Switching to main branch"
git checkout main

echo "Building app..."
npm run build

echo "Deploying files to server..."
scp -r build/* artur893@167.86.93.240:/var/www/playcardmagic.eu

echo "Done!"