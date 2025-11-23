import { RpgManagerInterface } from "src/RpgManagerInterface";
import i18n from "i18next";
import { ArcType } from "src/data/enums/ArcType";
import { ElementInterface } from "src/data/interfaces/ElementInterface";
import { ChatGptMessage } from "../ChatGptMessage";
import { ChatGptService } from "../ChatGptService";
import { ChatGptModel } from "../enums/ChatGptModel";
import { ChatGptMessageInterface } from "../interfaces/ChatGptMessageInterface";
import { ChatGptResponse } from "../interfaces/ChatGptResponse";

export class ChatGptNonPlayerCharacterModel {
	private _service: ChatGptService;
	private _dataMessages: Map<string, ChatGptMessageInterface> = new Map<string, ChatGptMessageInterface>();

	constructor(
		private _api: RpgManagerInterface,
		private _campaign: ElementInterface,
		private _name: string,
		private _model?: ChatGptModel
	) {
		// Use provided model or get from settings
		const modelToUse = this._model || (this._api.settings.chatGptModel as ChatGptModel) || ChatGptModel.Gpt3Turbo;
		this._service = new ChatGptService(_api, modelToUse);
	}

	private _getLanguage(): string {
		return i18n.language || "en";
	}

	private _generateMessages(length: "short" | "long"): ChatGptMessageInterface[] {
		const language = this._getLanguage();
		const response: ChatGptMessageInterface[] = [];
		
		// Add language instruction first
		let languageInstruction = "Respond in English.";
		if (language === "pl") {
			languageInstruction = "Odpowiadaj wyłącznie w polskim.";
		} else if (language === "it") {
			languageInstruction = "Rispondi solo in italiano.";
		}
		response.push(new ChatGptMessage("system", languageInstruction));
		
		response.push(new ChatGptMessage("system", this._service.persona()));
		response.push(new ChatGptMessage("system", this.persona()));
		response.push(new ChatGptMessage("system", this._service.format()));
		response.push(new ChatGptMessage("system", this._service.tone()));
		response.push(new ChatGptMessage("system", this._service.length(length)));
		response.push(new ChatGptMessage("system", this._service.context(this._campaign)));
		response.push(new ChatGptMessage("system", this.context()));

		const descriptionMessage: ChatGptMessageInterface | undefined = this._dataMessages.get("description");
		if (descriptionMessage) response.push(descriptionMessage);

		const genderMessage: ChatGptMessageInterface | undefined = this._dataMessages.get("gender");
		if (genderMessage) response.push(genderMessage);

		const characterArcMessage: ChatGptMessageInterface | undefined = this._dataMessages.get("characterArc");
		if (characterArcMessage) response.push(characterArcMessage);

		const beliefsMessage: ChatGptMessageInterface | undefined = this._dataMessages.get("beliefs");
		if (beliefsMessage) response.push(beliefsMessage);

		const ghostMessage: ChatGptMessageInterface | undefined = this._dataMessages.get("ghost");
		if (ghostMessage) response.push(ghostMessage);

		const lieMessage: ChatGptMessageInterface | undefined = this._dataMessages.get("lie");
		if (lieMessage) response.push(lieMessage);

		const needMessage: ChatGptMessageInterface | undefined = this._dataMessages.get("need");
		if (needMessage) response.push(needMessage);

		const strengthsMessage: ChatGptMessageInterface | undefined = this._dataMessages.get("strengths");
		if (strengthsMessage) response.push(strengthsMessage);

		const weaknessesMessage: ChatGptMessageInterface | undefined = this._dataMessages.get("weaknesses");
		if (weaknessesMessage) response.push(weaknessesMessage);

		const behaviourMessage: ChatGptMessageInterface | undefined = this._dataMessages.get("behaviour");
		if (behaviourMessage) response.push(behaviourMessage);

		const wantMessage: ChatGptMessageInterface | undefined = this._dataMessages.get("want");
		if (wantMessage) response.push(wantMessage);

		const oppositionMessage: ChatGptMessageInterface | undefined = this._dataMessages.get("opposition");
		if (oppositionMessage) response.push(oppositionMessage);

		return response;
	}

