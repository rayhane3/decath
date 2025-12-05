// === Variables globales ===
let currentSlide = 1;
const totalSlides = 6;
let userProfile = {};
let currentMovement = 1;
const totalMovements = 4;

// Fonction pour sauvegarder userProfile dans localStorage
function saveProfile() {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
}

// Fonction pour charger userProfile depuis localStorage
function loadProfile() {
    const stored = localStorage.getItem('userProfile');
    return stored ? JSON.parse(stored) : {};
}

// === Initialisation Questionnaire ===
function initQuestionnaire() {
    showSlide(1);
    document.getElementById('nextBtn').onclick = nextQuestion;
    document.getElementById('prevBtn').onclick = prevQuestion;
}

function showSlide(n) {
    document.querySelectorAll('.question-slide').forEach(s => s.classList.remove('active'));
    document.querySelector(`.question-slide[data-question="${n}"]`).classList.add('active');
    document.getElementById('currentQuestion').textContent = n;
    document.getElementById('progressFill').style.width = (n / totalSlides * 100) + '%';
    document.getElementById('prevBtn').disabled = (n === 1);
    document.getElementById('nextBtn').textContent = (n === totalSlides) ? "Voir mon profil" : "Suivant";
}

function validateSlide() {
    if (currentSlide === 1 && !document.querySelector('input[name="educatif"]:checked')) return false;
    if (currentSlide === 2 && !document.querySelector('input[name="niveau"]:checked')) return false;
    if (currentSlide === 3 && (!document.getElementById('weight').value || document.getElementById('weight').value < 30)) return false;
    if (currentSlide === 4 && (!document.getElementById('height').value || document.getElementById('height').value < 100)) return false;
    return true;
}

function nextQuestion() {
    if (!validateSlide()) {
        alert("Veuillez compléter cette question !");
        return;
    }
    if (currentSlide === totalSlides) {
        analyserProfil();
        return;
    }
    currentSlide++;
    showSlide(currentSlide);
}

function prevQuestion() {
    if (currentSlide > 1) {
        currentSlide--;
        showSlide(currentSlide);
    }
}

// === Analyse Profil ===
function analyserProfil() {
    const educatif = document.querySelector('input[name="educatif"]:checked').value;
    const niveau = document.querySelector('input[name="niveau"]:checked').value;
    const weight = parseFloat(document.getElementById('weight').value);
    const height = parseFloat(document.getElementById('height').value);
    const sports = Array.from(document.querySelectorAll('input[name="sports"]:checked')).map(i => i.value);
    const objectifs = Array.from(document.querySelectorAll('input[name="objectifs"]:checked')).map(i => i.value);
    const bmi = (weight / Math.pow(height / 100, 2)).toFixed(1);

    let category = '', className = '';
    if (bmi < 18.5) { category = 'Insuffisance pondérale'; className = 'underweight'; }
    else if (bmi < 25) { category = 'Poids normal'; className = 'normal'; }
    else if (bmi < 30) { category = 'Surpoids'; className = 'overweight'; }
    else { category = 'Obésité'; className = 'obese'; }

    userProfile = { educatif, niveau, weight, height, bmi, category, className, sports, objectifs };
    saveProfile();
    window.location.href = 'profil.html';
}

