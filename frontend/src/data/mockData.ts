export type FormResult = "W" | "D" | "L";
export type Confederation = "UEFA" | "CONMEBOL" | "CONCACAF" | "AFC" | "CAF" | "OFC";

export interface Player {
  name: string;
  position: string;
  marketValueM: number;
}

export interface Team {
  id: string;
  name: string;
  flag: string;
  confederation: Confederation;
  fifaRank: number;
  elo: number;
  form: FormResult[]; // last 10
  goalsScored: number[]; // last 10
  goalsConceded: number[]; // last 10
  squadValueM: number;
  avgAge: number;
  sentiment: { positive: number; neutral: number; negative: number };
  players: Player[];
}

const F = (s: string): FormResult[] => s.split("").map((c) => c as FormResult);

export const TEAMS: Team[] = [
  { id: "BRA", name: "Brazil", flag: "🇧🇷", confederation: "CONMEBOL", fifaRank: 1, elo: 2105, form: F("WWWDLWWWDW"), goalsScored: [3,2,4,1,0,2,3,2,1,3], goalsConceded: [0,1,1,1,2,0,1,0,1,0], squadValueM: 1180, avgAge: 27.4, sentiment: { positive: 72, neutral: 20, negative: 8 }, players: [
    { name: "Vinícius Jr.", position: "LW", marketValueM: 200 },
    { name: "Rodrygo", position: "RW", marketValueM: 110 },
    { name: "Casemiro", position: "CDM", marketValueM: 35 },
    { name: "Alisson", position: "GK", marketValueM: 40 },
    { name: "Marquinhos", position: "CB", marketValueM: 50 },
  ]},
  { id: "ARG", name: "Argentina", flag: "🇦🇷", confederation: "CONMEBOL", fifaRank: 2, elo: 2098, form: F("WWWWDWLWWW"), goalsScored: [2,3,1,2,3,1,0,4,2,2], goalsConceded: [0,1,0,1,2,1,2,1,0,1], squadValueM: 845, avgAge: 28.1, sentiment: { positive: 78, neutral: 16, negative: 6 }, players: [
    { name: "Lionel Messi", position: "RW", marketValueM: 30 },
    { name: "Julián Álvarez", position: "ST", marketValueM: 90 },
    { name: "Enzo Fernández", position: "CM", marketValueM: 75 },
    { name: "Emiliano Martínez", position: "GK", marketValueM: 30 },
    { name: "Lautaro Martínez", position: "ST", marketValueM: 110 },
  ]},
  { id: "FRA", name: "France", flag: "🇫🇷", confederation: "UEFA", fifaRank: 3, elo: 2080, form: F("WWLWWWDWWW"), goalsScored: [4,2,1,3,2,2,1,2,3,2], goalsConceded: [1,0,2,0,1,1,1,0,1,0], squadValueM: 1320, avgAge: 26.2, sentiment: { positive: 70, neutral: 22, negative: 8 }, players: [
    { name: "Kylian Mbappé", position: "LW", marketValueM: 180 },
    { name: "Antoine Griezmann", position: "CAM", marketValueM: 40 },
    { name: "Aurélien Tchouaméni", position: "CDM", marketValueM: 80 },
    { name: "William Saliba", position: "CB", marketValueM: 80 },
    { name: "Mike Maignan", position: "GK", marketValueM: 35 },
  ]},
  { id: "ENG", name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", confederation: "UEFA", fifaRank: 4, elo: 2065, form: F("WDWWLWWDWW"), goalsScored: [3,1,2,2,0,3,2,1,2,2], goalsConceded: [1,1,0,0,1,0,1,1,0,1], squadValueM: 1280, avgAge: 25.9, sentiment: { positive: 65, neutral: 25, negative: 10 }, players: [
    { name: "Jude Bellingham", position: "CAM", marketValueM: 180 },
    { name: "Harry Kane", position: "ST", marketValueM: 90 },
    { name: "Bukayo Saka", position: "RW", marketValueM: 130 },
    { name: "Phil Foden", position: "CAM", marketValueM: 130 },
    { name: "Declan Rice", position: "CDM", marketValueM: 110 },
  ]},
  { id: "ESP", name: "Spain", flag: "🇪🇸", confederation: "UEFA", fifaRank: 5, elo: 2058, form: F("WWWWLWDWWW"), goalsScored: [3,2,2,4,0,2,1,3,2,2], goalsConceded: [0,1,1,0,1,0,1,1,0,0], squadValueM: 1010, avgAge: 25.3, sentiment: { positive: 74, neutral: 18, negative: 8 }, players: [
    { name: "Lamine Yamal", position: "RW", marketValueM: 200 },
    { name: "Rodri", position: "CDM", marketValueM: 130 },
    { name: "Pedri", position: "CM", marketValueM: 100 },
    { name: "Nico Williams", position: "LW", marketValueM: 70 },
    { name: "Unai Simón", position: "GK", marketValueM: 30 },
  ]},
  { id: "POR", name: "Portugal", flag: "🇵🇹", confederation: "UEFA", fifaRank: 6, elo: 2050, form: F("WWLWWDWWWL"), goalsScored: [2,3,1,2,3,1,2,2,3,0], goalsConceded: [0,1,2,1,1,1,0,1,1,2], squadValueM: 970, avgAge: 27.1, sentiment: { positive: 64, neutral: 24, negative: 12 }, players: [
    { name: "Bruno Fernandes", position: "CAM", marketValueM: 75 },
    { name: "Cristiano Ronaldo", position: "ST", marketValueM: 30 },
    { name: "Rafael Leão", position: "LW", marketValueM: 90 },
    { name: "Rúben Dias", position: "CB", marketValueM: 75 },
    { name: "Diogo Costa", position: "GK", marketValueM: 40 },
  ]},
  { id: "GER", name: "Germany", flag: "🇩🇪", confederation: "UEFA", fifaRank: 7, elo: 2042, form: F("WDLWWWDWLW"), goalsScored: [2,1,0,3,2,2,1,3,1,2], goalsConceded: [1,1,2,1,0,1,1,0,2,1], squadValueM: 905, avgAge: 26.4, sentiment: { positive: 58, neutral: 28, negative: 14 }, players: [
    { name: "Jamal Musiala", position: "CAM", marketValueM: 130 },
    { name: "Florian Wirtz", position: "CAM", marketValueM: 130 },
    { name: "Kai Havertz", position: "ST", marketValueM: 70 },
    { name: "Joshua Kimmich", position: "CDM", marketValueM: 50 },
    { name: "Manuel Neuer", position: "GK", marketValueM: 8 },
  ]},
  { id: "NED", name: "Netherlands", flag: "🇳🇱", confederation: "UEFA", fifaRank: 8, elo: 2030, form: F("WWDWLWWDWW"), goalsScored: [2,3,1,2,0,3,2,1,2,2], goalsConceded: [0,1,1,0,2,1,1,1,0,0], squadValueM: 770, avgAge: 27.0, sentiment: { positive: 62, neutral: 26, negative: 12 }, players: [
    { name: "Virgil van Dijk", position: "CB", marketValueM: 28 },
    { name: "Frenkie de Jong", position: "CM", marketValueM: 50 },
    { name: "Cody Gakpo", position: "LW", marketValueM: 55 },
    { name: "Memphis Depay", position: "ST", marketValueM: 18 },
    { name: "Bart Verbruggen", position: "GK", marketValueM: 25 },
  ]},
  { id: "BEL", name: "Belgium", flag: "🇧🇪", confederation: "UEFA", fifaRank: 9, elo: 2018, form: F("WWLDWWDLWW"), goalsScored: [2,1,1,1,2,3,1,0,2,2], goalsConceded: [1,0,2,1,0,1,1,2,0,1], squadValueM: 620, avgAge: 27.6, sentiment: { positive: 55, neutral: 30, negative: 15 }, players: [
    { name: "Kevin De Bruyne", position: "CAM", marketValueM: 35 },
    { name: "Jérémy Doku", position: "LW", marketValueM: 60 },
    { name: "Romelu Lukaku", position: "ST", marketValueM: 25 },
    { name: "Amadou Onana", position: "CDM", marketValueM: 50 },
    { name: "Thibaut Courtois", position: "GK", marketValueM: 30 },
  ]},
  { id: "ITA", name: "Italy", flag: "🇮🇹", confederation: "UEFA", fifaRank: 10, elo: 2010, form: F("WDWLWWDWLW"), goalsScored: [1,1,2,0,2,3,1,2,1,2], goalsConceded: [0,1,1,2,1,0,1,0,2,1], squadValueM: 740, avgAge: 26.8, sentiment: { positive: 57, neutral: 28, negative: 15 }, players: [
    { name: "Federico Chiesa", position: "RW", marketValueM: 40 },
    { name: "Nicolò Barella", position: "CM", marketValueM: 75 },
    { name: "Gianluca Scamacca", position: "ST", marketValueM: 30 },
    { name: "Alessandro Bastoni", position: "CB", marketValueM: 70 },
    { name: "Gianluigi Donnarumma", position: "GK", marketValueM: 45 },
  ]},
  { id: "CRO", name: "Croatia", flag: "🇭🇷", confederation: "UEFA", fifaRank: 11, elo: 1985, form: F("WDLWWDWWLW"), goalsScored: [1,1,0,2,2,1,2,3,0,2], goalsConceded: [0,1,2,1,0,1,1,1,2,1], squadValueM: 410, avgAge: 28.9, sentiment: { positive: 60, neutral: 28, negative: 12 }, players: [
    { name: "Luka Modrić", position: "CM", marketValueM: 5 },
    { name: "Mateo Kovačić", position: "CM", marketValueM: 35 },
    { name: "Andrej Kramarić", position: "ST", marketValueM: 8 },
    { name: "Joško Gvardiol", position: "CB", marketValueM: 75 },
    { name: "Dominik Livaković", position: "GK", marketValueM: 12 },
  ]},
  { id: "URU", name: "Uruguay", flag: "🇺🇾", confederation: "CONMEBOL", fifaRank: 12, elo: 1978, form: F("WWDWLWWWDL"), goalsScored: [2,3,1,2,0,3,2,2,1,0], goalsConceded: [1,0,1,0,2,1,1,0,1,2], squadValueM: 480, avgAge: 26.1, sentiment: { positive: 63, neutral: 25, negative: 12 }, players: [
    { name: "Federico Valverde", position: "CM", marketValueM: 100 },
    { name: "Darwin Núñez", position: "ST", marketValueM: 65 },
    { name: "Ronald Araújo", position: "CB", marketValueM: 70 },
    { name: "Manuel Ugarte", position: "CDM", marketValueM: 40 },
    { name: "Sergio Rochet", position: "GK", marketValueM: 6 },
  ]},
  { id: "USA", name: "USA", flag: "🇺🇸", confederation: "CONCACAF", fifaRank: 13, elo: 1955, form: F("WDWWLWDWWL"), goalsScored: [2,1,2,3,0,2,1,3,2,1], goalsConceded: [1,1,0,1,2,1,1,0,1,2], squadValueM: 360, avgAge: 25.7, sentiment: { positive: 60, neutral: 30, negative: 10 }, players: [
    { name: "Christian Pulisic", position: "RW", marketValueM: 35 },
    { name: "Weston McKennie", position: "CM", marketValueM: 25 },
    { name: "Tyler Adams", position: "CDM", marketValueM: 22 },
    { name: "Antonee Robinson", position: "LB", marketValueM: 25 },
    { name: "Matt Turner", position: "GK", marketValueM: 8 },
  ]},
  { id: "MEX", name: "Mexico", flag: "🇲🇽", confederation: "CONCACAF", fifaRank: 14, elo: 1942, form: F("WDLWWDWLWW"), goalsScored: [1,1,0,2,3,1,2,0,2,2], goalsConceded: [0,1,1,1,0,1,1,2,1,0], squadValueM: 250, avgAge: 27.3, sentiment: { positive: 55, neutral: 30, negative: 15 }, players: [
    { name: "Edson Álvarez", position: "CDM", marketValueM: 35 },
    { name: "Hirving Lozano", position: "LW", marketValueM: 18 },
    { name: "Santiago Giménez", position: "ST", marketValueM: 30 },
    { name: "César Montes", position: "CB", marketValueM: 12 },
    { name: "Guillermo Ochoa", position: "GK", marketValueM: 1 },
  ]},
  { id: "JPN", name: "Japan", flag: "🇯🇵", confederation: "AFC", fifaRank: 15, elo: 1930, form: F("WWWLWWDWWL"), goalsScored: [3,2,3,1,2,2,1,2,3,0], goalsConceded: [0,1,0,2,1,1,1,0,0,1], squadValueM: 320, avgAge: 26.3, sentiment: { positive: 68, neutral: 24, negative: 8 }, players: [
    { name: "Takefusa Kubo", position: "RW", marketValueM: 60 },
    { name: "Wataru Endo", position: "CDM", marketValueM: 12 },
    { name: "Kaoru Mitoma", position: "LW", marketValueM: 50 },
    { name: "Takehiro Tomiyasu", position: "CB", marketValueM: 25 },
    { name: "Zion Suzuki", position: "GK", marketValueM: 10 },
  ]},
  { id: "MAR", name: "Morocco", flag: "🇲🇦", confederation: "CAF", fifaRank: 16, elo: 1920, form: F("WWLDWWDWLW"), goalsScored: [2,2,0,1,2,1,1,2,0,2], goalsConceded: [0,1,2,1,0,0,1,1,2,1], squadValueM: 290, avgAge: 27.0, sentiment: { positive: 70, neutral: 22, negative: 8 }, players: [
    { name: "Achraf Hakimi", position: "RB", marketValueM: 65 },
    { name: "Hakim Ziyech", position: "CAM", marketValueM: 12 },
    { name: "Sofyan Amrabat", position: "CDM", marketValueM: 25 },
    { name: "Youssef En-Nesyri", position: "ST", marketValueM: 25 },
    { name: "Yassine Bounou", position: "GK", marketValueM: 10 },
  ]},
];