	private _generateSuggestions(message: ChatGptMessageInterface, length: "short" | "long"): Promise<string[]> {
		const messages: ChatGptMessageInterface[] = this._generateMessages(length);
		messages.push(message);

		return this._service.sendMessage(messages).then((response: ChatGptResponse[]) => {
			return response.map((message: ChatGptResponse) => message.response);
		});
	}

	persona(): string {
		const language = this._getLanguage();
		
		if (language === "pl") {
			return `Masz szczególne doświadczenie w tworzeniu trójwymiarowych postaci. Aby utworzyć postać, używasz następujących atrybutów:
- Łuk postaci (może być "Pozytywny", "Rozczarowania", "Upadku", "Korupcji" lub "Płaski")
- Przekonania (Jakie są podstawowe przekonania postaci?)
- Duchowe wspomnienie (przeszłe zdarzenie, które definiuje przekonanie postaci i kłamstwo, w które postać wierzy)
- Kłamstwo (Coś, co postać przyjmuje za prawdę i sprawia, że podążają za swoim pragnieniem zamiast swoją potrzebą (tylko jeśli Typ Łuku Postaci to Pozytywny, Rozczarowania lub Upadek)
- Potrzeba (Jaka jest rzeczywista potrzeba postaci?)
- Mocne strony (wybrane z listy: Adaptacyjny, Ambitny, Asertywny, Charyzmatyczny, Współczujący, Odważny, Kreatywny, Stanowczy, Pracowity, Zdyscyplinowany, Energiczny, Empatyczny, Skromny, Inspirujący, Intuicyjny, Lojalny, Cierpliwy, Odporny, Pewny siebie, Strategiczny, Wytrwały, Dalekowzroczny, Dowcipny)
- Słabe strony (wybrane z listy: Impulsywny, Niezdecydowany, Nieelastyczny, Niepewny, Nietolerancyjny, Nieodpowiedzialny, Leniwy, Naiwny, Zaniedbujący, Nerwowy, Uparty, Despotyczny, Przesadnie krytyczny, Perfekcjonista, Pesymista, Prokrastynator, Reaktywny, Sztywny, Egocentryczny, Wrażliwy, Nieśmiały, Upór, Nieśmiały, Bez skupienia, Niejasny)
- Zachowanie (Jakie jest ogólne zachowanie postaci?)
- Pragnienie (Czego postać uważa, że chce?)
- Przeciwność (Jakie siły stoją w drodze postaci do osiągnięcia tego, czego chce?)
`;
		}
		
		if (language === "it") {
			return `Sei particolarmente esperto nella creazione di personaggi tridimensionali. Per creare un personaggio utilizzi i seguenti attributi:
- Arco del carattere (può essere "Positivo", "Disillusione", "Caduta", "Corruzione" o "Piatto")
- Convinzioni (Quali sono le convinzioni fondamentali del personaggio?)
- Fantasma (un evento passato che definisce la convinzione di un personaggio e una bugia che il personaggio crede sia vera)
- Bugia (Qualcosa che il personaggio accetta come verità e lo fa seguire il suo desiderio invece del suo bisogno (solo se il Tipo di Arco del Carattere è Positivo, Disillusione o Caduta)
- Bisogno (Qual è il vero bisogno del personaggio?)
- Punti di forza (scelti da questo elenco: Adattabile, Ambizioso, Assertivo, Carismatico, Compassionevole, Coraggioso, Creativo, Decisivo, Diligente, Disciplinato, Energico, Empatico, Umile, Ispiratore, Intuitivo, Leale, Paziente, Resiliente, Sicuro di sé, Strategico, Tenace, Visionario, Arguto)
- Debolezze (scelte da questo elenco: Impulsivo, Indeciso, Inflessibile, Insicuro, Intollerante, Irresponsabile, Pigro, Ingenuo, Negligente, Nervoso, Ostinato, Prepotente, Ipercritico, Perfezionista, Pessimista, Procrastinatore, Reattivo, Rigido, Egocentrico, Sensibile, Timido, Testardo, Timoroso, Senza focus, Vago)
- Comportamento (Qual è il comportamento generale del personaggio?)
- Desiderio (Cosa pensa il personaggio di volere?)
- Opposizione (Quali forze si oppongono al personaggio nel raggiungimento di ciò che vuole?)
`;
		}
		
		return `You are particularly experienced in creating three dimensional characters. To create a character you use the following attributes:
- Character Arc (it can be "Positive", "Disillusionment", "Fall", "Corruption" or "Flat")
- Beliefs (What are the character's core beliefs?)
- Ghost (a past event that defines the belief of a character and a lie the character believes to be true)
- Lie (Something the character accepts as the truth and make them follow their want instead of their need (only If the Type of Character Arc is Positive, Disillusionment or Fall)
- Need (What is the real need of the character?)
- Strengths (picked from this list: Adaptable, Ambitious, Assertive, Charismatic, Compassionate, Courageous, Creative, Decisive, Diligent, Disciplined, Energetic, Empathetic, Humble, Inspirational, Intuitive, Loyal, Patient, Resilient, Self-confident, Strategic, Tenacious, Visionary, Witty)
- Weaknesses (picked from this list: Impulsive, Indecisive, Inflexible, Insecure, Intolerant, Irresponsible, Lazy, Naive, Neglectful, Nervous, Obstinate, Overbearing, Overcritical, Perfectionist, Pessimistic, Procrastinator, Reactive, Rigid, Self-centered, Sensitive, Shy, Stubborn, Timid, Unfocused, Vague)
- Behaviour (What is the general behaviour of the character?)
- Want (What does the character believe they want?)
- Opposition (What forces oppose the character in getting what they want?)
`;
	}

