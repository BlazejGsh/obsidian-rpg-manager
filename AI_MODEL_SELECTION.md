# AI Model Selection Feature

## Overview

Users can now select which AI model to use for character and chapter generation directly from the plugin settings. This allows choosing between faster/cheaper models and higher quality models based on user preference.

## Implementation

### 1. Settings Interface Update
**File:** `src/settings/RpgManagerSettings.ts`

Added new setting field:
- `chatGptModel: string` - Stores the selected model identifier
- Default value: `"gpt-4-turbo"` - Uses GPT-4 Turbo by default for best quality

### 2. UI Dropdown Selector
**Location:** Plugin Settings → ChatGPT section

New dropdown with options:
- **GPT-3.5 Turbo** (`gpt-3.5-turbo`) - Faster and cheaper
- **GPT-4 Turbo** (`gpt-4-turbo`) - Better quality (default)

### 3. Model Application Logic

#### ChatGptService
- **File:** `src/services/ChatGptService/ChatGptService.ts`
- Model is passed to constructor as optional parameter
- Falls back to `settings.chatGptModel` if not provided
- Uses GPT-4 as final fallback

#### ChatGptNonPlayerCharacterModel
- **File:** `src/services/ChatGptService/models/ChatGptNonPlayerCharacterModel.ts`
- Constructor accepts optional model parameter
- If no model provided, retrieves from `api.settings.chatGptModel`
- Passes model to ChatGptService

### 4. Usage Flow

```
User Changes Model in Settings
    ↓
Saves: settings.chatGptModel = "gpt-3.5-turbo" or "gpt-4-turbo"
    ↓
When generating NPC/Chapter:
    ↓
ChatGptNonPlayerCharacterModel reads from settings
    ↓
Passes to ChatGptService._model
    ↓
Used in: _mapModelToOpenRouter() → API call to OpenRouter
```

## User Guide

### Changing the AI Model

1. Open **Obsidian Settings**
2. Navigate to **RPG Manager** section
3. Find **ChatGPT** subsection
4. Look for **AI Model** dropdown
5. Select desired model:
   - **GPT-3.5 Turbo (Faster, cheaper)** - Good for quick generation
   - **GPT-4 Turbo (Better quality)** - Best for detailed descriptions
6. Changes apply immediately to next generation

### Model Comparison

| Feature | GPT-3.5 Turbo | GPT-4 Turbo |
|---------|---------------|------------|
| Speed | ⚡ Very Fast | ⚡ Fast |
| Quality | 🎯 Good | 🎯🎯 Excellent |
| Cost | 💰 Very Cheap | 💰💰 Moderate |
| Best For | Quick iterations | Final results |
| Creativity | Standard | High |
| Detail Level | Good | Excellent |

## Technical Details

### Model Enumeration
**File:** `src/services/ChatGptService/enums/ChatGptModel.ts`

```typescript
export enum ChatGptModel {
	Gpt3Turbo = "gpt-3.5-turbo",
	Gpt4 = "gpt-4-turbo",
}
```

### Settings Persistence
- Model selection is automatically saved to `plugin.json`
- Persists across Obsidian restarts
- Each user can have different model preference

### OpenRouter API Integration
- Model value is mapped in `_mapModelToOpenRouter()`:
  - `gpt-3.5-turbo` → `openai/gpt-3.5-turbo`
  - `gpt-4-turbo` → `openai/gpt-4-turbo`
- API call includes selected model in request

## Features

✅ **Immediate Effect** - No plugin restart needed
✅ **Fallback Logic** - Always has a valid model
✅ **Settings Persistence** - Remembers user choice
✅ **Language Aware** - Works with all languages (EN/IT/PL)
✅ **Backward Compatible** - Existing installs default to GPT-4

## Cost Implications

### OpenRouter Pricing (Approximate)
- **GPT-3.5 Turbo**: ~$0.0005 per 1K input tokens, ~$0.0015 per 1K output tokens
- **GPT-4 Turbo**: ~$0.01 per 1K input tokens, ~$0.03 per 1K output tokens

### Typical Character Generation
- Input tokens: ~1000-2000 (system messages + context)
- Output tokens: ~1000 (suggestions)
- **GPT-3.5 Turbo**: ~$0.002-0.005 per character
- **GPT-4 Turbo**: ~$0.04-0.08 per character

Recommendation: Use GPT-3.5 Turbo for drafting, GPT-4 for final versions.

## Files Modified

1. ✅ `src/settings/RpgManagerSettings.ts`
   - Added import for ChatGptModel
   - Added `chatGptModel` to interface
   - Added default value
   - Added UI dropdown selector

2. ✅ `src/services/ChatGptService/ChatGptService.ts`
   - Changed model parameter to optional
   - Added fallback to settings
   - Added final fallback to GPT-4

3. ✅ `src/services/ChatGptService/models/ChatGptNonPlayerCharacterModel.ts`
   - Changed model parameter to optional
   - Added fallback to settings
   - Passes model to ChatGptService

## Testing Checklist

- [ ] Model selector appears in settings
- [ ] Can change between GPT-3.5 and GPT-4
- [ ] Settings save and persist
- [ ] Generating NPC uses selected model
- [ ] Different models produce different quality/speed
- [ ] Language setting still works with model selection
- [ ] Plugin functions without explicit model selection