// Add lighter records for groups (B-side of each group)
const EXTRA: Team[] = [
  { id: "SEN", name: "Senegal", flag: "🇸🇳", confederation: "CAF", fifaRank: 17, elo: 1900, form: F("WDLWWDWLWW"), goalsScored: [2,1,0,2,3,1,2,0,2,1], goalsConceded: [0,1,1,1,0,1,1,2,0,1], squadValueM: 270, avgAge: 27.5, sentiment: { positive: 62, neutral: 26, negative: 12 }, players: [{name:"Sadio Mané",position:"LW",marketValueM:18},{name:"Kalidou Koulibaly",position:"CB",marketValueM:15},{name:"Édouard Mendy",position:"GK",marketValueM:8}]},
  { id: "SUI", name: "Switzerland", flag: "🇨🇭", confederation: "UEFA", fifaRank: 18, elo: 1895, form: F("WDLDWWLWDW"), goalsScored: [1,1,0,1,2,2,0,2,1,2], goalsConceded: [0,1,2,1,1,0,1,0,1,1], squadValueM: 310, avgAge: 27.8, sentiment: { positive: 55, neutral: 32, negative: 13 }, players: [{name:"Granit Xhaka",position:"CM",marketValueM:25},{name:"Manuel Akanji",position:"CB",marketValueM:35},{name:"Yann Sommer",position:"GK",marketValueM:8}]},
  { id: "DEN", name: "Denmark", flag: "🇩🇰", confederation: "UEFA", fifaRank: 19, elo: 1888, form: F("WLDWWDWLWW"), goalsScored: [2,0,1,2,2,1,2,0,2,2], goalsConceded: [1,2,1,0,1,1,0,1,0,1], squadValueM: 360, avgAge: 27.2, sentiment: { positive: 58, neutral: 28, negative: 14 }, players: [{name:"Christian Eriksen",position:"CAM",marketValueM:18},{name:"Pierre-Emile Højbjerg",position:"CDM",marketValueM:25},{name:"Kasper Schmeichel",position:"GK",marketValueM:2}]},
  { id: "POL", name: "Poland", flag: "🇵🇱", confederation: "UEFA", fifaRank: 20, elo: 1875, form: F("WLWDWLDWWL"), goalsScored: [1,0,2,1,2,0,1,2,2,0], goalsConceded: [0,2,1,1,0,1,1,1,0,2], squadValueM: 240, avgAge: 28.0, sentiment: { positive: 50, neutral: 32, negative: 18 }, players: [{name:"Robert Lewandowski",position:"ST",marketValueM:15},{name:"Piotr Zieliński",position:"CM",marketValueM:25},{name:"Wojciech Szczęsny",position:"GK",marketValueM:8}]},
  { id: "SRB", name: "Serbia", flag: "🇷🇸", confederation: "UEFA", fifaRank: 21, elo: 1860, form: F("WDLWWDLWLW"), goalsScored: [2,1,0,2,2,1,0,2,0,2], goalsConceded: [1,1,2,1,0,1,2,0,1,1], squadValueM: 280, avgAge: 27.9, sentiment: { positive: 53, neutral: 30, negative: 17 }, players: [{name:"Dušan Vlahović",position:"ST",marketValueM:35},{name:"Sergej Milinković-Savić",position:"CM",marketValueM:30}]},
  { id: "ECU", name: "Ecuador", flag: "🇪🇨", confederation: "CONMEBOL", fifaRank: 22, elo: 1850, form: F("WLDWWWDLWL"), goalsScored: [2,0,1,2,3,2,1,0,2,0], goalsConceded: [1,2,1,0,1,0,1,2,0,1], squadValueM: 200, avgAge: 25.4, sentiment: { positive: 56, neutral: 32, negative: 12 }, players: [{name:"Moisés Caicedo",position:"CDM",marketValueM:80},{name:"Enner Valencia",position:"ST",marketValueM:6}]},
  { id: "AUS", name: "Australia", flag: "🇦🇺", confederation: "AFC", fifaRank: 23, elo: 1840, form: F("WDWLWWDLWW"), goalsScored: [1,1,2,0,2,2,1,0,2,2], goalsConceded: [0,1,1,2,1,0,1,1,0,0], squadValueM: 130, avgAge: 27.0, sentiment: { positive: 58, neutral: 30, negative: 12 }, players: [{name:"Mathew Ryan",position:"GK",marketValueM:2},{name:"Aaron Mooy",position:"CM",marketValueM:4}]},
  { id: "KOR", name: "South Korea", flag: "🇰🇷", confederation: "AFC", fifaRank: 24, elo: 1832, form: F("WWDWLDWLWW"), goalsScored: [2,2,1,2,0,1,2,0,3,2], goalsConceded: [0,1,1,1,2,1,1,2,0,1], squadValueM: 220, avgAge: 26.5, sentiment: { positive: 62, neutral: 28, negative: 10 }, players: [{name:"Son Heung-min",position:"LW",marketValueM:55},{name:"Kim Min-jae",position:"CB",marketValueM:60}]},
  { id: "TUN", name: "Tunisia", flag: "🇹🇳", confederation: "CAF", fifaRank: 25, elo: 1820, form: F("WLDWLWDLWW"), goalsScored: [1,0,1,2,0,2,1,0,2,2], goalsConceded: [0,1,1,0,2,1,1,2,0,1], squadValueM: 95, avgAge: 27.8, sentiment: { positive: 50, neutral: 34, negative: 16 }, players: [{name:"Wahbi Khazri",position:"CAM",marketValueM:3}]},
  { id: "CRC", name: "Costa Rica", flag: "🇨🇷", confederation: "CONCACAF", fifaRank: 26, elo: 1810, form: F("WDLWWLDWLD"), goalsScored: [1,1,0,2,2,0,1,2,0,1], goalsConceded: [0,1,1,1,0,1,1,0,2,1], squadValueM: 70, avgAge: 28.4, sentiment: { positive: 48, neutral: 36, negative: 16 }, players: [{name:"Keylor Navas",position:"GK",marketValueM:3}]},
  { id: "CMR", name: "Cameroon", flag: "🇨🇲", confederation: "CAF", fifaRank: 27, elo: 1800, form: F("WLDWLWDLWW"), goalsScored: [2,0,1,2,0,2,1,0,2,2], goalsConceded: [1,2,1,0,2,1,1,2,0,1], squadValueM: 140, avgAge: 26.7, sentiment: { positive: 52, neutral: 32, negative: 16 }, players: [{name:"André Onana",position:"GK",marketValueM:25}]},
  { id: "GHA", name: "Ghana", flag: "🇬🇭", confederation: "CAF", fifaRank: 28, elo: 1790, form: F("WLDWLLDWWL"), goalsScored: [1,0,1,2,0,0,1,2,2,0], goalsConceded: [0,2,1,1,2,2,1,0,0,1], squadValueM: 110, avgAge: 26.1, sentiment: { positive: 49, neutral: 34, negative: 17 }, players: [{name:"Mohammed Kudus",position:"CAM",marketValueM:50}]},
  { id: "QAT", name: "Qatar", flag: "🇶🇦", confederation: "AFC", fifaRank: 29, elo: 1780, form: F("LWDLWLDWLW"), goalsScored: [0,2,1,0,2,0,1,2,0,2], goalsConceded: [2,1,1,2,1,2,1,0,2,1], squadValueM: 50, avgAge: 27.4, sentiment: { positive: 46, neutral: 36, negative: 18 }, players: [{name:"Akram Afif",position:"LW",marketValueM:5}]},
  { id: "KSA", name: "Saudi Arabia", flag: "🇸🇦", confederation: "AFC", fifaRank: 30, elo: 1770, form: F("WLDWLLDWLW"), goalsScored: [1,0,1,2,0,0,1,2,0,2], goalsConceded: [0,2,1,1,2,2,1,0,2,1], squadValueM: 30, avgAge: 27.8, sentiment: { positive: 47, neutral: 36, negative: 17 }, players: [{name:"Salem Al-Dawsari",position:"LW",marketValueM:6}]},
  { id: "CAN", name: "Canada", flag: "🇨🇦", confederation: "CONCACAF", fifaRank: 31, elo: 1760, form: F("WDLWLDWLDW"), goalsScored: [1,1,0,2,0,1,2,0,1,2], goalsConceded: [0,1,2,1,2,1,1,2,1,1], squadValueM: 150, avgAge: 26.0, sentiment: { positive: 51, neutral: 34, negative: 15 }, players: [{name:"Alphonso Davies",position:"LB",marketValueM:60}]},
  { id: "WAL", name: "Wales", flag: "🏴󠁧󠁢󠁷󠁬󠁳󠁿", confederation: "UEFA", fifaRank: 32, elo: 1750, form: F("LDWLWLDWLW"), goalsScored: [0,1,2,0,2,0,1,2,0,2], goalsConceded: [2,1,1,2,0,2,1,1,2,1], squadValueM: 130, avgAge: 28.6, sentiment: { positive: 45, neutral: 38, negative: 17 }, players: [{name:"Aaron Ramsey",position:"CM",marketValueM:3}]},
];

