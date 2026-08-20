let players = [];

const playerInput = document.getElementById('player-input');
const addPlayerBtn = document.getElementById('add-player-btn');
const generateBracketBtn = document.getElementById('generate-bracket-btn');
const resetBtn = document.getElementById('reset-btn');
const simulationStatus = document.getElementById('simulation-status');
const playerCount = document.getElementById('player-count');
const bracketWrapper = document.querySelector('.bracket-wrapper');
const bracketLines = document.getElementById('bracket-lines');
const zoomInBtn = document.getElementById('zoom-in-btn');
const zoomOutBtn = document.getElementById('zoom-out-btn');
const zoomResetBtn = document.getElementById('zoom-reset-btn');
const zoomLevel = document.getElementById('zoom-level');
const removeBracketPlayerBtn = document.getElementById('remove-bracket-player-btn');
const toggleViewControlsBtn = document.getElementById('toggle-view-controls-btn');
const endBracketBtn = document.getElementById('end-bracket-btn');
const homeView = document.getElementById('home-view');
const bracketView = document.getElementById('bracket-view');
const scoreView = document.getElementById('score-view');
const bracketControls = document.getElementById('bracket-controls');
const teamCountSelect = document.getElementById('team-count-select');
const teamBoard = document.getElementById('team-board');
const teamRoster = document.getElementById('team-roster');
const scoreSetup = document.querySelector('.score-setup');
const manageTeamPlayersBtn = document.getElementById('manage-team-players-btn');
const endTeamsBtn = document.getElementById('end-teams-btn');
const teamPlayerInput = document.getElementById('team-player-input');
const addTeamPlayerBtn = document.getElementById('add-team-player-btn');
const teamRosterList = document.getElementById('team-roster-list');

let fitScale = 1;
let zoomFactor = 1;
let panX = 0;
let panY = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let removeBracketPlayerMode = false;
let lineAnimationFrame = null;
let teams = [];
let teamPlayers = [];

const bracketContainer = document.getElementById('bracket-container');
const lobbyContainer = document.getElementById('lobby-container');
const lobby = document.getElementById('lobby');

document.getElementById('open-bracket-btn').addEventListener('click', () => showView(bracketView));
document.getElementById('open-score-btn').addEventListener('click', () => showView(scoreView));
document.getElementById('bracket-back-btn').addEventListener('click', endTournament);
endBracketBtn.addEventListener('click', endTournament);
document.getElementById('score-back-btn').addEventListener('click', () => showView(homeView));
document.getElementById('create-teams-btn').addEventListener('click', createTeams);
endTeamsBtn.addEventListener('click', endTeams);
removeBracketPlayerBtn.addEventListener('click', () => {
    removeBracketPlayerMode = !removeBracketPlayerMode;
    removeBracketPlayerBtn.classList.toggle('active-control', removeBracketPlayerMode);
    removeBracketPlayerBtn.textContent = removeBracketPlayerMode ? 'Entfernen aktiv' : 'Spieler entfernen';
});
toggleViewControlsBtn.addEventListener('click', () => {
    document.querySelector('.view-controls').classList.toggle('is-collapsed');
});
manageTeamPlayersBtn.addEventListener('click', () => {
    teamRoster.hidden = !teamRoster.hidden;
    manageTeamPlayersBtn.textContent = teamRoster.hidden ? 'Spieler verwalten' : 'Spieler ausblenden';
});
addTeamPlayerBtn.addEventListener('click', addTeamPlayer);
teamPlayerInput.addEventListener('keypress', event => {
    if (event.key === 'Enter') addTeamPlayer();
});

function showView(view) {
    [homeView, bracketView, scoreView].forEach(currentView => {
        currentView.hidden = currentView !== view;
    });
    bracketControls.hidden = view !== bracketView;
    if (view === scoreView && teamPlayers.length === 0 && players.length > 0) {
        teamPlayers = players.map(name => ({ name, teamIndex: null }));
        renderTeamRoster();
    }
}