	context(): string {
		const language = this._getLanguage();
		if (language === "pl") {
			return `Bohater niezależny, którego tworzysz, to ${this._name}. `;
		}
		if (language === "it") {
			return `Il personaggio non giocante che stai creando è ${this._name}. `;
		}
		return `The non-player character you are creating is ${this._name}. `;
	}

	set gender(gender: string) {
		const language = this._getLanguage();
		let label = "gender";
		if (language === "pl") label = "płeć";
		else if (language === "it") label = "genere";
		
		this._dataMessages.set("gender", {
			role: "system",
			content: `The "${label}" of ${this._name} is: \`\`\`${gender}\`\`\`.`,
		});
	}

	async getGender(): Promise<string[]> {
		const language = this._getLanguage();
		let content = "";
		if (language === "pl") {
			content = `Na podstawie podanych informacji zasugeruj 10 możliwych płci dla ${this._name} spójnych z dotychczasowo opisaną postacią.`;
		} else if (language === "it") {
			content = `In base alle informazioni fornite, suggerisci 10 possibili generi per ${this._name} coerenti con il personaggio descritto finora.`;
		} else {
			content = `Based on the information provided, suggest 10 possible genders for ${this._name} that are consistent with the character described so far.`;
		}
		const message: ChatGptMessageInterface = {
			role: "user",
			content: content,
		};

		return this._generateSuggestions(message, "short");
	}

	set description(description: string) {
		const language = this._getLanguage();
		let label = "description";
		if (language === "pl") label = "opis";
		else if (language === "it") label = "descrizione";
		
		this._dataMessages.set("description", {
			role: "system",
			content: `The "${label}" of ${this._name} is: \`\`\`${description}\`\`\`.`,
		});
	}

