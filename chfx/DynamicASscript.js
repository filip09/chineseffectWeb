const container = document.getElementById('grid-container');
const infoPanel = document.getElementById('info-panel');
const colors = ['#a0d6b4', '#9fd4b3', '#98d3b2', '#91d2b1', '#8bd0af', '#7fcfac', '#79ceab'];
const characters = '日月山河风景如画希望永远不灭朝阳初升星光闪耀하늘의빛과바람처럼자유롭다사랑은강하다平凡的生活中总有美丽的瞬间전통과현대가만나는도시永恒的友情无尽的梦想삶의길은계속된다희망은결코사라지지않는다';

const queryParams = new URLSearchParams(window.location.search);
const pageName = queryParams.get('page'); // Extract the "page" parameter from the URL

if (!pageName) {
    console.error('No "page" parameter found in the URL!');
} else {
    loadCSVData(pageName);
}

function loadCSVData(pageName) {
    fetch('https://chineseffect.com/chfx/speechRecognition.csv')
        .then(response => response.text())
        .then(data => {
            const rows = data.split('\n').map(row => row.split(',').map(cell => cell.trim())); // Trim all cells
            const headers = rows[0];

            const nameOfSiteIndex = headers.indexOf('nameOfSite');
            const chineseIndex = headers.indexOf('chineseVersion');
            const pinyinIndex = headers.indexOf('chinesePinyin');
            const englishIndex = headers.indexOf('englishTranslation');
            const soundFileIndex = headers.indexOf('soundFile');

            if (nameOfSiteIndex === -1) throw new Error('nameOfSite column not found in CSV file!');
            if (soundFileIndex === -1) throw new Error('soundFile column not found in CSV file!');

            // Find the row matching the pageName (case-insensitive)
            const matchedRow = rows.find(row => row[nameOfSiteIndex]?.toLowerCase() === pageName.toLowerCase());

            if (matchedRow) {
                const chineseVersion = matchedRow[chineseIndex] || 'N/A';
                const chinesePinyin = matchedRow[pinyinIndex] || 'N/A';
                const englishTranslation = matchedRow[englishIndex] || 'N/A';
                const soundFileName = matchedRow[soundFileIndex] || '';

                if (!soundFileName) {
                    console.warn(`Sound file name is empty for page: ${pageName}`);
                }

                console.log('Matched Row:', matchedRow);
                console.log('Sound File Name:', soundFileName);

                displayData(chineseVersion, chinesePinyin, englishTranslation, soundFileName);
            } else {
                console.error(`No matching row found for page: ${pageName}`);
            }
        })
        .catch(error => console.error('Error loading CSV file:', error));
}

function displayData(chineseVersion, chinesePinyin, englishTranslation, soundFileName) {
    document.getElementById('chinese-version').textContent = chineseVersion;
    document.getElementById('chinese-pinyin').textContent = chinesePinyin;
    document.getElementById('english-translation').textContent = englishTranslation;

    document.getElementById('play-audio').addEventListener('click', () => {
        if (!soundFileName) {
            console.error('Sound file name is undefined. Using text-to-speech as fallback.');
            const utterance = new SpeechSynthesisUtterance(chineseVersion);
            utterance.lang = 'zh-CN';
            window.speechSynthesis.speak(utterance);
            return;
        }

        const audioUrl = `https://chineseffect.com/audio/random/${soundFileName}.mp3`;
        const audio = new Audio(audioUrl);

        audio.onerror = () => {
            console.error(`Error loading audio file: ${audioUrl}. Using text-to-speech as fallback.`);
            const utterance = new SpeechSynthesisUtterance(chineseVersion);
            utterance.lang = 'zh-CN';
            window.speechSynthesis.speak(utterance);
        };

        audio.oncanplaythrough = () => {
            console.log(`Playing audio file: ${audioUrl}`);
            audio.play();
        };

        audio.play().catch(error => {
            console.error(`Error playing audio file: ${audioUrl}. Using text-to-speech as fallback.`);
            const utterance = new SpeechSynthesisUtterance(chineseVersion);
            utterance.lang = 'zh-CN';
            window.speechSynthesis.speak(utterance);
        });
    });

    createGrid();
    sentenceAnimation(chineseVersion);
}

