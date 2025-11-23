# Obsługa Języka Polskiego - Szybki Start

## Jak Włączyć Język Polski?

### Krok 1: Zmień język Obsidian
1. Otwórz **Ustawienia Obsidian** (Settings)
2. Przejdź do **Język** (Language)
3. Wybierz **Polski** (Polish) z listy
4. Potwierdź zmianę

### Krok 2: Przeładuj Plugin
- Odświeź przeglądarkę lub uruchom ponownie Obsidian
- Plugin RPG Manager automatycznie przełączy się na polski

## Efekty Zmiany Języka

Po ustawieniu języka na polski:

✅ **Interfejs Użytkownika**
- Wszystkie menu i przyciski będą po polsku
- Wszystkie nazwy elementów będą przetłumaczone
- Dialogi i komunikaty będą po polsku

✅ **Generowanie Postaci (ChatGPT)**
- Pytania zadawane ChatGPT będą po polsku
- Generowane opisy postaci będą po polsku
- Sugestie zachowań, pragnień, potrzeb będą po polsku
- Wrażenia zmysłowe będą opisane po polsku

## Wspierane Języki

- 🇬🇧 **Angielski** (English) - Default
- 🇮🇹 **Włoski** (Italiano)
- 🇵🇱 **Polski** (NEW!)

## Powrót do Angielskiego

Aby wrócić do angielskiego:
1. Otwórz **Ustawienia Obsidian**
2. Zmień język na **English**
3. Odśwież - plugin automatycznie przełączy się na angielski

## Pliki Wymagane do Działania

Aby obsługa polskiego działała prawidłowo, wymagane są:
- ✅ `src/i18n/pl.ts` - Tłumaczenia interfejsu (NEW)
- ✅ `src/services/InternationalisationService.ts` - Rejestracja języka (UPDATED)
- ✅ `src/services/ChatGptService/ChatGptService.ts` - Polskie prompty ChatGPT (UPDATED)
- ✅ `src/services/ChatGptService/models/ChatGptNonPlayerCharacterModel.ts` - Polskie prompty NPC (UPDATED)

## Troubleshooting

**Problem:** Interfejs wciąż w angielskim
- **Rozwiązanie:** Odśwież przeglądarkę (Ctrl+Shift+R)

**Problem:** Opisy postaci wciąż w angielskim
- **Rozwiązanie:** Upewnij się, że plik `pl.ts` istnieje i jest załadowany

**Problem:** ChatGPT zwraca angielskie opisy
- **Rozwiązanie:** Sprawdź czy API endpoint jest OpenRouter (powinien być ustawiony)

## Informacja Techniczna

Język jest automatycznie wykrywany z:
- `i18n.language` - aktualny język w react-i18next
- Obsidian Global Language Setting - ustawienie globalne Obsidian

Nie trzeba restartować pluginu przy zmianie języka - zmiana jest natychmiastowa!
