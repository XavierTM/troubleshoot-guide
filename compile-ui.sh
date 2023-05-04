

# compile ui
cd ui
npm run build
cd ..

# put static files on backend
rm -rf api/static
mv ui/build api/static