	set occupation(occupation: string) {
		const language = this._getLanguage();
		let label = "occupation";
		if (language === "pl") label = "zawód";
		else if (language === "it") label = "occupazione";
		
		this._dataMessages.set("occupation", {
			role: "system",
			content: `The "${label}" of ${this._name} is: \`\`\`${occupation}\`\`\`.`,
		});
	}

	set characterArc(characterArc: ArcType) {
		const language = this._getLanguage();
		let label = "character arc";
		if (language === "pl") label = "łuk postaci";
		else if (language === "it") label = "arco del carattere";
		
		this._dataMessages.set("characterArc", {
			role: "system",
			content: `The "${label}" of ${this._name} is ${ArcType[characterArc]}.`,
		});
	}

	async getBeliefs(): Promise<string[]> {
		const language = this._getLanguage();
		let content = "";
		if (language === "pl") {
			content = `Na podstawie podanych informacji zasugeruj 10 podstawowych przekonań dla ${this._name}, które są spójne z opisem postaci i łukiem.`;
		} else if (language === "it") {
			content = `In base alle informazioni fornite, suggerisci 10 convinzioni fondamentali per ${this._name} coerenti con la descrizione e l'arco del personaggio.`;
		} else {
			content = `Based on the information provided, suggest 10 core beliefs for ${this._name} that are consistent with the character description and arc.`;
		}
		const message: ChatGptMessageInterface = {
			role: "user",
			content: content,
		};

		return this._generateSuggestions(message, "long");
	}

	set beliefs(beliefs: string) {
		const language = this._getLanguage();
		let label = "beliefs";
		if (language === "pl") label = "przekonania";
		else if (language === "it") label = "convinzioni";
		
		this._dataMessages.set("beliefs", {
			role: "system",
			content: `The "${label}" of ${this._name} are: \`\`\`${beliefs}\`\`\`.`,
		});
	}

	async getGhost(): Promise<string[]> {
		const language = this._getLanguage();
		let content = "";
		if (language === "pl") {
			content = `Na podstawie podanych informacji zasugeruj 10 "duchowych wspomnień" dla ${this._name} spójnych z opisem i łukiem postaci.`;
		} else if (language === "it") {
			content = `In base alle informazioni fornite, suggerisci 10 "fantasmi" per ${this._name} coerenti con la descrizione e l'arco del personaggio.`;
		} else {
			content = `Based on the information provided, suggest 10 "ghosts" for ${this._name} that are consistent with the character description and arc.`;
		}
		const message: ChatGptMessageInterface = {
			role: "user",
			content: content,

			// content: `Based on the information provided, suggest 10 "ghosts" for ${this._name} that are consistent with the character description and arc.
			// A ghost is a past event that defines the belief of a character.`,
		};

		return this._generateSuggestions(message, "long");
	}

	set ghost(ghost: string) {
		const language = this._getLanguage();
		let label = "ghost";
		if (language === "pl") label = "duchowe wspomnienie";
		else if (language === "it") label = "fantasma";
		
		this._dataMessages.set("ghost", {
			role: "system",
			content: `The "${label}" of ${this._name} is: \`\`\`${ghost}\`\`\`.`,
		});
	}

	async getLie(): Promise<string[]> {
		const language = this._getLanguage();
		let content = "";
		if (language === "pl") {
			content = `Na podstawie podanych informacji zasugeruj 10 "kłamstw" dla ${this._name}, które są spójne z dotychczasowo opisaną postacią.`;
		} else if (language === "it") {
			content = `In base alle informazioni fornite, suggerisci 10 "bugie" per ${this._name} coerenti con il personaggio descritto finora.`;
		} else {
			content = `Based on the information provided, suggest 10 "lies" for ${this._name} that are consistent with the character described so far.`;
		}
		const message: ChatGptMessageInterface = {
			role: "user",
			content: content,
		};

		return this._generateSuggestions(message, "long");
	}

