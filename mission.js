const mission = {
    x: 600,
    y: 300,
    size: 30,
    active: false
  };
  
  function drawMission(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(mission.x, mission.y, mission.size, mission.size);
  }
  
  function checkDistance() {
    const dx = player.x - mission.x;
    const dy = player.y - mission.y;
  
    const dist = Math.sqrt(dx * dx + dy * dy);
  
    if (dist < 40 && !mission.active) {
      openPopup();
      mission.active = true;
    }
  }
  
  /* POPUP */
  function openPopup() {
    document.getElementById("missionPopup").classList.remove("hidden");
  }
  
  function closePopup() {
    document.getElementById("missionPopup").classList.add("hidden");
    mission.active = false;
  }
  
  /* INICIAR MISSÃO */
  function startMission() {
    closePopup();
    document.getElementById("missionScreen").classList.remove("hidden");
  }
  
  /* RESPOSTA */
  function checkAnswer() {
    const answer = document.getElementById("answer").value;
  
    if (answer.includes("if")) {
      alert("Missão concluída!");
      document.getElementById("missionScreen").classList.add("hidden");
  
      // move missão pra outro lugar
      mission.x = Math.random() * 800;
      mission.y = Math.random() * 400;
      mission.active = false;
    } else {
      alert("Resposta incorreta!");
    }
  }