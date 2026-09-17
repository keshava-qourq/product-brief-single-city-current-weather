/**
 * icon_map -- maps OpenWeatherMap condition text to a decorative emoji and a
 * card gradient, grouped by family (thunderstorm/rain/snow/clear/cloudy/fog),
 * falling back to a thermometer for anything unrecognised.
 */

export interface ConditionStyle {
  group: string;
  emoji: string;
  gradient: string;
}

interface ConditionRule {
  keywords: string[];
  style: ConditionStyle;
}

const CONDITION_RULES: ConditionRule[] = [
  {
    keywords: ["thunder"],
    style: {
      group: "thunderstorm",
      emoji: "⛈️",
      gradient: "linear-gradient(140deg, #241D33 0%, #151A26 58%, #10151B 100%)",
    },
  },
  {
    keywords: ["drizzle"],
    style: {
      group: "rain",
      emoji: "🌦️",
      gradient: "linear-gradient(140deg, #16283154 0%, #142530 58%, #101820 100%)",
    },
  },
  {
    keywords: ["rain"],
    style: {
      group: "rain",
      emoji: "🌧️",
      gradient: "linear-gradient(140deg, #15262F 0%, #12202A 58%, #0F171D 100%)",
    },
  },
  {
    keywords: ["snow"],
    style: {
      group: "snow",
      emoji: "❄️",
      gradient: "linear-gradient(140deg, #1D2A33 0%, #15222B 58%, #101820 100%)",
    },
  },
  {
    keywords: ["clear", "sunny"],
    style: {
      group: "clear",
      emoji: "☀️",
      gradient: "linear-gradient(140deg, #2A2417 0%, #19201F 58%, #101820 100%)",
    },
  },
  {
    keywords: ["cloud", "overcast"],
    style: {
      group: "cloudy",
      emoji: "☁️",
      gradient: "linear-gradient(140deg, #1B242A 0%, #151D23 58%, #101619 100%)",
    },
  },
  {
    keywords: ["fog", "haze", "mist"],
    style: {
      group: "fog",
      emoji: "🌫️",
      gradient: "linear-gradient(140deg, #1E2427 0%, #171D21 58%, #101619 100%)",
    },
  },
];

const FALLBACK_STYLE: ConditionStyle = {
  group: "unknown",
  emoji: "🌡️",
  gradient: "linear-gradient(140deg, #1A2126 0%, #151B20 58%, #101619 100%)",
};

/**
 * Resolve the emoji/gradient/group for a reading, matching against both the
 * short `condition_main` (e.g. "Rain") and the longer `condition_description`
 * (e.g. "light rain") since either can carry the deciding keyword.
 */
export function conditionStyleFor(description: string, main: string): ConditionStyle {
  const text = `${description ?? ""} ${main ?? ""}`.toLowerCase();
  for (const rule of CONDITION_RULES) {
    if (rule.keywords.some((keyword) => text.includes(keyword))) return rule.style;
  }
  return FALLBACK_STYLE;
}

export { FALLBACK_STYLE as fallbackConditionStyle };