// === Affichage Profil ===
function displayProfil() {
    userProfile = loadProfile();
    const decathlonLinks = {
        "Fitness": "https://www.decathlon.fr/c/materiel-de-musculation-et-cross-training_15323",
        "Football": "https://www.decathlon.fr/sports/football",
        "Natation": "https://www.decathlon.fr/sports/natation",
        "Course": "https://www.decathlon.fr/sports/running-course-a-pied",
        "Tennis": "https://www.decathlon.fr/sports/tennis",
        "Padel": "https://www.decathlon.fr/sports/padel",
        "Handball": "https://www.decathlon.fr/sports/handball",
        "Gymnastique": "https://www.decathlon.fr/sports/gymnastique"
    };

    let sportButtonsHTML = '';
    if (userProfile.sports.length > 0) {
        sportButtonsHTML = '<div class="decathlon-buttons">';
        userProfile.sports.forEach(sport => {
            const lien = decathlonLinks[sport] || "https://www.decathlon.fr/";
            sportButtonsHTML += `<a href="${lien}" target="_blank">${sport} →</a>`;
        });
        sportButtonsHTML += '</div>';
    }

    document.getElementById('resultat').innerHTML = `
        <div class="result-item"><strong>Niveau éducatif :</strong> ${userProfile.educatif}</div>
        <div class="result-item"><strong>Niveau sportif :</strong> ${userProfile.niveau}</div>
        <div class="result-item"><strong>Poids / Taille :</strong> ${userProfile.weight} kg • ${userProfile.height} cm</div>
        <div class="result-item"><strong>Sports :</strong> ${userProfile.sports.length ? userProfile.sports.join(', ') : 'Aucun'}</div>
        <div class="result-item"><strong>Objectifs :</strong> ${userProfile.objectifs.length ? userProfile.objectifs.join(', ') : 'Aucun'}</div>
        <div class="bmi-result ${userProfile.className}">
            <div style="font-size:42px;font-weight:900;">${userProfile.bmi}</div>
            <strong>${userProfile.category}</strong>
        </div>
        ${userProfile.sports.length > 0 ? '<p style="text-align:center;margin:25px 0 10px;font-size:19px;color:#0082c3;font-weight:600;">Équipe-toi directement pour tes sports :</p>' : ''}
        ${sportButtonsHTML}
    `;

    document.getElementById('btnProgram').onclick = () => {
        window.location.href = 'programme.html';
    };
}

// === Affichage Programme ===
function displayProgramme() {
    userProfile = loadProfile();
    const niveau = userProfile.niveau;
    let title = '', content = '';

    if (niveau === "Débutant") {
        title = "Programme Débutant";
        content = `<p>Tu peux le faire ! Active ton combo Gaulois et avance !</p>`;
    } else if (niveau === "Intermédiaire") {
        title = "Programme Intermédiaire";
        content = `<p>Garde la rage du village et la précision d’un Street Fighter !</p>`;
    } else {
        title = "Programme Avancé";
        content = `<p>Mode warrior activé ! Ne lâche rien ! Tu as la force d’Obélix et le focus de Ryu</p>`;
    }

    document.getElementById('programSubtitle').textContent = title;
    document.getElementById('programContent').innerHTML = content + `
        <div style="text-align:center;margin-top:40px;">
            <button class="btn-submit" style="padding:18px 40px;font-size:20px;" onclick="startMovementTest()">
                Lancer le test de mouvements (4 étapes)
            </button>
        </div>
    `;

    document.getElementById('btnBack').onclick = () => {
        window.location.href = 'profil.html';
    };
}

function startMovementTest() {
    window.location.href = 'mouvements.html';
}

// === Initialisation Mouvements ===
function initMovements() {
    showMovement(1);
}

function showMovement(n) {
    document.querySelectorAll('.movement').forEach(m => m.classList.remove('active'));
    document.querySelector(`.movement[data-move="${n}"]`).classList.add('active');
    document.getElementById('currentMove').textContent = n;
    document.getElementById('movementProgress').style.width = (n / totalMovements * 100) + '%';
}

function validateMovement(n) {
    const msg = document.getElementById(`msg${n}`);
    const btn = event.target;

    msg.style.display = 'block';
    btn.textContent = "Validé !";
    btn.disabled = true;
    btn.style.background = '#2e7d32';

    setTimeout(() => {
        if (n < totalMovements) {
            currentMovement = n + 1;
            showMovement(currentMovement);
        } else {
            window.location.href = 'completion.html';
        }
    }, 5000);
}

// === Restart pour Completion ===
function restart() {
    localStorage.clear();
    window.location.href = 'questionnaire.html';
}