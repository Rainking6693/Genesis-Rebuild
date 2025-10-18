#!/bin/bash

# --- CONFIGURATION ---
# 1. This is the confirmed HTTPS URL for your repository.
REMOTE_URL="https://github.com/Rainking6693/Genesis-Rebuild.git"
# 2. Add the main branch name (using 'main' is standard)
MAIN_BRANCH="main"

echo "Starting Git setup and initial push for the repository using HTTPS..."
echo "--------------------------------------------------------------------"

# 1. Initialize a new Git repository in the current directory.
echo "1. Initializing Git repository..."
git init

# 2. Stage all files in the current directory for the initial commit.
echo "2. Staging all files..."
git add .

# 3. Create the first commit.
echo "3. Creating initial commit..."
git commit -m "Initial commit of all genesis-rebuild files"

# 4. Rename the default branch to the desired main branch name (e.g., 'main').
echo "4. Renaming branch to '$MAIN_BRANCH'..."
git branch -M "$MAIN_BRANCH"

# 5. Add the GitHub repository as a remote origin.
echo "5. Linking to remote repository: $REMOTE_URL"
# Note: GitHub automatically URL-encodes spaces (to %20) when you copy the HTTPS link.
git remote add origin "$REMOTE_URL"

# 6. Push the 'main' branch to the remote repository.
# The -u flag sets the upstream tracking branch.
echo "6. Pushing files to GitHub..."

# When prompted, use your GitHub Username and the NEW Personal Access Token (PAT) for the password.
git push -u origin "$MAIN_BRANCH"

echo "--------------------------------------------------------------------"
echo "✅ Push successful! All files should now be on GitHub."