function createGrid() {
    const numColumns = Math.ceil(window.innerWidth / 20);
    const numRows = Math.ceil(window.innerHeight / 20);
    const totalSquares = numColumns * numRows;

    for (let i = 0; i < totalSquares; i++) {
        const characterElement = document.createElement('div');
        characterElement.className = 'character';
        container.appendChild(characterElement);
        animateCharacter(characterElement);
    }
}

function animateCharacter(element) {
    const randomChar = characters[Math.floor(Math.random() * characters.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const duration = Math.random() * 1.5 + 1;

    element.style.color = randomColor;
    element.style.transform = 'scale(0)';
    element.style.opacity = 0;
    element.textContent = randomChar;

    const randomX = Math.random() * (window.innerWidth - 20);
    const randomY = Math.random() * (window.innerHeight - 20);
    element.style.left = `${randomX}px`;
    element.style.top = `${randomY}px`;

    setTimeout(() => {
        element.style.transitionDuration = `${duration}s`;
        element.style.transform = 'scale(1.6)';
        element.style.opacity = 0.4;

        setTimeout(() => {
            element.style.transitionDuration = `${duration}s`;
            element.style.transform = 'scale(3.2)';
            element.style.opacity = 0;

            setTimeout(() => {
                animateCharacter(element);
            }, duration * 1000);
        }, duration * 1000);
    }, 0);
}

function sentenceAnimation(chineseVersion) {
    const sentenceContainer = document.createElement('div');
    sentenceContainer.id = 'sentence-container';
    sentenceContainer.style.position = 'absolute';
    sentenceContainer.style.top = '5%';
    sentenceContainer.style.left = '50%';
    sentenceContainer.style.transform = 'translateX(-50%)';
    sentenceContainer.style.display = 'flex';
    sentenceContainer.style.flexDirection = 'row';
    sentenceContainer.style.gap = '5px';
    sentenceContainer.style.justifyContent = 'center';
    sentenceContainer.style.alignItems = 'flex-start';
    document.body.appendChild(sentenceContainer);

    const charElements = chineseVersion.split('').map(char => {
        const charElement = document.createElement('span');
        charElement.textContent = char;
        charElement.style.color = 'orange';
        charElement.style.fontSize = '60px';
        charElement.style.fontFamily = "'Noto Sans SC', sans-serif";
        charElement.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
        charElement.style.transform = 'scale(2)';
        charElement.style.opacity = 0;
        return charElement;
    });

    let columnContainer = document.createElement('div');
    columnContainer.style.display = 'flex';
    columnContainer.style.flexDirection = 'column';
    columnContainer.style.gap = '5px';
    sentenceContainer.appendChild(columnContainer);

    charElements.forEach((charElement, index) => {
        if (index > 0 && index % 4 === 0) {
            columnContainer = document.createElement('div');
            columnContainer.style.display = 'flex';
            columnContainer.style.flexDirection = 'column';
            columnContainer.style.gap = '5px';
            sentenceContainer.appendChild(columnContainer);
        }
        columnContainer.appendChild(charElement);
    });

    let delay = 0;
    charElements.forEach((charElement) => {
        setTimeout(() => {
            charElement.style.transform = 'scale(1)';
            charElement.style.opacity = 1;
        }, delay);
        delay += 300;
    });

    setTimeout(() => {
        let fadeDelay = 0;
        charElements.forEach((charElement) => {
            setTimeout(() => {
                charElement.style.transform = 'scale(2)';
                charElement.style.opacity = 0;
            }, fadeDelay);
            fadeDelay += 300;
        });

        setTimeout(() => {
            document.body.removeChild(sentenceContainer);
            setTimeout(() => sentenceAnimation(chineseVersion), 3000);
        }, fadeDelay + 1000);
    }, delay + 8000);
}

window.addEventListener('resize', () => {
    container.innerHTML = '';
    createGrid();
});