function createTeams() {
    if (teamPlayers.length < 2) {
        alert('Füge mindestens zwei Spieler hinzu, bevor du die Teams startest.');
        return;
    }

    const teamCount = Number(teamCountSelect.value);
    teams = Array.from({ length: teamCount }, (_, index) => ({
        name: `Team ${index + 1}`,
        score: 0
    }));
    teamPlayers = teamPlayers.map((player, index) => ({
        ...player,
        teamIndex: index % teamCount
    }));
    scoreSetup.hidden = true;
    manageTeamPlayersBtn.hidden = false;
    endTeamsBtn.hidden = false;
    teamRoster.hidden = true;
    manageTeamPlayersBtn.textContent = 'Spieler verwalten';
    teamBoard.hidden = false;
    renderTeams();
    scoreView.scrollTo({ top: 0, behavior: 'smooth' });
}

function endTeams() {
    players = [];
    teams = [];
    teamPlayers = [];
    lobby.innerHTML = '';
    bracketContainer.innerHTML = '';
    bracketContainer.style.display = 'none';
    lobbyContainer.style.display = 'block';
    updatePlayerCount();
    bracketContainer.innerHTML = '';
    teamBoard.innerHTML = '';
    teamBoard.hidden = true;
    teamRosterList.innerHTML = '';
    teamRoster.hidden = false;
    scoreSetup.hidden = false;
    manageTeamPlayersBtn.hidden = true;
    endTeamsBtn.hidden = true;
    manageTeamPlayersBtn.textContent = 'Spieler verwalten';
    showView(homeView);
}

function endTournament() {
    players = [];
    teams = [];
    teamPlayers = [];
    lobby.innerHTML = '';
    bracketContainer.innerHTML = '';
    bracketContainer.style.display = 'none';
    lobbyContainer.style.display = 'block';
    simulationStatus.textContent = '';
    updatePlayerCount();
    teamBoard.innerHTML = '';
    teamBoard.hidden = true;
    teamRosterList.innerHTML = '';
    teamRoster.hidden = false;
    scoreSetup.hidden = false;
    manageTeamPlayersBtn.hidden = true;
    endTeamsBtn.hidden = true;
    showView(homeView);
}

function renderTeams() {
    teamBoard.innerHTML = '';
    teams.forEach((team, index) => {
        const card = document.createElement('article');
        card.className = 'team-card';
        card.style.setProperty('--team-accent', ['#f5c71a', '#00b87a', '#ef7356', '#76a8ff'][index]);

        const label = document.createElement('span');
        label.className = 'team-label';
        label.textContent = `TEAM ${String(index + 1).padStart(2, '0')}`;

        const nameInput = document.createElement('input');
        nameInput.className = 'team-name-input';
        nameInput.value = team.name;
        nameInput.setAttribute('aria-label', `Name für Team ${index + 1}`);
        nameInput.addEventListener('input', event => {
            team.name = event.target.value || `Team ${index + 1}`;
        });

        const score = document.createElement('strong');
        score.className = 'team-score';
        score.textContent = team.score;

        const scoreActions = document.createElement('div');
        scoreActions.className = 'score-actions';
        [
            ['-1', -1],
            ['+1', 1],
            ['+5', 5]
        ].forEach(([labelText, amount]) => {
            const button = document.createElement('button');
            button.type = 'button';
            button.textContent = labelText;
            button.addEventListener('click', () => {
                team.score = Math.max(0, team.score + amount);
                score.textContent = team.score;
            });
            scoreActions.appendChild(button);
        });

        const members = document.createElement('div');
        members.className = 'team-members';
        teamPlayers.filter(player => player.teamIndex === index).forEach(player => {
            const member = document.createElement('span');
            member.textContent = player.name;
            members.appendChild(member);
        });
        if (!members.children.length) members.textContent = 'Noch keine Spieler';

        card.append(label, nameInput, score, members, scoreActions);
        teamBoard.appendChild(card);
    });
    renderTeamRoster();
}

