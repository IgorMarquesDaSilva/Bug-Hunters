/* ============================================================
   assets/js/core/state.js  —  Estado global único do jogo
   ============================================================ */

const GameState = {
  missionsData:   null,
  roomsData:      null,

  difficulty:     null,
  currentRoom:    "sala1",

  score:          0,
  lives:          3,
  solvedCount:    0,
  bugs:           [],
  activeIdx:      -1,
  popupCooldown:  0,    // frames antes de poder abrir popup novamente

  isPaused:       true,
  isGameOver:     false,

  portal: { visible: false, triggered: false, pulse: 0 },

  collisionZones: [],
  bgImage:        null,

  resetProgress() {
    this.score          = 0;
    this.solvedCount    = 0;
    this.activeIdx      = -1;
    this.popupCooldown  = 0;
    this.isPaused       = false;
    this.isGameOver     = false;
    this.bugs           = [];
    this.portal         = { visible: false, triggered: false, pulse: 0 };
    this.collisionZones = [];
    this.bgImage        = null;
    this.transitioning  = false;
  },

  resetFull() {
    this.resetProgress();
    this.difficulty  = null;
    this.currentRoom = "sala1";
    this.isPaused    = true;
    this.lives       = 3;
    resetScoreSent();
  },

  currentMissions() {
    if (!this.missionsData || !this.difficulty) return [];
    return this.missionsData[this.difficulty]?.[this.currentRoom] ?? [];
  },

  currentRoomData() {
    if (!this.roomsData) return null;
    return this.roomsData[this.currentRoom] ?? null;
  }
};
