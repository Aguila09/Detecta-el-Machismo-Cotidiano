// Frases del juego
const phrases = [
    // Machismos cotidianos
    { text: "Los hombres no lloran", type: "machismo" },
    { text: "Ella debe quedarse en casa cuidando a los niños", type: "machismo" },
    { text: "Los hombres tienen que ser fuertes siempre", type: "machismo" },
    { text: "Las mujeres son más débiles que los hombres", type: "machismo" },
    { text: "Un hombre de verdad no muestra sus emociones", type: "machismo" },
    { text: "Las tareas del hogar son responsabilidad de la mujer", type: "machismo" },
    { text: "Los hombres no deben usar colores rosados", type: "machismo" },
    { text: "Las mujeres son menos capaces para las matemáticas", type: "machismo" },
    { text: "El hombre debe ser el proveedor del hogar", type: "machismo" },
    { text: "Las niñas deben jugar con muñecas y los niños con carritos", type: "machismo" },
    { text: "Un hombre que cocina es menos masculino", type: "machismo" },
    { text: "Las mujeres son demasiado emocionales para liderar", type: "machismo" },
    { text: "Los hombres tienen más necesidades sexuales que las mujeres", type: "machismo" },
    { text: "Si te pega es porque te quiere", type: "machismo" },
    { text: "Los celos son una muestra de amor", type: "machismo" },
    
    // Buenas prácticas y nuevas masculinidades
    { text: "La corresponsabilidad en el hogar es de ambos", type: "good" },
    { text: "Expresar emociones es válido para todas las personas", type: "good" },
    { text: "El consentimiento debe ser claro y explícito", type: "good" },
    { text: "Los hombres también pueden ser vulnerables", type: "good" },
    { text: "Compartir las tareas domésticas fortalece la relación", type: "good" },
    { text: "Todas las personas merecen respeto sin importar su género", type: "good" },
    { text: "Pedir ayuda psicológica es un acto de valentía", type: "good" },
    { text: "La paternidad activa beneficia a toda la familia", type: "good" },
    { text: "Los hombres pueden elegir profesiones de cuidado", type: "good" },
    { text: "Rechazar la violencia es un signo de fortaleza", type: "good" },
    { text: "Escuchar y validar las emociones de los demás es importante", type: "good" },
    { text: "El buen trato se basa en el respeto mutuo", type: "good" },
    { text: "La igualdad de género beneficia a toda la sociedad", type: "good" },
    { text: "Los roles de género son construcciones sociales, no destinos", type: "good" },
    { text: "Apoyar los sueños de tu pareja es fundamental", type: "good" }
];

// Variables del juego
let currentPhrases = [];
let currentPhraseIndex = 0;
let score = 0;
let timer;
let timeLeft = 10;
let answersGiven = [];

// Elementos del DOM
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const endScreen = document.getElementById('end-screen');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const machismoBtn = document.getElementById('machismo-btn');
const goodBtn = document.getElementById('good-btn');
const phraseElement = document.getElementById('phrase');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');
const feedbackElement = document.getElementById('feedback');
const finalScoreElement = document.getElementById('final-score');
const finalPercentageElement = document.getElementById('final-percentage');
const motivationalMessageElement = document.getElementById('motivational-message');

// Event Listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
machismoBtn.addEventListener('click', () => checkAnswer('machismo'));
goodBtn.addEventListener('click', () => checkAnswer('good'));

// Iniciar el juego
function startGame() {
    // Reiniciar variables
    score = 0;
    currentPhraseIndex = 0;
    answersGiven = [];
    
    // Seleccionar y mezclar frases
    currentPhrases = shuffleArray([...phrases]).slice(0, 20);
    
    // Actualizar UI
    scoreElement.textContent = score;
    totalQuestionsElement.textContent = currentPhrases.length;
    
    // Cambiar a pantalla de juego
    switchScreen(startScreen, gameScreen);
    
    // Mostrar primera frase
    showPhrase();
}

// Mezclar array (Fisher-Yates shuffle)
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Mostrar frase actual
function showPhrase() {
    if (currentPhraseIndex >= currentPhrases.length) {
        endGame();
        return;
    }
    
    const currentPhrase = currentPhrases[currentPhraseIndex];
    phraseElement.textContent = currentPhrase.text;
    currentQuestionElement.textContent = currentPhraseIndex + 1;
    
    // Reiniciar y comenzar timer
    timeLeft = 10;
    timerElement.textContent = timeLeft;
    clearInterval(timer);
    startTimer();
    
    // Habilitar botones
    enableButtons();
    
    // Limpiar feedback
    feedbackElement.className = 'feedback';
    feedbackElement.textContent = '';
}