function addTeamPlayer() {
    const name = teamPlayerInput.value.trim();
    if (!name || teamPlayers.some(player => player.name.toLowerCase() === name.toLowerCase())) return;
    const teamCount = teams.length || Number(teamCountSelect.value);
    teamPlayers.push({ name, teamIndex: teamPlayers.length % teamCount });
    teamPlayerInput.value = '';
    if (teams.length) renderTeams();
    else renderTeamRoster();
}

function removeTeamPlayer(playerIndex) {
    teamPlayers.splice(playerIndex, 1);
    if (teams.length) renderTeams();
    else renderTeamRoster();
}

function renderTeamRoster() {
    teamRosterList.innerHTML = '';
    if (!teamPlayers.length) {
        teamRosterList.textContent = 'Noch keine Spieler angelegt.';
        return;
    }

    teamPlayers.forEach((player, playerIndex) => {
        const row = document.createElement('div');
        row.className = 'roster-row';
        const name = document.createElement('strong');
        name.textContent = player.name;
        const teamSelect = document.createElement('select');
        teams.forEach((team, teamIndex) => {
            const option = document.createElement('option');
            option.value = teamIndex;
            option.textContent = team.name;
            option.selected = player.teamIndex === teamIndex;
            teamSelect.appendChild(option);
        });
        teamSelect.addEventListener('change', event => {
            teamPlayers[playerIndex].teamIndex = Number(event.target.value);
            renderTeams();
        });
        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'roster-remove-btn';
        removeButton.title = `${player.name} entfernen`;
        removeButton.textContent = '×';
        removeButton.addEventListener('click', () => removeTeamPlayer(playerIndex));
        if (teams.length) row.append(name, teamSelect, removeButton);
        else row.append(name, document.createTextNode('Wird beim Start verteilt'), removeButton);
        teamRosterList.appendChild(row);
    });
}

playerInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addPlayer();
});

addPlayerBtn.addEventListener('click', addPlayer);

function addPlayer() {
    const name = playerInput.value.trim();
    if (name) {
        if (players.map(p => p.toLowerCase()).includes(name.toLowerCase())) {
            alert('Dieser Kämpfer ist bereits angemeldet!');
            return;
        }

        players.push(name);
        playerInput.value = '';
        playerInput.focus();
        updatePlayerCount();
        renderLobby();
    }
}

function renderLobby() {
    lobby.innerHTML = '';
    players.forEach((name, index) => {
        const card = document.createElement('div');
        card.className = 'lobby-card';
        const label = document.createElement('span');
        label.textContent = name;
        const removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.className = 'remove-player-btn';
        removeButton.title = `${name} entfernen`;
        removeButton.textContent = '×';
        removeButton.addEventListener('click', () => removePlayer(index));
        card.append(label, removeButton);
        lobby.appendChild(card);
    });
}

function removePlayer(index) {
    const [removedPlayer] = players.splice(index, 1);
    if (!removedPlayer) return;
    teamPlayers = teamPlayers.filter(player => player.name !== removedPlayer);
    updatePlayerCount();
    renderLobby();
    if (teams.length) renderTeams();
    else renderTeamRoster();
}

resetBtn.addEventListener('click', () => {
    if(confirm('Willst du das Turnier wirklich komplett zurücksetzen?')) {
        players = [];
        lobby.innerHTML = '';
        lobbyContainer.style.display = 'block';
        bracketContainer.style.display = 'none';
        bracketContainer.innerHTML = '';
        bracketContainer.style.transform = 'scale(1)'; 
        updatePlayerCount();
        simulationStatus.textContent = '';
    }
});

function updatePlayerCount() {
    const noun = players.length === 1 ? 'Kämpfer' : 'Kämpfer';
    playerCount.textContent = `${players.length} ${noun} beigetreten`;
}