	set lie(lie: string) {
		const language = this._getLanguage();
		let label = "lie";
		if (language === "pl") label = "kłamstwo";
		else if (language === "it") label = "bugia";
		
		this._dataMessages.set("lie", {
			role: "system",
			content: `The "${label}" of ${this._name} is: \`\`\`${lie}\`\`\`.`,
		});
	}

	async getNeed(): Promise<string[]> {
		const language = this._getLanguage();
		let content = "";
		if (language === "pl") {
			content = `Na podstawie podanych informacji zasugeruj 10 "potrzeb" dla ${this._name} z silnym związkiem do dostarczonego "kłamstwa".`;
		} else if (language === "it") {
			content = `In base alle informazioni fornite, suggerisci 10 "bisogni" per ${this._name} con un forte legame alla "bugia" fornita.`;
		} else {
			content = `Based on the information provided, suggest 10 "needs" for ${this._name} with a strong link to the "lie" provided.`;
		}
		const message: ChatGptMessageInterface = {
			role: "user",
			content: content,
		};

		return this._generateSuggestions(message, "long");
	}

	set need(need: string) {
		const language = this._getLanguage();
		let label = "need";
		if (language === "pl") label = "potrzeba";
		else if (language === "it") label = "bisogno";
		
		this._dataMessages.set("need", {
			role: "system",
			content: `The "${label}" of ${this._name} is: \`\`\`${need}\`\`\`.`,
		});
	}

	async getStrenghts(): Promise<string[]> {
		const language = this._getLanguage();
		let content = "";
		if (language === "pl") {
			content = `Na podstawie podanych informacji zasugeruj 5 "mocnych stron" dla ${this._name} spójnych z dotychczasowo opisaną postacią. Tylko Polska lista: Adaptacyjny, Ambitny, Asertywny, Charyzmatyczny, Współczujący, Odważny, Kreatywny, Stanowczy, Pracowity, Zdyscyplinowany, Energiczny, Empatyczny, Skromny, Inspirujący, Intuicyjny, Lojalny, Cierpliwy, Odporny, Pewny siebie, Strategiczny, Wytrwały, Dalekowzroczny, Dowcipny. Jedno na linię.`;
		} else if (language === "it") {
			content = `In base alle informazioni fornite, suggerisci 5 "punti di forza" per ${this._name} coerenti con il personaggio descritto finora. Solo elenco italiano: Adattabile, Ambizioso, Assertivo, Carismatico, Compassionevole, Coraggioso, Creativo, Decisivo, Diligente, Disciplinato, Energico, Empatico, Umile, Ispiratore, Intuitivo, Leale, Paziente, Resiliente, Sicuro di sé, Strategico, Tenace, Visionario, Arguto. Uno per riga.`;
		} else {
			content = `Based on the information provided, suggest 5 "strengths" for ${this._name} that are consistent with the character described so far. Only English list. Write ONE strength per line.`;
		}
		const message: ChatGptMessageInterface = {
			role: "user",
			content: content,
		};

		return this._generateSuggestions(message, "short");
	}

	set strengths(strengths: string) {
		const language = this._getLanguage();
		let label = "strengths";
		if (language === "pl") label = "mocne strony";
		else if (language === "it") label = "punti di forza";
		
		this._dataMessages.set("strenghts", {
			role: "system",
			content: `The "${label}" of ${this._name} are: \`\`\`${strengths}\`\`\`.`,
		});
	}

