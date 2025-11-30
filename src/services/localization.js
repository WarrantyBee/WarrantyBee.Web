import { createI18n } from "vue-i18n";

import baseEnUS from "../locales/en-US.json";

import arAE from "../locales/ar-AE.json";
import arEG from "../locales/ar-EG.json";
import arIQ from "../locales/ar-IQ.json";
import arKW from "../locales/ar-KW.json";
import arMA from "../locales/ar-MA.json";
import arOM from "../locales/ar-OM.json";
import arQA from "../locales/ar-QA.json";
import arSA from "../locales/ar-SA.json";
import arTN from "../locales/ar-TN.json";

import deAT from "../locales/de-AT.json";
import deCH from "../locales/de-CH.json";
import deDE from "../locales/de-DE.json";

import enAU from "../locales/en-AU.json";
import enCA from "../locales/en-CA.json";
import enGB from "../locales/en-GB.json";
import enIN from "../locales/en-IN.json";
import enNZ from "../locales/en-NZ.json";
import enSA from "../locales/en-SA.json";
import enSG from "../locales/en-SG.json";
import enUS from "../locales/en-US.json";

import esAR from "../locales/es-AR.json";
import esCL from "../locales/es-CL.json";
import esCO from "../locales/es-CO.json";
import esES from "../locales/es-ES.json";
import esMX from "../locales/es-MX.json";
import esPE from "../locales/es-PE.json";
import esUS from "../locales/es-US.json";

import frBE from "../locales/fr-BE.json";
import frCA from "../locales/fr-CA.json";
import frCH from "../locales/fr-CH.json";
import frFR from "../locales/fr-FR.json";

import hiFJ from "../locales/hi-FJ.json";
import hiIN from "../locales/hi-IN.json";

import jaJP from "../locales/ja-JP.json";

import koKR from "../locales/ko-KR.json";

import ptBR from "../locales/pt-BR.json";
import ptPT from "../locales/pt-PT.json";

import zhCN from "../locales/zh-CN.json";
import zhSG from "../locales/zh-SG.json";
import zhTW from "../locales/zh-TW.json";

const messages = {
	// English family (merged with baseEnUS)
	"en-IN": { ...baseEnUS, ...enIN },
	"en-US": { ...baseEnUS, ...enUS },
	"en-GB": { ...baseEnUS, ...enGB },
	"en-CA": { ...baseEnUS, ...enCA },
	"en-AU": { ...baseEnUS, ...enAU },
	"en-NZ": { ...baseEnUS, ...enNZ },
	"en-SA": { ...baseEnUS, ...enSA },
	"en-SG": { ...baseEnUS, ...enSG },

	// Arabic
	"ar-AE": { ...arAE },
	"ar-EG": { ...arEG },
	"ar-IQ": { ...arIQ },
	"ar-KW": { ...arKW },
	"ar-MA": { ...arMA },
	"ar-OM": { ...arOM },
	"ar-QA": { ...arQA },
	"ar-SA": { ...arSA },
	"ar-TN": { ...arTN },

	// German
	"de-AT": { ...deAT },
	"de-CH": { ...deCH },
	"de-DE": { ...deDE },

	// Spanish
	"es-AR": { ...esAR },
	"es-CL": { ...esCL },
	"es-CO": { ...esCO },
	"es-ES": { ...esES },
	"es-MX": { ...esMX },
	"es-PE": { ...esPE },
	"es-US": { ...esUS },

	// French
	"fr-BE": { ...frBE },
	"fr-CA": { ...frCA },
	"fr-CH": { ...frCH },
	"fr-FR": { ...frFR },

	// Hindi
	"hi-FJ": { ...hiFJ },
	"hi-IN": { ...hiIN },

	// Japanese
	"ja-JP": { ...jaJP },

	// Korean
	"ko-KR": { ...koKR },

	// Portuguese
	"pt-BR": { ...ptBR },
	"pt-PT": { ...ptPT },

	// Chinese
	"zh-CN": { ...zhCN },
	"zh-SG": { ...zhSG },
	"zh-TW": { ...zhTW },
};

export function createI18nInstance(locale) {
	return createI18n({
		legacy: false,
		globalInjection: true,
		locale: locale || "en-US",
		fallbackLocale: "en-US",
		messages,
	});
}