function generateTournamentPlayers(playersList, nextPowerOf2) {
    const numMatches = nextPowerOf2 / 2;
    const playersCopy = shuffle([...playersList]);
    const fullMatchCount = Math.max(1, playersList.length - numMatches);
    const matches = [];

    for (let i = 0; i < fullMatchCount; i++) {
        matches.push({
            p1: playersCopy.pop(),
            p2: playersCopy.pop()
        });
    }

    while (playersCopy.length > 0) {
        matches.push({
            p1: playersCopy.pop(),
            p2: 'Freilos'
        });
    }

    const randomizedMatches = shuffle(matches);
    const tournamentPlayers = [];
    for (let i = 0; i < numMatches; i++) {
        const match = randomizedMatches[i] || { p1: 'Freilos', p2: 'Freilos' };
        tournamentPlayers.push(match.p1, match.p2);
    }
    return tournamentPlayers;
}

function shuffle(items) {
    for (let index = items.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [items[index], items[randomIndex]] = [items[randomIndex], items[index]];
    }
    return items;
}

generateBracketBtn.addEventListener('click', () => {
    if (players.length < 2) {
        alert('Du brauchst mindestens 2 Kämpfer für ein Duell!');
        return;
    }

    lobbyContainer.style.display = 'none';
    bracketContainer.style.display = 'flex';

    const numPlayers = players.length;
    const nextPowerOf2 = Math.pow(2, Math.ceil(Math.log2(numPlayers)));

    const tournamentPlayers = generateTournamentPlayers(players, nextPowerOf2);
    renderSplitBracket(tournamentPlayers);
    document.querySelector('.view-controls').classList.add('is-collapsed');
    zoomFactor = 1;
    panX = 0;
    panY = 0;
    simulationStatus.textContent = 'Bereit für deine Auswahl.';
    
    autoScaleBracket();
});

function createMatchDOM(round, matchIndex, startingPlayers) {
    const matchDiv = document.createElement('div');
    matchDiv.className = 'match';
    
    const p1 = createPlayerElement(round, matchIndex, 0);
    const p2 = createPlayerElement(round, matchIndex, 1);

    p1.addEventListener('click', () => handleBracketPlayerClick(p1, p2));
    p2.addEventListener('click', () => handleBracketPlayerClick(p2, p1));

    matchDiv.appendChild(p1);
    matchDiv.appendChild(p2);
    
    return matchDiv;
}

function handleBracketPlayerClick(playerElement, opponentElement) {
    if (removeBracketPlayerMode && playerElement.dataset.round === '0') {
        removeBracketPlayer(playerElement);
        return;
    }
    advancePlayer(playerElement, opponentElement);
}

function removeBracketPlayer(playerElement) {
    const name = playerElement.textContent;
    if (name === 'TBD' || name === 'Freilos' || playerElement.classList.contains('empty')) return;

    players = players.filter(player => player !== name);
    teamPlayers = teamPlayers.filter(player => player.name !== name);
    playerElement.textContent = 'TBD';
    playerElement.removeAttribute('title');
    playerElement.className = 'player empty';
    clearFutureSubtree(0, Number(playerElement.dataset.match));
    updatePlayerCount();
    removeBracketPlayerMode = false;
    removeBracketPlayerBtn.classList.remove('active-control');
    removeBracketPlayerBtn.textContent = 'Spieler entfernen';
    simulationStatus.textContent = `${name} wurde aus dem Turnier entfernt.`;
}

function appendMatchesToRound(roundDiv, matches, side) {
    if (matches.length === 1) {
        matches[0].classList.add('single-match');
        roundDiv.appendChild(matches[0]);
    } else {
        for (let i = 0; i < matches.length; i += 2) {
            const pair = document.createElement('div');
            pair.className = `match-pair ${side}-pair`;
            pair.appendChild(matches[i]);
            pair.appendChild(matches[i+1]);
            roundDiv.appendChild(pair);
        }
    }
}