	async getWeaknesses(): Promise<string[]> {
		const language = this._getLanguage();
		let content = "";
		if (language === "pl") {
			content = `Na podstawie podanych informacji zasugeruj 5 "słabych stron" dla ${this._name} spójnych z dotychczasowo opisaną postacią. Tylko Polska lista: Impulsywny, Niezdecydowany, Nieelastyczny, Niepewny, Nietolerancyjny, Nieodpowiedzialny, Leniwy, Naiwny, Zaniedbujący, Nerwowy, Uparty, Despotyczny, Przesadnie krytyczny, Perfekcjonista, Pesymista, Prokrastynator, Reaktywny, Sztywny, Egocentryczny, Wrażliwy, Nieśmiały, Upór, Bez skupienia, Niejasny. Jedno na linię.`;
		} else if (language === "it") {
			content = `In base alle informazioni fornite, suggerisci 5 "debolezze" per ${this._name} coerenti con il personaggio descritto finora. Solo elenco italiano: Impulsivo, Indeciso, Inflessibile, Insicuro, Intollerante, Irresponsabile, Pigro, Ingenuo, Negligente, Nervoso, Ostinato, Prepotente, Ipercritico, Perfezionista, Pessimista, Procrastinatore, Reattivo, Rigido, Egocentrico, Sensibile, Timido, Testardo, Timoroso, Senza focus, Vago. Uno per riga.`;
		} else {
			content = `Based on the information provided, suggest 5 "weaknesses" for ${this._name} that are consistent with the character described so far. Only English list. Write ONE weakness per line.`;
		}
		const message: ChatGptMessageInterface = {
			role: "user",
			content: content,
		};

		return this._generateSuggestions(message, "short");
	}

	set weaknesses(weaknesses: string) {
		const language = this._getLanguage();
		let label = "weaknesses";
		if (language === "pl") label = "słabe strony";
		else if (language === "it") label = "debolezze";
		
		this._dataMessages.set("weaknesses", {
			role: "system",
			content: `The "${label}" of ${this._name} are: \`\`\`${weaknesses}\`\`\`.`,
		});
	}

	async getBehaviour(): Promise<string[]> {
		const language = this._getLanguage();
		let content = "";
		
		if (language === "pl") {
			content = `Wygeneruj 10 odrębnych zestawów mieszanych zachowań, manier i wzorów mowy dla ${this._name}
			używając wszystkich podanych informacji. Każdy zestaw powinien obejmować różne aspekty cech postaci
			w kolekcję różnorodnych działań i reakcji odpowiednią do natychmiastowego grania roli.
			Pamiętaj, każdy zestaw powinien być mieszanką cech, a nie skupiać się na pojedynczym aspekcie i wybiorę
			tylko jedną z twoich odpowiedzi, więc każdy powinien być kompletnym zestawem zachowań. Daj mi jeden zestaw zachowań
			na linię, bez wprowadzenia, list czy numeracji. Tylko zachowania.`;
		} else if (language === "it") {
			content = `Genera 10 insiemi distinti di comportamenti misti, modi di fare e modelli di linguaggio per ${this._name}
			utilizzando tutte le informazioni fornite finora. Ogni insieme dovrebbe comprendere vari aspetti dei tratti del personaggio
			in una raccolta di azioni e reazioni diverse adatte al gioco di ruolo immediato.
			Ricorda, ogni insieme dovrebbe essere una miscela di tratti piuttosto che concentrarsi su un singolo aspetto e sceglierò solo
			una delle tue risposte, quindi ciascuno dovrebbe essere un insieme completo di comportamenti. Dammi un insieme di comportamenti
			per riga, senza introduzione, elenchi o numerazione. Solo i comportamenti.`;
		} else {
			content = `Generate 10 distinct sets of mixed behaviors, mannerisms, and speech patterns for ${this._name}
			using all the information provided so far. Each set should encompass various facets of the character's traits 
			into a collection of diverse actions and reactions suitable for immediate role-play. 
			Remember, each set should be a blend of their traits rather than focusing on just one aspect and I will only
			pick one of your answers, so each of them should be a complete set of behaviors. Give me one set of behaviours
			per line, no introduction, lists or numbering. Just the behaviors.`;
		}
		
		const message: ChatGptMessageInterface = {
			role: "user",
			content: content,
		};

		return this._generateSuggestions(message, "long");
	}

