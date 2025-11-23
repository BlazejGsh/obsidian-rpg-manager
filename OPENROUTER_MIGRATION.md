# OpenRouter Migration Guide

## Overview

The RPG Manager plugin has been updated to use **OpenRouter** instead of the OpenAI API directly. This change allows users without direct OpenAI API access to still use ChatGPT and other language models through OpenRouter.

## What Changed

### 1. API Endpoint
- **Before**: `https://api.openai.com/v1/chat/completions`
- **After**: `https://openrouter.ai/api/v1/chat/completions`

### 2. Configuration
- **API Key Setting Name**: Changed from "OpenAI Key" to "OpenRouter API Key"
- **Settings Tab**: Updated to reference OpenRouter instead of OpenAI

### 3. Model Mapping
The plugin now translates internal model names to OpenRouter model identifiers:
- `gpt-3.5-turbo` → `openai/gpt-3.5-turbo`
- `gpt-4` → `openai/gpt-4-turbo`

### 4. Request Headers
Added OpenRouter-specific headers:
```typescript
{
  Authorization: `Bearer ${API_KEY}`,
  "HTTP-Referer": "https://github.com/carlonicora/obsidian-rpg-manager",
  "X-Title": "RPG Manager",
  "Content-Type": "application/json"
}
```

## Setup Instructions

### 1. Get an OpenRouter API Key
1. Visit [https://openrouter.ai](https://openrouter.ai)
2. Sign up or log in
3. Go to API Keys section
4. Create a new API key
5. Copy the key

### 2. Configure RPG Manager
1. Open Obsidian Preferences/Settings
2. Go to "RPG Manager" settings tab
3. Find "ChatGPT" section
4. Paste your OpenRouter API key in "OpenRouter API Key" field
5. Save

### 3. Verify
Try generating an NPC suggestion - it should work with OpenRouter now!

## Benefits

✅ No need for direct OpenAI API access
✅ Access to multiple language models (GPT-3.5, GPT-4, Claude, etc.)
✅ Often more cost-effective depending on usage
✅ Same quality suggestions for campaign elements
✅ Easy to switch between different models

## Troubleshooting

### "Authorization failed" or "Invalid API key"
- Verify you copied the entire OpenRouter API key correctly
- Check that the key is active in OpenRouter dashboard
- Ensure you have sufficient credits/balance on OpenRouter

### "Model not available"
- OpenRouter may temporarily have rate limits
- Try again in a few moments
- Check OpenRouter status page

### Still getting OpenAI errors
- Clear your browser cache
- Reload the Obsidian app
- Verify the settings were saved

## Cost Considerations

OpenRouter pricing varies by model:
- **GPT-3.5-turbo**: Usually cheaper than direct OpenAI API
- **GPT-4-turbo**: Comparable or better pricing than OpenAI
- No monthly minimum - pay per request

Monitor your usage in the OpenRouter dashboard.

## Related Files Modified

- `src/services/ChatGptService/ChatGptService.ts`
- `src/services/ChatGptService/enums/ChatGptModel.ts`
- `src/settings/RpgManagerSettings.ts`

## Additional Notes

- The NPC generation system uses the same three-dimensional character creation methodology
- All system-agnostic features remain unchanged
- The migration is transparent to end users after setup
