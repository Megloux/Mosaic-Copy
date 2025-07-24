#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}Setting up Mosaic development environment...${NC}\n"

# Check for Homebrew
if ! command -v brew &> /dev/null; then
    echo -e "${YELLOW}Installing Homebrew...${NC}"
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Install Supabase CLI
echo -e "${YELLOW}Installing Supabase CLI...${NC}"
brew install supabase/tap/supabase

# Install project dependencies
echo -e "${YELLOW}Installing npm dependencies...${NC}"
npm install

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}Creating .env file...${NC}"
    cat > .env << EOL
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
EOL
    echo -e "${GREEN}Created .env file. Please update with your Supabase credentials.${NC}"
fi

echo -e "\n${GREEN}Setup complete!${NC}"
echo -e "\nNext steps:"
echo -e "1. Update .env with your Supabase credentials"
echo -e "2. Run 'supabase login' to authenticate"
echo -e "3. Run 'supabase link --project-ref YOUR_PROJECT_REF'"
echo -e "4. Run 'supabase db push' to deploy the schema"
echo -e "5. Run 'npm run dev' to start the development server"
