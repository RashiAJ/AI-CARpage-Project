#!/bin/bash

# Generate a random AUTH_SECRET
AUTH_SECRET=$(openssl rand -base64 32)

# Create .env.local file with the necessary variables
cat > .env.local << EOL
# Generate a random secret: https://generate-secret.vercel.app/32 or `openssl rand -base64 32`
AUTH_SECRET=${AUTH_SECRET}

# The following keys below are automatically created and
# added to your environment when you deploy on vercel

# Get your xAI API Key here for chat and image models: https://console.x.ai/
XAI_API_KEY=your_xai_api_key

# Instructions to create a Vercel Blob Store here: https://vercel.com/docs/storage/vercel-blob
BLOB_READ_WRITE_TOKEN=your_blob_token

# Instructions to create a PostgreSQL database here: https://vercel.com/docs/storage/vercel-postgres/quickstart
POSTGRES_URL=your_postgres_url

# Instructions to create a Redis store here:
# https://vercel.com/docs/redis
REDIS_URL=your_redis_url
EOL

echo "Created .env.local file with a randomly generated AUTH_SECRET."
echo "You may need to update other variables like XAI_API_KEY, BLOB_READ_WRITE_TOKEN, etc. with your actual values."
