# 🔧 Setup Guide

## Getting Your LiteAPI Key

This application uses the LiteAPI service to fetch hotel data. Follow these steps to get your API key:

### Step 1: Sign Up for LiteAPI

1. Visit [https://liteapi.travel/](https://liteapi.travel/)
2. Click on "Sign Up" or "Get Started"
3. Create your account with your email and password
4. Verify your email address

### Step 2: Get Your API Key

1. Log in to your LiteAPI dashboard
2. Navigate to the API Keys section
3. Copy your API key

### Step 3: Configure Your Application

1. In the root directory of this project, create a `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Open the `.env` file and add your API key:
   ```env
   VITE_API_KEY=your_actual_api_key_here
   VITE_API_BASE_URL=https://api.liteapi.travel/v3.0
   ```

3. Save the file

### Step 4: Restart the Development Server

If the development server is already running, stop it (Ctrl+C) and restart:

```bash
bun run dev
```

## Troubleshooting

### Error: "API configuration is missing"

**Solution:** Make sure you've created the `.env` file and added your API key.

### Error: "Unexpected token '<', '<!DOCTYPE'... is not valid JSON"

**Possible causes:**
1. Missing or incorrect API key
2. Missing `.env` file
3. Incorrect API base URL

**Solution:** 
- Verify your `.env` file exists in the root directory
- Check that your API key is correct
- Ensure the API base URL is: `https://api.liteapi.travel/v3.0`
- Restart the development server after making changes

### Error: "HTTP error! Status: 401"

**Solution:** Your API key is invalid or expired. Get a new one from the LiteAPI dashboard.

### Error: "HTTP error! Status: 429"

**Solution:** You've exceeded your API rate limit. Wait a few minutes or upgrade your LiteAPI plan.

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_KEY` | Your LiteAPI key | `sk_test_abc123...` |
| `VITE_API_BASE_URL` | LiteAPI base URL | `https://api.liteapi.travel/v3.0` |

## Need Help?

- **LiteAPI Documentation:** [https://docs.liteapi.travel/](https://docs.liteapi.travel/)
- **LiteAPI Support:** Contact through their website
- **Project Issues:** Check the GitHub issues page

## Security Notes

⚠️ **Important:**
- Never commit your `.env` file to version control
- Never share your API key publicly
- The `.env` file is already in `.gitignore` to prevent accidental commits
- Use different API keys for development and production