function renderSplitBracket(startingPlayers) {
    bracketContainer.innerHTML = '';
    const totalRounds = Math.log2(startingPlayers.length);
    
    const leftWrapper = document.createElement('div');
    leftWrapper.className = 'bracket-half left-half';
    
    const rightWrapper = document.createElement('div');
    rightWrapper.className = 'bracket-half right-half';
    
    const centerWrapper = document.createElement('div');
    centerWrapper.className = 'bracket-center';
    if (totalRounds === 1) centerWrapper.classList.add('only-center');

    const championDiv = document.createElement('div');
    championDiv.className = 'champion-box match';
    const championLabel = document.createElement('div');
    championLabel.className = 'champion-label';
    championLabel.textContent = 'CHAMPION';
    const championP = createPlayerElement(totalRounds, 0, 0);
    championP.classList.add('champion-name');
    championDiv.append(championLabel, championP);
    
    const finalMatchDiv = document.createElement('div');
    finalMatchDiv.className = 'match final-match';
    const finalP1 = createPlayerElement(totalRounds - 1, 0, 0);
    const finalP2 = createPlayerElement(totalRounds - 1, 0, 1);
    
    finalP1.addEventListener('click', () => handleBracketPlayerClick(finalP1, finalP2));
    finalP2.addEventListener('click', () => handleBracketPlayerClick(finalP2, finalP1));
    
    finalMatchDiv.appendChild(finalP1);
    finalMatchDiv.appendChild(finalP2);
    
    centerWrapper.appendChild(championDiv);
    centerWrapper.appendChild(finalMatchDiv);

    for (let round = 0; round < totalRounds - 1; round++) {
        const leftRoundDiv = document.createElement('div');
        leftRoundDiv.className = 'round left-round';
        
        const rightRoundDiv = document.createElement('div');
        rightRoundDiv.className = 'round right-round';

        const numMatches = startingPlayers.length / Math.pow(2, round + 1);
        
        let leftMatches = [];
        let rightMatches = [];
        
        for (let i = 0; i < numMatches; i++) {
            const matchDiv = createMatchDOM(round, i, startingPlayers);
            if (i < numMatches / 2) leftMatches.push(matchDiv);
            else rightMatches.push(matchDiv);
        }
        
        appendMatchesToRound(leftRoundDiv, leftMatches, 'left');
        appendMatchesToRound(rightRoundDiv, rightMatches, 'right');

        leftWrapper.appendChild(leftRoundDiv);
        rightWrapper.appendChild(rightRoundDiv);
    }
    
    bracketContainer.appendChild(leftWrapper);
    bracketContainer.appendChild(centerWrapper);
    bracketContainer.appendChild(rightWrapper);

    for (let i = 0; i < startingPlayers.length / 2; i++) {
        const p1 = document.getElementById(`match-0-${i}-p0`);
        const p2 = document.getElementById(`match-0-${i}-p1`);
        if (p1) {
            setStartingPlayer(p1, startingPlayers[i * 2]);
        }
        if (p2) {
            setStartingPlayer(p2, startingPlayers[i * 2 + 1]);
        }
    }

}

function setStartingPlayer(element, name) {
    element.textContent = name;
    element.title = name;
    element.className = name === 'Freilos' ? 'player bye' : 'player';
}

function createPlayerElement(round, matchIndex, slotIndex) {
    const p = document.createElement('div');
    p.className = 'player empty';
    p.id = `match-${round}-${matchIndex}-p${slotIndex}`;
    p.dataset.round = round;
    p.dataset.match = matchIndex;
    p.textContent = 'TBD';
    return p;
}

