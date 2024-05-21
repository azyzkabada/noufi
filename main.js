function TheGame() {
  return {
    cartes: ["1c", "2c", "3c", "4c", "5c", "6c", "7c", "8c", "9c", "10c"],
    cardRandom: cardRandom,
    kaff: kaff,
    card: card,
    player1: { name: "" },
    player2: { name: "" },
    makePlayer: makePlayer,
    distributCards: distributCards,
    choseCard: choseCard,
    winner: winner,
    whoIsFirst: whoIsFirst,
    tempocard: [],
  };
}

// Mélanger les cartes avec l'algorithme de Fisher-Yates
const cardRandom = function (array = this.cartes) {
  let randomCard = array.slice();
  for (let i = randomCard.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = randomCard[i];
    randomCard[i] = randomCard[j];
    randomCard[j] = temp;
  }
  return randomCard;
};

// Prendre 3 cartes de la pile mélangée
const kaff = function (arr = this.cartes) {
  let newKaff = this.cardRandom(arr);
  return newKaff.slice(0, 3);
};

// Prendre une carte de la pile mélangée
const card = function (arr = this.cartes) {
  let newKaff = this.cardRandom(arr);
  return newKaff[0];
};

// Créer un joueur avec un nom et un numéro (1 ou 2)
const makePlayer = function (name, nbr) {
  if (nbr === 1) {
    this.player1 = { name, kaff: [], score: 0 };
  }
  if (nbr === 2) {
    this.player2 = { name, kaff: [], score: 0 };
  }
};

// Distribuer les cartes aux joueurs
const distributCards = function (nbr1 = 0, nbr2 = 0) {
  if (nbr1 === 1) {
    this.player1.kaff = this.kaff();
  }
  if (nbr2 === 2) {
    this.player2.kaff = this.kaff();
  }
};

// Choisir une carte pour déterminer qui commence
const choseCard = function (nbr1 = 0, nbr2 = 0) {
  if (nbr1 === 1) {
    this.player1.card = this.card();
  }
  if (nbr2 === 2) {
    this.player2.card = this.card(this.tempocard);
  }
};

// Déterminer le gagnant d'une manche
const winner = function () {
  // Créer une copie des arrays pour les manipuler
  let kaff1 = this.player1.kaff.slice();
  let kaff2 = this.player2.kaff.slice();

  // Filtrer selon les cartes non autorisées (8, 9, 10)
  kaff1 = kaff1.filter(
    (elem) =>
      ![
        "8p",
        "8t",
        "8c",
        "8l",
        "9p",
        "9t",
        "9c",
        "9l",
        "10p",
        "10t",
        "10c",
        "10l",
      ].includes(elem)
  );
  kaff2 = kaff2.filter(
    (elem) =>
      ![
        "8p",
        "8t",
        "8c",
        "8l",
        "9p",
        "9t",
        "9c",
        "9l",
        "10p",
        "10t",
        "10c",
        "10l",
      ].includes(elem)
  );

  // Calculer le total des cartes après filtrage
  kaff1 = kaff1.reduce((a, b) => parseInt(a) + parseInt(b), 0);
  kaff2 = kaff2.reduce((a, b) => parseInt(a) + parseInt(b), 0);

  // Fonction pour enlever les dizaines
  const enleverDix = function (kaff) {
    while (kaff >= 10) {
      kaff -= 10;
    }
    return kaff;
  };

  let scorep1 = enleverDix(kaff1);
  let scorep2 = enleverDix(kaff2);

  let round = { p1: scorep1, p2: scorep2 };
  this.games.push(round);

  if (scorep1 > scorep2) {
    this.player1.score++;
    return 1;
  } else if (scorep1 < scorep2) {
    this.player2.score++;
    return 2;
  } else {
    return 0; // Égalité, on recommence
  }
};

// Déterminer qui commence en premier
const whoIsFirst = function () {
  if (parseInt(this.player1.card) > parseInt(this.player2.card)) {
    return 1;
  } else if (parseInt(this.player1.card) < parseInt(this.player2.card)) {
    return 2;
  } else {
    // Si les cartes sont égales, retirer les cartes et recommencer
    this.choseCard(1, 2);
    return this.whoIsFirst();
  }
};
const removeCard = function (array, number) {
  let newArray = array.slice();
  return newArray.filter(function (value) {
    return value !== number;
  });
};
let Noufi = TheGame();

$("#start-game").click(function () {
  $("#start").hide();
  $("#configscreen").css("display", "flex");
});

$("#startGame2").click(function () {
  let name1 = "";
  let name2 = "";
  $("#configscreen").hide();
  name1 = $("#name1").val(); //name1
  name2 = $("#name2").val(); //name1
  $("#whoisfirst").css("display", "flex");
  Noufi.player1.name = name1;
  Noufi.player2.name = name2;
  console.log(Noufi.player1.name);
  $("#player1name").text(Noufi.player1.name);
  $("#player2name").text(Noufi.player2.name);
});

$("#chosecard1").click(function () {
  Noufi.choseCard(1);

  console.log(Noufi.player1);
  let str = Noufi.player1.card;
  Noufi.tempocard = removeCard(Noufi.cartes, str);
  console.log(str);
  str = "./assets/cards/" + str + ".svg";
  $("#cardo").attr("src", str);
  $("#chosecard1").css("display", "none");
  $("#chosecard2").css("display", "flex");
  $("#scoreplayer1").text(Noufi.player1.card);
  $("#player2title").css("display", "flex");
  $("#player1name").text(Noufi.player2.name);
});
$("#chosecard2").click(function () {
  Noufi.choseCard(0, 2);
  console.log(Noufi.player1);
  let str = Noufi.player2.card;
  console.log(str);
  str = "./assets/cards/" + str + ".svg";
  $("#cardo").attr("src", str);

  $("#scoreplayer2").text(Noufi.player2.card);

  $("#player2title").css("display", "flex");
  $("#chosecard2").css("display", "none");
  let check = Noufi.whoIsFirst();
  $("#player1name").text(`Le joueur numéro ${check} commence à jouer.`);
  $("#next").css("display", "flex");
  let player = global[`Noufi.player${check}.card`];

  let screen = `./assets/cards/` + player + `.svg`;
  $("#cardo").attr("src", screen);
});