TEAMS.push(...EXTRA);

export const teamById = (id: string) => TEAMS.find((t) => t.id === id)!;

// Trending predictions
export interface MatchPrediction {
  id: string;
  homeId: string;
  awayId: string;
  homeProb: number;
  drawProb: number;
  awayProb: number;
  predictedScore: [number, number];
  confidence: number;
}

export const TRENDING: MatchPrediction[] = [
  { id: "m1", homeId: "BRA", awayId: "ARG", homeProb: 48, drawProb: 22, awayProb: 30, predictedScore: [2,1], confidence: 78 },
  { id: "m2", homeId: "FRA", awayId: "ENG", homeProb: 42, drawProb: 26, awayProb: 32, predictedScore: [2,1], confidence: 71 },
  { id: "m3", homeId: "ESP", awayId: "GER", homeProb: 46, drawProb: 27, awayProb: 27, predictedScore: [2,1], confidence: 74 },
  { id: "m4", homeId: "POR", awayId: "NED", homeProb: 38, drawProb: 28, awayProb: 34, predictedScore: [1,1], confidence: 65 },
  { id: "m5", homeId: "BEL", awayId: "ITA", homeProb: 35, drawProb: 30, awayProb: 35, predictedScore: [1,1], confidence: 62 },
  { id: "m6", homeId: "URU", awayId: "JPN", homeProb: 52, drawProb: 24, awayProb: 24, predictedScore: [2,0], confidence: 76 },
];

