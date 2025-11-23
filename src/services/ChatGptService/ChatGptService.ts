import axios from "axios";
import i18n from "i18next";
import { RpgManagerInterface } from "src/RpgManagerInterface";
import { AttributeType } from "src/data/enums/AttributeType";
import { ElementInterface } from "src/data/interfaces/ElementInterface";
import { ChatGptModel } from "./enums/ChatGptModel";
import { ChatGptMessageInterface } from "./interfaces/ChatGptMessageInterface";
import { ChatGptResponse } from "./interfaces/ChatGptResponse";

export class ChatGptService {
	private _endpoint = "https://openrouter.ai/api/v1/chat/completions";

	constructor(private _api: RpgManagerInterface, private _model?: ChatGptModel) {
		// Use provided model or get from settings
		if (!this._model) {
			this._model = (this._api.settings.chatGptModel as ChatGptModel) || ChatGptModel.Gpt4;
		}
	}

	private _getLanguage(): string {
		return i18n.language || "en";
	}

	persona(): string {
		const language = this._getLanguage();
		if (language === "pl") {
			return `Jesteś doświadczonym autorem scenariuszy z ponad 20 latami doświadczenia w pisaniu scenariuszy, opowiadaniu historii, tworzeniu fabuł i grach fabularnych.`;
		}
		if (language === "it") {
			return `Sei uno scrittore esperto con più di 20 anni di esperienza nella scrittura di sceneggiature, nella narrazione, nella trama e nei ttrpg.`;
		}
		return `You are an expert storyteller with more than 20 years of experience in scriptwriting, storytelling, plotting and ttrpgs.`;
	}

	context(campaign: ElementInterface): string {
		const language = this._getLanguage();
		let response = "";
		if (language === "pl") {
			response = `Jesteś Mistrzem Gry kampanii o nazwie ${campaign.name}.`;
			response += `Synopsa kampanii to: ${campaign.attribute(AttributeType.Description).value ?? ""}.`;
		} else if (language === "it") {
			response = `Sei il Dungeon Master di una campagna chiamata ${campaign.name}.`;
			response += `La sinossi della campagna è questa: ${campaign.attribute(AttributeType.Description).value ?? ""}.`;
		} else {
			response = `You are the Game Master of a campaign called ${campaign.name}.`;
			response += `The campaign synopsis is this: ${campaign.attribute(AttributeType.Description).value ?? ""}.`;
		}

		return response;
	}

	format(): string {
		const language = this._getLanguage();
		if (language === "pl") {
			return `Podasz 10 możliwych samodzielnych odpowiedzi na pytanie, jedną odpowiedź na linię.
Zabrania się pisania jakichkolwiek wprowadzeń, numeracji lub uwag podsumowujących. Tylko odpowiedzi.
Nie uwzględniaj żadnych znaków poza 10 podanymi opcjami.`;
		}
		if (language === "it") {
			return `Fornirai 10 possibili risposte autonome alla domanda, una risposta per riga.
È vietato scrivere alcuna introduzione, numerazione o osservazioni conclusive. Solo le risposte.
Non includere caratteri al di fuori delle 10 opzioni fornite.`;
		}
		return `You will provide 10 possible standalone responses to the question, one response per line.
You are forbidden to write any introduction, numbering, or concluding remarks. Just the responses.
Do not include any characters outside of the 10 provided options.`;
	}

	length(type: "short" | "long"): string {
		const language = this._getLanguage();
		if (type === "long") {
			if (language === "pl") {
				return `Będziesz pisać swoje odpowiedzi w szczegółowy sposób.
Każda opcja (odpowiedź) będzie zawierać jedno lub więcej zdań.
Każda opcja powinna być jakościowa, nie tylko krótkie zdanie i pozwoli opowiadającemu wykorzystać ją jako źródło wielu pomysłów.`;
			}
			if (language === "it") {
				return `Scriverai le tue risposte in modo dettagliato.
Ogni opzione (risposta) conterrà una o più frasi.
Ogni opzione dovrebbe essere qualitativa, non una frase breve e consentirà al narratore di utilizzarla come fonte di più idee.`;
			}
			return `You will write your responses in a detailed manner. 
Each option (response) will contain one or more sentences
Each option should be qualitative, not a short sentence and will allow the storyteller to use it as source of multiple ideas.`;
		}
		if (language === "pl") {
			return `Będziesz pisać swoje odpowiedzi w krótki i zwięzły sposób. Każda opcja (odpowiedź) będzie krótkim zdaniem.`;
		}
		if (language === "it") {
			return `Scriverai le tue risposte in modo breve e conciso. Ogni opzione (risposta) sarà una frase breve.`;
		}
		return `You will write your responses in a short, concise manner. Each option (response) will be a short sentence.`;
	}

	tone(): string {
		const language = this._getLanguage();
		if (language === "pl") {
			return `Będziesz pisać swoje odpowiedzi w prosty i bezpośredni sposób.`;
		}
		if (language === "it") {
			return `Scriverai le tue risposte in tono diretto.`;
		}
		return `You will write your responses in a straightforward tone.`;
	}

	async sendMessage(messages: ChatGptMessageInterface[]): Promise<ChatGptResponse[]> {
		// messages.push(
		// new ChatGptMessage("system", 'Format your response as: {"responses":[{"response":"YOUR RESPONSE"}]}')
		// );
		try {
			const payload = {
				model: this._mapModelToOpenRouter(this._model),
				messages: messages,
			};

			if (this._api.settings.debugMode) {
				console.log("[RPG Manager Debug] OpenRouter Request:", {
					endpoint: this._endpoint,
					model: payload.model,
					messagesCount: messages.length,
					timestamp: new Date().toISOString(),
				});
			}

			const response = await axios.post(
				this._endpoint,
				payload,
				{
					headers: {
						Authorization: `Bearer ${this._api.settings.chatGptKey}`,
						"HTTP-Referer": "https://github.com/carlonicora/obsidian-rpg-manager",
						"X-Title": "RPG Manager",
						"Content-Type": "application/json",
					},
				}
			);

			if (this._api.settings.debugMode) {
				console.log("[RPG Manager Debug] OpenRouter Response:", {
					status: response.status,
					choicesCount: response.data.choices?.length,
					usage: response.data.usage,
					timestamp: new Date().toISOString(),
				});
			}

			const latestMessage = response.data.choices?.[0]?.message?.content;
			return this._processLatestMessage(latestMessage);
		} catch (error) {
			if (this._api.settings.debugMode) {
				console.error("[RPG Manager Debug] OpenRouter Error:", {
					message: error instanceof Error ? error.message : String(error),
					response: (error as any).response ? (error as any).response.data : undefined,
					status: (error as any).response ? (error as any).response.status : undefined,
					timestamp: new Date().toISOString(),
				});
			}
			console.warn(error);
			throw error;
		}
	}

	private _mapModelToOpenRouter(model: ChatGptModel): string {
		switch (model) {
			case ChatGptModel.Gpt3Turbo:
				return "openai/gpt-3.5-turbo";
			case ChatGptModel.Gpt4:
				return "openai/gpt-4-turbo";
			default:
				return "openai/gpt-3.5-turbo";
		}
	}

	private _processLatestMessage(latestMessage: string): ChatGptResponse[] {
		const splitResponses = latestMessage.trim().split("\n");

		const results: ChatGptResponse[] = splitResponses
			.filter((resp) => resp.trim() !== "")
			.map((resp) => ({ response: resp.replace(/^\d+\.\s*/, "").trim() }));

		return results;
	}
}