function advancePlayer(winnerElement, loserElement) {
    if (winnerElement.textContent === 'TBD' || winnerElement.textContent === 'Freilos' || winnerElement.classList.contains('empty') || winnerElement.classList.contains('bye')) {
        return;
    }
    winnerElement.classList.add('winner');
    winnerElement.classList.remove('loser');
    loserElement.classList.add('loser');
    loserElement.classList.remove('winner');

    const currentRound = parseInt(winnerElement.dataset.round);
    const currentMatch = parseInt(winnerElement.dataset.match);
    
    const nextRound = currentRound + 1;
    const nextMatch = Math.floor(currentMatch / 2);
    const nextSlot = currentMatch % 2;

    const nextSlotId = `match-${nextRound}-${nextMatch}-p${nextSlot}`;
    const nextSlotElement = document.getElementById(nextSlotId);

    if (nextSlotElement) {
        clearFutureSubtree(currentRound, currentMatch);

        nextSlotElement.textContent = winnerElement.textContent;
        nextSlotElement.title = winnerElement.textContent;
        nextSlotElement.className = nextSlotElement.closest('.champion-box')
            ? 'player champion-name'
            : 'player';
    }
}

function clearFutureSubtree(startRound, startMatch) {
    let currentRound = startRound;
    let currentMatch = startMatch;
    
    while (currentRound <= 20) {
        let nextRound = currentRound + 1;
        let nextMatch = Math.floor(currentMatch / 2);
        let nextSlot = currentMatch % 2;
        
        let nextSlotElement = document.getElementById(`match-${nextRound}-${nextMatch}-p${nextSlot}`);
        
        if (nextSlotElement) {
            nextSlotElement.textContent = 'TBD';
            nextSlotElement.removeAttribute('title');
            nextSlotElement.className = 'player empty';

            currentRound = nextRound;
            currentMatch = nextMatch;
        } else {
            break;
        }
    }
}

function autoScaleBracket() {
    if (bracketContainer.style.display === 'none') return;
    
    bracketContainer.style.transform = 'scale(1)';
    
    setTimeout(() => {
        const availableWidth = Math.max(bracketWrapper.clientWidth - 24, 1);
        const availableHeight = Math.max(bracketWrapper.clientHeight - 24, 1);
        const scaleX = availableWidth / Math.max(bracketContainer.scrollWidth, 1);
        const scaleY = availableHeight / Math.max(bracketContainer.scrollHeight, 1);
           fitScale = Math.min(scaleX, scaleY, 1);
           updateBracketTransform();
    }, 50);
}

window.addEventListener('resize', autoScaleBracket);

zoomInBtn.addEventListener('click', () => changeZoom(1.2));
zoomOutBtn.addEventListener('click', () => changeZoom(1 / 1.2));
zoomResetBtn.addEventListener('click', resetView);

bracketWrapper.addEventListener('wheel', (event) => {
    if (bracketContainer.style.display !== 'none') {
        event.preventDefault();
        changeZoom(event.deltaY < 0 ? 1.15 : 1 / 1.15);
    }
}, { passive: false });

bracketWrapper.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button, input, .player')) return;
    isDragging = true;
    dragStartX = event.clientX - panX;
    dragStartY = event.clientY - panY;
    bracketWrapper.classList.add('is-dragging');
    bracketWrapper.setPointerCapture(event.pointerId);
});

bracketWrapper.addEventListener('pointermove', (event) => {
    if (!isDragging) return;
    panX = event.clientX - dragStartX;
    panY = event.clientY - dragStartY;
    updateBracketTransform();
});

bracketWrapper.addEventListener('pointerup', stopDragging);
bracketWrapper.addEventListener('pointercancel', stopDragging);

function stopDragging(event) {
    if (!isDragging) return;
    isDragging = false;
    bracketWrapper.classList.remove('is-dragging');
    if (bracketWrapper.hasPointerCapture(event.pointerId)) {
        bracketWrapper.releasePointerCapture(event.pointerId);
    }
}

function changeZoom(multiplier) {
    zoomFactor = Math.min(Math.max(zoomFactor * multiplier, 0.5), 4);
    updateBracketTransform();
}

function resetView() {
    zoomFactor = 1;
    panX = 0;
    panY = 0;
    autoScaleBracket();
}

function updateBracketTransform() {
    const scale = fitScale * zoomFactor;
    bracketContainer.style.transform = `translate(${panX}px, ${panY}px) scale(${scale})`;
    zoomLevel.textContent = `${Math.round(zoomFactor * 100)}%`;
    animateBracketLines();
}

