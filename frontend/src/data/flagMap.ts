export const flagMap: Record<string, string> = {
  Brazil: "br",
  Argentina: "ar",
  France: "fr",
  Germany: "de",
  Spain: "es",
  England: "gb-eng",
  Portugal: "pt",
  Netherlands: "nl",
  Japan: "jp",
  "South Korea": "kr",
  USA: "us",
  Mexico: "mx",
  Morocco: "ma",
  Senegal: "sn",
  Australia: "au",
  Croatia: "hr",
  Belgium: "be",
  Switzerland: "ch",
  Uruguay: "uy",
  Colombia: "co",
  Denmark: "dk",
  Poland: "pl",
  Serbia: "rs",
  Ecuador: "ec",
  Cameroon: "cm",
  Ghana: "gh",
  Tunisia: "tn",
  "Saudi Arabia": "sa",
  Iran: "ir",
  Qatar: "qa",
  Canada: "ca",
  Wales: "gb-wls",
  Italy: "it",
  "Costa Rica": "cr",
};

export function getFlagUrl(countryName: string, size: 40 | 80 | 160 = 80): string {
  const code = flagMap[countryName];
  if (!code) return "";
  return `https://flagcdn.com/w${size}/${code}.png`;
}