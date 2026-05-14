export const WC_TEAMS = [
  { name: "Brazil", code: "br" },
  { name: "Argentina", code: "ar" },
  { name: "France", code: "fr" },
  { name: "Germany", code: "de" },
  { name: "Spain", code: "es" },
  { name: "England", code: "gb-eng" },
  { name: "Portugal", code: "pt" },
  { name: "Netherlands", code: "nl" },
  { name: "Belgium", code: "be" },
  { name: "Croatia", code: "hr" },
  { name: "Uruguay", code: "uy" },
  { name: "Denmark", code: "dk" },
  { name: "Switzerland", code: "ch" },
  { name: "Poland", code: "pl" },
  { name: "Serbia", code: "rs" },
  { name: "Japan", code: "jp" },
  { name: "South Korea", code: "kr" },
  { name: "Australia", code: "au" },
  { name: "Morocco", code: "ma" },
  { name: "Senegal", code: "sn" },
  { name: "Ghana", code: "gh" },
  { name: "Cameroon", code: "cm" },
  { name: "Tunisia", code: "tn" },
  { name: "Ecuador", code: "ec" },
  { name: "Mexico", code: "mx" },
  { name: "United States", code: "us" },
  { name: "Canada", code: "ca" },
  { name: "Wales", code: "gb-wls" },
  { name: "Saudi Arabia", code: "sa" },
  { name: "Iran", code: "ir" },
  { name: "Qatar", code: "qa" },
  { name: "Costa Rica", code: "cr" },
];

export const getFlagUrl = (teamName: string, size: 40 | 80 | 160 = 80) => {
  const team = WC_TEAMS.find((t) => t.name.toLowerCase() === teamName.toLowerCase());
  return team ? `https://flagcdn.com/w${size}/${team.code}.png` : "";
};