function animateBracketLines() {
    if (lineAnimationFrame) cancelAnimationFrame(lineAnimationFrame);
    const startedAt = performance.now();
    const redraw = timestamp => {
        drawBracketLines();
        if (timestamp - startedAt < 220) {
            lineAnimationFrame = requestAnimationFrame(redraw);
        } else {
            lineAnimationFrame = null;
            drawBracketLines();
        }
    };
    lineAnimationFrame = requestAnimationFrame(redraw);
}

function drawBracketLines() {
    if (!bracketLines || bracketContainer.style.display === 'none') return;
    const wrapperRect = bracketWrapper.getBoundingClientRect();
    bracketLines.setAttribute('viewBox', `0 0 ${wrapperRect.width} ${wrapperRect.height}`);
    bracketLines.innerHTML = '';
    const totalRounds = Math.log2(document.querySelectorAll('.player[data-round="0"]').length);
    const matches = Array.from(bracketContainer.querySelectorAll('.match:not(.final-match):not(.champion-box)'));

    const addPath = (start, end) => {
        const direction = end.x >= start.x ? 1 : -1;
        const middleX = start.x + (end.x - start.x) / 2;
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', `M ${start.x} ${start.y} H ${middleX} V ${end.y} H ${end.x}`);
        path.setAttribute('class', 'bracket-line');
        path.dataset.direction = direction;
        bracketLines.appendChild(path);
    };

    matches.forEach(match => {
        const sourcePlayer = match.querySelector('.player');
        if (!sourcePlayer) return;
        const round = Number(sourcePlayer.dataset.round);
        const matchIndex = Number(sourcePlayer.dataset.match);
        if (round >= totalRounds - 1) return;
        const nextMatch = document.querySelector(`#match-${round + 1}-${Math.floor(matchIndex / 2)}-p0`)
            ?.closest('.match');
        if (!nextMatch) return;
        const source = match.getBoundingClientRect();
        const target = nextMatch.getBoundingClientRect();
        const goesRight = target.left > source.right;
        addPath({
            x: (goesRight ? source.right : source.left) - wrapperRect.left,
            y: source.top + source.height / 2 - wrapperRect.top
        }, {
            x: (goesRight ? target.left : target.right) - wrapperRect.left,
            y: target.top + target.height / 2 - wrapperRect.top
        });
    });

    const finalMatch = bracketContainer.querySelector('.final-match');
    const champion = bracketContainer.querySelector('.champion-box');
    if (finalMatch && champion) {
        const finalRect = finalMatch.getBoundingClientRect();
        const championRect = champion.getBoundingClientRect();
        addPath({
            x: finalRect.left + finalRect.width / 2 - wrapperRect.left,
            y: finalRect.top - wrapperRect.top
        }, {
            x: championRect.left + championRect.width / 2 - wrapperRect.left,
            y: championRect.bottom - wrapperRect.top
        });
    }
}


const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const particles = [];
const particleCount = 70;
let animationFrameId = null;

class Particle {
    constructor() {
        this.reset();
        this.y = Math.random() * canvas.height;
    }
    
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 100;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * -1.5 - 0.5;
        this.speedX = Math.random() * 2 - 1;
        this.opacity = Math.random() * 0.8 + 0.2;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = Math.random() * 0.03 + 0.01;
    }

    update() {
        this.y += this.speedY;
        this.wobble += this.wobbleSpeed;
        this.x += Math.sin(this.wobble) * 1.5;
        this.opacity -= 0.001;

        if (this.y < -10 || this.opacity <= 0) {
            this.reset();
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 170, 30, ${this.opacity})`;
        ctx.fill();
    }
}

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

function animateBg() {
    if (document.hidden) {
        animationFrameId = null;
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    animationFrameId = requestAnimationFrame(animateBg);
}

document.addEventListener('visibilitychange', () => {
    if (!document.hidden && animationFrameId === null) animateBg();
});

animateBg();
