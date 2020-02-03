var fiveStarBase = [
  "Altria Pendragon",
  "Altera",
  "Zhuge Liang (El-Melloi II)",
  "Vlad III",
  "Jeanne d'Arc",
  "Orion",
  "Francis Drake",
  "Tamamo-no-Mae",
  "Jack the Ripper",
  "Mordred",
  "Nightingale",
  "Arjuna",
  "Karna",
  "Xuanzang Sanzang",
  "Ozymandias",
  "Enkidu",
  "Caster of the Nightless City",
  "Osakabehime",
  "Nikola Tesla",
  "Queen Medb",
  "Cu Chulainn (Alter)",
  "Altria Pendragon (Lancer)",
  "Quetzalcoatl"
];
var fourStarBase = [
  "Siegfried",
  "Chevalier d'Eon",
  "EMIYA",
  "Atalante",
  "Elisabeth Bathory",
  "Anne Bonny & Mary Read",
  "Marie Antoinette",
  "Saint Martha",
  "Stheno",
  "Carmilla",
  "Heracles",
  "Lancelot",
  "Tamamo Cat",
  "Nursery Rhyme",
  "Frankenstein",
  "EMIYA (Assassin)",
  "Fionn mac Cumhaill",
  "Beowulf",
  "Rama",
  "Helena Blavatsky",
  "Astolfo",
  "Ibaraki-Douji",
  "Lancelot (Saber)",
  "Nitocris",
  "Gilgamesh (Caster)",
  "Medusa (Lancer)",
  "Assassin of Shinjuku",
  "Avenger of Shinjuku",
  "Suzuka Gozen",
  "Berserker of El Dorado",
  "Assassin of the Nightless City",
  "Parvati",
  "Archer of Inferno",
  "Assassin of Paraiso",
  "Medea (Lily)",
  "Nero Claudius",
  "Altria Pendragon (Alter)",
  "Altria Pendragon (Lancer Alter)",
  "Li Shuwen",
  "Thomas Edison",
  "Tristan",
  "Gawain",
  "Gorgon",
  "EMIYA (Alter)",
  "Yagyu Munenori",
  "Katou Danzo"
];
var threeStarBase = [
  "Gaius Julius Caesar",
  "Gilles de Rais",
  "Robin Hood",
  "David",
  "Euryale",
  "Cu Chulainn",
  "Cu Chulainn (Prototype)",
  "Romulus",
  "Hektor",
  "Medusa",
  "Boudica",
  "Ushiwakamaru",
  "Alexander",
  "Medea",
  "Mephistopheles",
  "Jing Ke",
  "Lu Bu Fengxian",
  "Darius III",
  "Kiyohime",
  "Diarmuid ua Duibhne",
  "Fergus mac Roich",
  "Paracelsus von Hohenheim",
  "Charles Babbage",
  "Henry Jekyll & Hyde",
  "Billy the Kid",
  "Geronimo",
  "Kid Gilgamesh",
  "Hassan of the Hundred Personas",
  "Fuuma Kotarou",
  "Tawara Touta",
  "Hassan of the Serenity",
  "Houzouin Inshun",
  "Cu Chulainn (Caster)",
  "Gilles de Rais (Caster)",
  "Bedivere",
  "Jaguar Warrior",
  "Rider of Resistance"
];
var fiveStarEss = [
  "Formal Craft",
  "Imaginary Around",
  "Limited/Zero Over",
  "Kaleidoscope",
  "Heaven's Feel",
  "Prisma Cosmos",
  "The Black Grail",
  "Victor of the Moon",
  "Another Ending",
  "A Fragment of 2030",
  "500-Year Obsession",
  "Vessel of the Saint",
  "Ideal Holy King",
  "Volumen Hydrargyrum",
  "Before Awakening",
  "Origin Bullet",
  "Devilish Bodhisattva"
];
var fourStarEss = [
  "Iron-Willed Training",
  "Primeval Curse",
  "Projection",
  "Gandr",
  "Verdant Sound of Destruction",
  "Gem Magecraft: Antumbra",
  "Be Elegant",
  "The Imaginary Element",
  "Divine Banquet",
  "Angel's Song",
  "Seal Designation Enforcer",
  "Holy Shroud of Magdalene",
  "With One Strike",
  "Code Cast",
  "Knight's Dignity",
  "Awakened Will",
  "Necromancy",
  "Golden Millennium Tree",
  "Record Holder",
  "Art of the Poisonous Snake",
  "Gentle Affection",
  "Innocent Maiden",
  "Covering Fire",
  "Art of Death",
  "Room Guard"
];
var threeStarEss = [
  "Hydra Dagger",
  "Ryudoji Temple",
  "Mana Gauge",
  "Elixir of Love",
  "Storch Ritter",
  "Reality Marble",
  "Motored Cuirassier",
  "Potion of Youth",
  "Collection of Mysterious Masks",
  "Fragarach",
  "Inverted Moon of the Heavens",
  "Bronze-Link Manipulator",
  "Ath nGabla",
  "Bygone Dream",
  "Extremely Spicy Mapo Tofu",
  "Jeweled Sword Zelretch",
  "Battle of Camlann",
  "Seeker of Miracles",
  "Freelancer",
  "Ruined Church",
  "Marugoshi Shinji",
  "Atlas Institute",
  "Phantasmal Species",
  "Divine Construct",
  "Soul Eater"
];

// 5★
function rndChooseFromArr(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateChances() {
  let resultChances = [];
  for (let i = 0; i < 10; i++) {
    resultChances.push(Math.round(Math.random() * 100));
  }
  return resultChances;
}

function pullGacha(Chances) {
  var resultPull = [];
  for (let item of Chances) {
    if (item == 1) {
      // pull 5 star Servant
      resultPull.push(rndChooseFromArr(fiveStarBase) + " 5★ Servant");
    } else if (item > 1 && item < 6) {
      // pull 5 star Ess
      resultPull.push(rndChooseFromArr(fiveStarEss) + " 5★ Essence");
    } else if (item < 9) {
      // pull 4 star Servant
      resultPull.push(rndChooseFromArr(fourStarBase) + " 4★ Servant");
    } else if (item < 21) {
      // pull 4 star Ess
      resultPull.push(rndChooseFromArr(fourStarEss) + " 4★ Essence");
    } else if (item < 61) {
      // pull 3 star Servant
      resultPull.push(rndChooseFromArr(threeStarBase) + " 3★ Servant");
    } else if (item < 101) {
      // pull 3 star Ess
      resultPull.push(rndChooseFromArr(threeStarEss) + " 3★ Essence");
    }
  }
  return resultPull;
}

function grandRoll() {
  return pullGacha(generateChances());
}
exports.gacha = grandRoll;
