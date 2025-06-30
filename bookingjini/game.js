// Initialize the multiplayer room
const room = new WebsimSocket();

// Game variables
let canvas, ctx;
let player = { x: 100, y: 100, width: 40, height: 40, speed: 5 };
let keys = { ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false, w: false, a: false, s: false, d: false, ' ': false };
let gameItems = {};

// Game constants
const GRID_SIZE = 50;
const HOTEL_ITEMS = [
  { type: 'reception', emoji: '🛎️' },
  { type: 'room', emoji: '🛏️' },
  { type: 'pool', emoji: '🏊' },
  { type: 'restaurant', emoji: '🍽️' },
  { type: 'spa', emoji: '💆' },
  { type: 'gym', emoji: '🏋️' }
];

async function initGame() {
  // Initialize the canvas
  canvas = document.getElementById('game-canvas');
  ctx = canvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Initialize the room
  await room.initialize();

  // Set up key listeners
  setupControls();

  // Initialize player at random position
  player.x = Math.floor(Math.random() * (canvas.width - player.width));
  player.y = Math.floor(Math.random() * (canvas.height - player.height));

  // Update presence with initial player state
  updatePlayerPresence();

  // Subscribe to presence updates
  room.subscribePresence((presence) => {
    updatePlayersList();
  });

  // Subscribe to room state updates for game items
  room.subscribeRoomState((state) => {
    if (state.gameItems) {
      gameItems = state.gameItems;
    }
  });

  // Generate initial game items if this is the first client
  if (Object.keys(room.peers).length === 1) {
    generateGameItems();
  }

  // Start the game loop
  requestAnimationFrame(gameLoop);

  // Set username and avatar
  document.getElementById('username').textContent = room.peers[room.clientId].username;
  document.getElementById('user-avatar').src = room.peers[room.clientId].avatarUrl;
}

function resizeCanvas() {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}

function setupControls() {
  // Keyboard controls
  window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
      keys[e.key] = true;
    }
  });

  window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
      keys[e.key] = false;
    }
  });

  // Touch controls for mobile
  let touchStartX = 0, touchStartY = 0;
  canvas.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  });

  canvas.addEventListener('touchmove', (e) => {
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    
    const diffX = touchX - touchStartX;
    const diffY = touchY - touchStartY;
    
    // Reset all keys first
    keys.ArrowUp = keys.ArrowDown = keys.ArrowLeft = keys.ArrowRight = false;
    
    // Set keys based on touch direction
    if (Math.abs(diffX) > Math.abs(diffY)) {
      keys.ArrowLeft = diffX < 0;
      keys.ArrowRight = diffX > 0;
    } else {
      keys.ArrowUp = diffY < 0;
      keys.ArrowDown = diffY > 0;
    }
    
    e.preventDefault();
  });

  canvas.addEventListener('touchend', () => {
    keys.ArrowUp = keys.ArrowDown = keys.ArrowLeft = keys.ArrowRight = false;
  });
}

function generateGameItems() {
  const newItems = {};
  const gridCellsX = Math.floor(canvas.width / GRID_SIZE);
  const gridCellsY = Math.floor(canvas.height / GRID_SIZE);
  
  // Generate 10 random hotel items
  for (let i = 0; i < 10; i++) {
    const x = Math.floor(Math.random() * gridCellsX) * GRID_SIZE;
    const y = Math.floor(Math.random() * gridCellsY) * GRID_SIZE;
    const item = HOTEL_ITEMS[Math.floor(Math.random() * HOTEL_ITEMS.length)];
    
    newItems[`item-${i}`] = {
      type: item.type,
      emoji: item.emoji,
      x,
      y,
      collected: false
    };
  }
  
  room.updateRoomState({ gameItems: newItems });
}

function updatePlayerPresence() {
  room.updatePresence({
    x: player.x,
    y: player.y,
    score: room.presence[room.clientId]?.score || 0
  });
}

