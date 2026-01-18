#!/usr/bin/env bash

set -e

echo "🚀 Installing or updating Commitizen and @polygontech/cz-convention..."

# Check for Node.js and npm
if ! command -v npm &> /dev/null
then
    echo "❌ npm could not be found. Please install Node.js and npm first."
    exit 1
fi

# Function to install or update a global npm package
install_or_update() {
    local pkg=$1
    if npm list -g --depth=0 "$pkg" &> /dev/null; then
        echo "🔄 $pkg is already installed. Checking for updates..."
        npm outdated -g "$pkg" --parseable --long | grep "$pkg" &> /dev/null && {
            echo "⬆️ Updating $pkg to latest version..."
            npm install -g "$pkg"
        } || {
            echo "✅ $pkg is already up-to-date."
        }
    else
        echo "📦 Installing $pkg globally..."
        npm install -g "$pkg"
    fi
}

# Install or update Commitizen
install_or_update commitizen

# Install or update your adapter
install_or_update @polygontech/cz-convention

# Configure ~/.czrc
CZRC_PATH="$HOME/.czrc"
if [ -f "$CZRC_PATH" ]; then
    echo "🔧 ~/.czrc already exists, updating path to adapter..."
else
    echo "🔧 Creating ~/.czrc to reference adapter..."
fi
echo '{ "path": "@polygontech/cz-convention" }' > "$CZRC_PATH"

echo "✅ Installation and update check complete!"
echo "You can now use Commitizen in any project:"
echo "   git cz"
