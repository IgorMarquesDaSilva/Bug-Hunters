/* ============================================================
   assets/js/core/state.js  —  Estado global único do jogo
   ============================================================ */

const GameState = {
  missionsData:   null,
  roomsData:      null,
  missionSessions: {},

  difficulty:     null,
  currentRoom:    "sala1",

  score:          0,
  solvedCount:    0,
  roomScore:      0,
  clearedMinimumScore: 0,
  roomRestarts:   {
    sala1: 0,
    sala2: 0,
    sala3: 0,
    sala4: 0
  },
  bugs:           [],
  activeIdx:      -1,
  popupCooldown:  0,    // frames antes de poder abrir popup novamente

  isPaused:       true,
  isGameOver:     false,

  portal: { visible: false, triggered: false, pulse: 0 },

  collisionZones: [],
  run: null,

  startRun() {
    this.run = { startedAt: performance.now(), finishedAt: null, rooms: {} };
    this.startRoomAttempt();
  },

  elapsedTime() {
    if (!this.run) return 0;
    return Math.max(0, (this.run.finishedAt ?? performance.now()) - this.run.startedAt);
  },

  stopClock() {
    if (this.run && this.run.finishedAt === null) this.run.finishedAt = performance.now();
  },

  totalRoomRestarts() {
    return Object.values(this.roomRestarts).reduce((sum, count) => sum + count, 0);
  },

  startRoomAttempt() {
    if (!this.run) return;
    const room = this.run.rooms[this.currentRoom] ||= { attempts: [] };
    room.total = this.currentMissions().length;
    room.attempts.push({ answers: [], score: 0, outcome: 'playing' });
  },

  recordAnswer(mission, correct, points) {
    if (!this.run) return;
    if (!this.run.rooms[this.currentRoom]) this.startRoomAttempt();
    const attempt = this.run.rooms[this.currentRoom].attempts.at(-1);
    if (attempt.answers.some(answer => answer.id === mission.id)) return;
    attempt.answers.push({ id: mission.id, type: mission.type, correct, points });
    attempt.score += points;
  },

  finishRoomAttempt(outcome) {
    const attempt = this.run?.rooms[this.currentRoom]?.attempts.at(-1);
    if (attempt) attempt.outcome = outcome;
  },

  getRunSummary() {
    const rooms = Object.entries(this.run?.rooms || {}).sort(([a], [b]) => a.localeCompare(b))
      .map(([id, room]) => {
        const attempt = room.attempts.at(-1);
        return {
          id, total: room.total, answered: attempt.answers.length,
          correct: attempt.answers.filter(answer => answer.correct).length,
          score: attempt.score, outcome: attempt.outcome,
          restarts: this.roomRestarts[id],
          discarded: room.attempts.slice(0, -1).map(previous => ({
            correct: previous.answers.filter(answer => answer.correct).length,
            score: previous.score
          }))
        };
      });
    return { rooms, score: this.score, difficulty: this.difficulty,
      elapsed: this.elapsedTime(), restarts: this.totalRoomRestarts() };
  },

  resetProgress() {
    this.score          = 0;
    this.solvedCount    = 0;
    this.roomScore      = 0;
    this.clearedMinimumScore = 0;
    this.roomRestarts   = {
      sala1: 0,
      sala2: 0,
      sala3: 0,
      sala4: 0
    };
    this.activeIdx      = -1;
    this.popupCooldown  = 0;
    this.isPaused       = false;
    this.isGameOver     = false;
    this.bugs           = [];
    this.missionSessions = {};
    this.portal         = { visible: false, triggered: false, pulse: 0 };
    this.collisionZones = [];
    this.run            = null;
  },

  resetFull() {
    this.resetProgress();
    this.difficulty  = null;
    this.currentRoom = "sala1";
    this.isPaused    = true;
    resetScoreSent();
  },

  currentMissions() {
    if (!this.missionsData || !this.difficulty) return [];
    const key = `${this.difficulty}:${this.currentRoom}`;
    if (!this.missionSessions[key]) this.prepareRoomMissions();
    return this.missionSessions[key];
  },

  prepareRoomMissions() {
    const key = `${this.difficulty}:${this.currentRoom}`;
    this.missionSessions[key] = QuestionBank.select(
      this.missionsData, this.difficulty, this.currentRoom
    );
  },

  currentRoomData() {
    if (!this.roomsData) return null;
    return this.roomsData[this.currentRoom] ?? null;
  }
};