// Tournament group structure (8 groups of 4)
export const GROUP_STRUCTURE: { group: string; teamIds: string[] }[] = [
  { group: "A", teamIds: ["BRA", "SUI", "CMR", "QAT"] },
  { group: "B", teamIds: ["ARG", "POL", "MEX", "KSA"] },
  { group: "C", teamIds: ["FRA", "DEN", "TUN", "AUS"] },
  { group: "D", teamIds: ["ENG", "USA", "WAL", "CRC"] },
  { group: "E", teamIds: ["ESP", "GER", "JPN", "CAN"] },
  { group: "F", teamIds: ["POR", "URU", "KOR", "GHA"] },
  { group: "G", teamIds: ["NED", "ECU", "SEN", "MAR"] },
  { group: "H", teamIds: ["BEL", "CRO", "SRB", "ITA"] },
];

// Accuracy trend (last 12 months)
export const ACCURACY_TREND = [
  { month: "Jan", accuracy: 78 },
  { month: "Feb", accuracy: 80 },
  { month: "Mar", accuracy: 82 },
  { month: "Apr", accuracy: 81 },
  { month: "May", accuracy: 84 },
  { month: "Jun", accuracy: 86 },
  { month: "Jul", accuracy: 87 },
  { month: "Aug", accuracy: 89 },
  { month: "Sep", accuracy: 88 },
  { month: "Oct", accuracy: 91 },
  { month: "Nov", accuracy: 92 },
  { month: "Dec", accuracy: 94 },
];

export const sumGoals = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
export const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;