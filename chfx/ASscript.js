const container = document.getElementById('grid-container');
const infoPanel = document.getElementById('info-panel');
const colors = ['#a0d6b4', '#9fd4b3', '#98d3b2', '#91d2b1', '#8bd1b0', '#85d0af', '#7fcfac', '#79ceab'];
const characters = '的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取据处队南给色光门即保治北造百规热领七海口东导器压志世金增争济阶油思术极交受联什认六共权收证改清己美再采转更单风切打白教速花带安场身车例真务具万每目至达走积示议声报斗完类八离华名确才科张信马节话米整空元况今集温传土许步群广石计整府除消海常除七清料级两极';

$(document).ready(function() {
    // Get the 'page' parameter from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const page = urlParams.get('page'); // For example, 'zhegehenbang'

    // Fetch the CSV file
    $.get('speechRecognition.csv', function(data) {
        // Parse CSV data
        const rows = data.split('\n'); // Split by rows
        const headers = rows[0].split(','); // Get headers (assuming the first row is the header)

        // Find the row that matches the 'page' parameter
        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].split(',');
            const sentence = row[0]; // Sentence column
            const pinyin = row[1]; // Pinyin column
            const translation = row[2]; // Translation column
            const audioFile = row[3]; // Audio file column

            // If the sentence matches the page parameter
            if (sentence.trim().replace(/\s+/g, '') === page.trim()) {
                // Fill in the content dynamically
                $('#chinese-version').text(sentence);
                $('#pinyin').text(pinyin);
                $('#english-translation').text(translation);

                // Set up the audio button
                $('#play-audio').click(function() {
                    const audio = new Audio(`https://chineseffect.com/audio/random/${audioFile}`);
                    audio.play();
                });

                // Start the sentence animation with the loaded sentence
                sentenceAnimation(sentence);

                break;
            }
        }
    });

    // Animation function
    function sentenceAnimation(sentence) {
        const sentenceContainer = document.createElement('div');
        sentenceContainer.id = 'sentence-container';
        sentenceContainer.style.position = 'absolute';
        sentenceContainer.style.top = '8%'; // Adjusted top margin
        sentenceContainer.style.left = '50%';
        sentenceContainer.style.transform = 'translateX(-50%)';
        sentenceContainer.style.display = 'flex';
        sentenceContainer.style.flexDirection = 'row';
        sentenceContainer.style.gap = '5px'; // Reduced gap between columns
        sentenceContainer.style.justifyContent = 'center';
        sentenceContainer.style.alignItems = 'flex-start';
        document.body.appendChild(sentenceContainer);

        const charElements = sentence.split('').map(char => {
            const charElement = document.createElement('span');
            charElement.textContent = char;
            charElement.style.color = 'orange';
            charElement.style.fontSize = '60px';
            charElement.style.fontFamily = "'Noto Sans SC', sans-serif"; // Use modern Chinese font
            charElement.style.transition = 'transform 1s ease-out, opacity 1s ease-out';
            charElement.style.transform = 'scale(2)'; // Start big for zoom-out appearance
            charElement.style.opacity = 0;
            return charElement;
        });

        // Create columns and append characters to columns
        let columnContainer = document.createElement('div');
        columnContainer.style.display = 'flex';
        columnContainer.style.flexDirection = 'column';
        columnContainer.style.gap = '5px'; // Reduced gap between characters
        sentenceContainer.appendChild(columnContainer);

        charElements.forEach((charElement, index) => {
            if (index > 0 && index % 5 === 0) {
                columnContainer = document.createElement('div');
                columnContainer.style.display = 'flex';
                columnContainer.style.flexDirection = 'column';
                columnContainer.style.gap = '5px'; // Reduced gap between characters
                sentenceContainer.appendChild(columnContainer);
            }
            columnContainer.appendChild(charElement);
        });

        let delay = 0;
        charElements.forEach((charElement) => {
            setTimeout(() => {
                charElement.style.transform = 'scale(1)'; // Zoom out effect for appearance
                charElement.style.opacity = 1;
            }, delay);
            delay += 300; // Faster animation
        });

        setTimeout(() => {
            let fadeDelay = 0;
            charElements.forEach((charElement) => {
                setTimeout(() => {
                    charElement.style.transform = 'scale(2)'; // Zoom in effect for disappearance
                    charElement.style.opacity = 0;
                }, fadeDelay);
                fadeDelay += 300; // Faster disappearance
            });

            setTimeout(() => {
                document.body.removeChild(sentenceContainer);
                setTimeout(() => sentenceAnimation(sentence), 3000); // Restart animation after delay
            }, fadeDelay + 1000); // Adjusted timing to ensure disappearance is completed
        }, delay + 4000); // Adjusted delay to ensure proper timing
    }
});