// Iniciar temporizador
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        // Cambiar color cuando queda poco tiempo
        if (timeLeft <= 3) {
            timerElement.style.color = '#dc3545';
            timerElement.classList.add('pulse');
        } else {
            timerElement.style.color = '#f5576c';
            timerElement.classList.remove('pulse');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            checkAnswer(null); // Respuesta incorrecta por timeout
        }
    }, 1000);
}

// Verificar respuesta
function checkAnswer(answer) {
    clearInterval(timer);
    disableButtons();
    
    const currentPhrase = currentPhrases[currentPhraseIndex];
    const isCorrect = answer === currentPhrase.type;
    
    // Guardar respuesta
    answersGiven.push({
        phrase: currentPhrase.text,
        correct: isCorrect
    });
    
    // Actualizar puntaje
    if (isCorrect) {
        score++;
        scoreElement.textContent = score;
        showFeedback(true);
        playSound('correct');
    } else {
        showFeedback(false);
        playSound('incorrect');
    }
    
    // Siguiente frase después de un delay
    setTimeout(() => {
        currentPhraseIndex++;
        showPhrase();
    }, 1500);
}

// Mostrar feedback visual
function showFeedback(isCorrect) {
    feedbackElement.classList.add('show');
    
    if (isCorrect) {
        feedbackElement.classList.add('correct');
        feedbackElement.textContent = '✅ ¡Correcto!';
        phraseElement.parentElement.style.background = '#d4edda';
        setTimeout(() => {
            phraseElement.parentElement.style.background = '#f8f9fa';
        }, 1500);
    } else {
        feedbackElement.classList.add('incorrect');
        feedbackElement.textContent = '❌ Incorrecto';
        phraseElement.parentElement.style.background = '#f8d7da';
        phraseElement.parentElement.classList.add('shake');
        setTimeout(() => {
            phraseElement.parentElement.style.background = '#f8f9fa';
            phraseElement.parentElement.classList.remove('shake');
        }, 1500);
    }
}

// Reproducir sonido (simulado con beep)
function playSound(type) {
    // Crear un beep simple usando Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        if (type === 'correct') {
            oscillator.frequency.value = 800;
            gainNode.gain.value = 0.1;
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
        } else {
            oscillator.frequency.value = 300;
            gainNode.gain.value = 0.1;
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
        }
    } catch (e) {
        // Si el navegador no soporta Web Audio API, simplemente no reproducir sonido
        console.log('Audio no disponible');
    }
}

// Deshabilitar botones
function disableButtons() {
    machismoBtn.disabled = true;
    goodBtn.disabled = true;
}

// Habilitar botones
function enableButtons() {
    machismoBtn.disabled = false;
    goodBtn.disabled = false;
}

// Terminar el juego
function endGame() {
    clearInterval(timer);
    
    // Calcular porcentaje
    const percentage = Math.round((score / currentPhrases.length) * 100);
    
    // Actualizar pantalla final
    finalScoreElement.textContent = score + ' / ' + currentPhrases.length;
    finalPercentageElement.textContent = percentage + '%';
    
    // Mensaje motivacional según desempeño
    let message = '';
    if (percentage >= 90) {
        message = '🌟 ¡Excelente! Tienes una gran comprensión sobre igualdad de género y nuevas masculinidades. ¡Sigue promoviendo el cambio!';
    } else if (percentage >= 70) {
        message = '👏 ¡Muy bien! Vas por buen camino en identificar machismos cotidianos. Continúa aprendiendo y compartiendo.';
    } else if (percentage >= 50) {
        message = '💪 ¡Buen intento! Hay espacio para seguir aprendiendo sobre roles de género y masculinidades. ¡No te rindas!';
    } else {
        message = '📚 ¡Sigue adelante! Este tema requiere reflexión y práctica. Te invitamos a seguir informándote sobre igualdad de género.';
    }
    
    motivationalMessageElement.textContent = message;
    
    // Cambiar a pantalla final
    switchScreen(gameScreen, endScreen);
}

// Reiniciar el juego
function restartGame() {
    switchScreen(endScreen, startScreen);
}

// Cambiar entre pantallas
function switchScreen(fromScreen, toScreen) {
    fromScreen.classList.remove('active');
    toScreen.classList.add('active');
}
