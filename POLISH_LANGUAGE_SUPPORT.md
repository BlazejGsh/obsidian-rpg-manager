# Polish Language Support

## Overview

Polish language support has been added to the Obsidian RPG Manager plugin with full integration with Obsidian's global language setting. When users set their Obsidian interface to Polish (język: `pl`), both the plugin UI and ChatGPT prompts will automatically switch to Polish.

## Implementation Details

### Files Modified

#### 1. **src/i18n/pl.ts** (NEW FILE)
- Created comprehensive Polish translations for all ~550 UI strings
- Includes translations for:
  - Elements (campaigns, adventures, sessions, etc.)
  - Tasks and custom attributes
  - NPC types and character arcs
  - Story structures (Story Circle, Kishōtenketsu, Conflicts)
  - Buttons, dialogs, and all UI components
  - ChatGPT integration messages and waiting animations

#### 2. **src/services/InternationalisationService.ts** (MODIFIED)
- Added import for `i18nPl`
- Registered Polish language bundle with i18next:
  ```typescript
  i18n.addResourceBundle("pl", "common", i18nPl);
  ```
- Polish now available alongside existing English and Italian support

#### 3. **src/services/ChatGptService/ChatGptService.ts** (MODIFIED)
- Added import for `i18next`
- Added `_getLanguage()` method to detect current language
- Updated methods to return language-specific content:
  - `persona()`: System persona in Polish/Italian/English
  - `context()`: Campaign context in Polish/Italian/English
  - `format()`: Response formatting instructions in Polish/Italian/English
  - `length()`: Detail level instructions in Polish/Italian/English
  - `tone()`: Writing tone in Polish/Italian/English

#### 4. **src/services/ChatGptService/models/ChatGptNonPlayerCharacterModel.ts** (MODIFIED)
- Added import for `i18next`
- Added `_getLanguage()` method for language detection
- Updated all NPC generation methods:
  - `persona()`: Character creation framework in Polish/Italian/English
  - `context()`: NPC context setup in Polish/Italian/English
  - `getBeliefs()`: Belief generation prompt in Polish/Italian/English
  - `getGhost()`: Ghost event prompt in Polish/Italian/English
  - `getLie()`: Lie identification prompt in Polish/Italian/English
  - `getNeed()`: Need discovery prompt in Polish/Italian/English
  - `getStrenghts()`: Strength suggestion prompt in Polish/Italian/English
  - `getWeaknesses()`: Weakness suggestion prompt in Polish/Italian/English
  - `getBehaviour()`: Behavior pattern prompt in Polish/Italian/English
  - `getWant()`: Want identification prompt in Polish/Italian/English
  - `getOpposition()`: Opposition discovery prompt in Polish/Italian/English
  - `getSensoryImprint()`: Sensory description prompt in Polish/Italian/English

## How Language Detection Works

1. **Obsidian Global Language Setting**
   - When a user sets their Obsidian interface language to Polish in settings
   - Obsidian sets `i18n.language = "pl"`
   - The plugin automatically detects this change

2. **Automatic UI Updates**
   - React components using `useTranslation()` hook automatically re-render
   - All UI strings switch to Polish translations from `pl.ts`

3. **ChatGPT Prompt Switching**
   - When `ChatGptService` or `ChatGptNonPlayerCharacterModel` methods are called
   - They detect the current language via `i18n.language`
   - All prompts sent to ChatGPT are in the user's language
   - NPC descriptions are generated in Polish when language is set to Polish

## Language Support Tiers

### Tier 1: Full UI Translation (✅ Complete)
All user-facing interface strings translated to Polish

### Tier 2: ChatGPT System Prompts (✅ Complete)
All prompts and instructions sent to ChatGPT translated to Polish

### Tier 3: ChatGPT Response Processing (✅ Compatible)
- Response parsing language-agnostic (works for any language)
- Strength/Weakness lists provided in user's language
- Sensory imprints can be generated in Polish

## Supported Languages

The plugin now supports:
- **English** (en) - Default
- **Italian** (it) - Existing support
- **Polish** (pl) - New support

## Testing Polish Language Support

To test Polish language support:

1. Open Obsidian Settings
2. Navigate to Language
3. Set language to **Polskim** or **Polish** (code: `pl`)
4. Restart the plugin or reload Obsidian
5. All UI should now display in Polish
6. When generating NPCs with ChatGPT, prompts will be in Polish
7. Generated NPC descriptions will be in Polish

## Character Generation with Polish

When creating a Non-Player Character with Polish language enabled:

1. Character arc is presented in Polish
2. Belief suggestions are generated in Polish
3. Ghost events are described in Polish
4. Wants, needs, and opposition are in Polish
5. Behavioral patterns are in Polish
6. Sensory imprints are in Polish (sight, sound, smell, touch, taste)
7. All ChatGPT responses are in Polish

## Notes

- Language switching is immediate upon changing Obsidian's language setting
- No plugin restart required for UI language changes
- ChatGPT API integration respects user's language preference
- OpenRouter API calls include language-appropriate prompts
- All Polish translations use UTF-8 encoding for proper character support

## Future Enhancements

Potential improvements:
- Add more languages following this pattern
- Add language-specific character attributes (e.g., localized profession lists)
- Add language selector in plugin settings for override (independent of Obsidian language)
- Translate help documentation and tutorials to Polish