	set behaviour(behaviour: string) {
		const language = this._getLanguage();
		let label = "behaviour";
		if (language === "pl") label = "zachowanie";
		else if (language === "it") label = "comportamento";
		
		this._dataMessages.set("behaviour", {
			role: "system",
			content: `The "${label}" of ${this._name} is: \`\`\`${behaviour}\`\`\`.`,
		});
	}

	async getWant(): Promise<string[]> {
		const language = this._getLanguage();
		let content = "";
		if (language === "pl") {
			content = `Na podstawie podanych informacji zasugeruj 10 "pragnień" dla ${this._name} spójnych z dotychczasowo opisaną postacią.`;
		} else if (language === "it") {
			content = `In base alle informazioni fornite, suggerisci 10 "desideri" per ${this._name} coerenti con il personaggio descritto finora.`;
		} else {
			content = `Based on the information provided, suggest 10 "wants" for ${this._name} that are consistent with the character described so far.`;
		}
		const message: ChatGptMessageInterface = {
			role: "user",
			content: content,
		};

		return this._generateSuggestions(message, "long");
	}

	set want(want: string) {
		const language = this._getLanguage();
		let label = "want";
		if (language === "pl") label = "pragnienie";
		else if (language === "it") label = "desiderio";
		
		this._dataMessages.set("want", {
			role: "system",
			content: `The "${label}" of ${this._name} is: \`\`\`${want}\`\`\`.`,
		});
	}

	async getOpposition(): Promise<string[]> {
		const language = this._getLanguage();
		let content = "";
		if (language === "pl") {
			content = `Na podstawie podanych informacji zasugeruj 10 "przeciwności" dla ${this._name} spójnych z dotychczasowo opisaną postacią.`;
		} else if (language === "it") {
			content = `In base alle informazioni fornite, suggerisci 10 "opposizioni" per ${this._name} coerenti con il personaggio descritto finora.`;
		} else {
			content = `Based on the information provided, suggest 10 "oppositions" for ${this._name} that are consistent with the character described so far.`;
		}
		const message: ChatGptMessageInterface = {
			role: "user",
			content: content,
		};

		return this._generateSuggestions(message, "long");
	}

	set opposition(opposition: string) {
		const language = this._getLanguage();
		let label = "opposition";
		if (language === "pl") label = "przeciwność";
		else if (language === "it") label = "opposizione";
		
		this._dataMessages.set("opposition", {
			role: "system",
			content: `The "${label}" of ${this._name} is: \`\`\`${opposition}\`\`\`.`,
		});
	}

	async getSensoryImprint(): Promise<string[]> {
		const language = this._getLanguage();
		let content = "";
		if (language === "pl") {
			content = `Na podstawie podanych informacji zasugeruj 5 "wrażeń zmysłowych" dla ${this._name} spójnych z opisaną postacią. Kolejność: wzrok, słuch, zapach, dotyk, smak.`;
		} else if (language === "it") {
			content = `In base alle informazioni fornite, suggerisci le 5 "impronte sensoriali" per ${this._name} coerenti con il personaggio descritto. Ordine: vista, suono, odore, tatto, gusto.`;
		} else {
			content = `Based on the information provided, suggest the 5 "sensory imprints" for ${this._name} that are consistent with the character described so far. Order: sight, sound, smell, touch, taste.`;
		}
		const message: ChatGptMessageInterface = {
			role: "user",
			content: content,
		};		const response = await this._generateSuggestions(message, "short");

		const result: string[] = [];
		let temp: string[] = [];

		response.forEach((item, index) => {
			if (item.startsWith("-")) {
				temp.push(item);
			} else {
				if (temp.length > 0) {
					result.push(temp.join("\n"));
					temp = [];
				}
			}

			if (index === response.length - 1 && temp.length > 0) {
				result.push(temp.join("\n"));
			}
		});

		return result;
	}
}