function updatePlayersList() {
  const playersList = document.getElementById('players');
  playersList.innerHTML = '';
  
  Object.values(room.peers).forEach(peer => {
    const playerPresence = room.presence[peer.id] || {};
    const score = playerPresence.score || 0;
    
    const li = document.createElement('li');
    li.innerHTML = `
      <img src="${peer.avatarUrl}" alt="${peer.username}">
      <span>${peer.username}</span>
      <span class="player-score">${score} points</span>
    `;
    playersList.appendChild(li);
  });
}

function movePlayer() {
  let moved = false;
  
  // Handle keyboard movement
  if (keys.ArrowUp || keys.w) {
    player.y = Math.max(0, player.y - player.speed);
    moved = true;
  }
  if (keys.ArrowDown || keys.s) {
    player.y = Math.min(canvas.height - player.height, player.y + player.speed);
    moved = true;
  }
  if (keys.ArrowLeft || keys.a) {
    player.x = Math.max(0, player.x - player.speed);
    moved = true;
  }
  if (keys.ArrowRight || keys.d) {
    player.x = Math.min(canvas.width - player.width, player.x + player.speed);
    moved = true;
  }
  
  // Interact with items when space is pressed
  if (keys[' ']) {
    collectItems();
    keys[' '] = false; // Reset space key to prevent continuous collection
  }
  
  // Update player presence if moved
  if (moved) {
    updatePlayerPresence();
  }
}

function collectItems() {
  Object.keys(gameItems).forEach(key => {
    const item = gameItems[key];
    if (!item.collected) {
      // Check if player is close to the item
      const dx = (player.x + player.width/2) - (item.x + GRID_SIZE/2);
      const dy = (player.y + player.height/2) - (item.y + GRID_SIZE/2);
      const distance = Math.sqrt(dx*dx + dy*dy);
      
      if (distance < player.width) {
        // Update room state to mark item as collected
        room.updateRoomState({
          gameItems: {
            [key]: {
              ...item,
              collected: true,
              collectedBy: room.clientId
            }
          }
        });
        
        // Update player score
        const currentScore = room.presence[room.clientId]?.score || 0;
        room.updatePresence({
          score: currentScore + 10
        });
      }
    }
  });
}

function drawGame() {
  // Clear canvas
  ctx.fillStyle = '#f8f9fa';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw grid
  ctx.strokeStyle = '#e9ecef';
  ctx.lineWidth = 1;
  
  for (let x = 0; x < canvas.width; x += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  
  for (let y = 0; y < canvas.height; y += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  
  // Draw game items
  Object.values(gameItems).forEach(item => {
    if (!item.collected) {
      ctx.font = '30px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.emoji, item.x + GRID_SIZE/2, item.y + GRID_SIZE/2);
    }
  });
  
  // Draw other players
  Object.entries(room.presence).forEach(([clientId, presence]) => {
    if (clientId !== room.clientId && presence.x !== undefined && presence.y !== undefined) {
      const peer = room.peers[clientId];
      if (peer) {
        // Draw player avatar (using a colored circle as placeholder)
        ctx.fillStyle = '#ec6ead';
        ctx.beginPath();
        ctx.arc(presence.x + player.width/2, presence.y + player.height/2, player.width/2, 0, Math.PI*2);
        ctx.fill();
        
        // Draw username
        ctx.fillStyle = '#333';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(peer.username, presence.x + player.width/2, presence.y - 10);
      }
    }
  });
  
  // Draw current player
  ctx.fillStyle = '#3494e6';
  ctx.beginPath();
  ctx.arc(player.x + player.width/2, player.y + player.height/2, player.width/2, 0, Math.PI*2);
  ctx.fill();
  
  // Draw player username
  const username = room.peers[room.clientId]?.username || 'Player';
  ctx.fillStyle = '#333';
  ctx.font = '12px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(username, player.x + player.width/2, player.y - 10);
}

function gameLoop() {
  movePlayer();
  drawGame();
  requestAnimationFrame(gameLoop);
}

// Initialize the game when the page loads
window.addEventListener('load', initGame);