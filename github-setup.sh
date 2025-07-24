#!/bin/bash

# Replace this line with your token:
TOKEN="PASTE_YOUR_TOKEN_HERE"

# This will create the repository
curl -H "Authorization: token $TOKEN" https://api.github.com/user/repos -d '{"name":"mosaic-windsurf","private":true,"description":"A modern fitness routine-building application for windsurfers"}'

# After repository is created, we'll connect your local code
git remote add origin "https://$TOKEN@github.com/YOUR_GITHUB_USERNAME/mosaic-windsurf.git"
git push -u origin main
