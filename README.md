<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="A secure password generator with customizable settings, strength indicator, dark mode, and more.">
    <meta name="keywords" content="password generator, secure passwords, random password, password strength, dark mode">
    <meta name="author" content="Your Name">
    <title>Password Generator</title>
    <style>
        /* General Styles */
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f4;
            transition: background-color 0.3s ease;
            position: relative;
        }

        .container {
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            width: 90%;
            max-width: 400px;
            text-align: center;
        }

        h1 {
            margin-bottom: 20px;
        }

        .password-container {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
        }

        #password {
            width: 70%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 16px;
            text-align: center;
        }

        #copy-btn {
            padding: 10px 15px;
            background-color: #007BFF;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }

        #copy-btn:hover {
            background-color: #0056b3;
        }

        .settings label {
            display: block;
            margin: 10px 0;
        }

        .settings input[type="range"] {
            width: 100%;
        }

        .strength-indicator {
            margin-top: 20px;
        }

        #strength-bar {
            width: 100%;
            height: 10px;
            background-color: #ddd;
            border-radius: 5px;
            overflow: hidden;
        }

        #strength-fill {
            height: 100%;
            width: 0%;
            background-color: red;
            transition: width 0.3s ease, background-color 0.3s ease;
        }

        .theme-toggle {
            margin-top: 20px;
        }

        /* Dark Mode */
        body.dark-mode {
            background-color: #121212;
        }

        body.dark-mode .container {
            background-color: #1e1e1e;
            color: white;
        }

        body.dark-mode #strength-bar {
            background-color: #333;
        }

        /* Responsive Design */
        @media (max-width: 600px) {
            .password-container {
                flex-direction: column;
            }

            #password {
                width: 100%;
                margin-bottom: 10px;
            }

            #copy-btn {
                width: 100%;
            }
        }

        /* Branding */
        #branding {
            position: absolute;
            top: 10px;
            left: 10px;
            font-size: 18px;
            font-weight: bold;
            color: #007BFF;
        }

        /* Copyright Label */
        #copyright {
            position: absolute;
            bottom: 10px;
            left: 10px;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>
    <!-- Branding -->
    <div id="branding">Password Generator.io</div>

    <div class="container">
        <h1>Password Generator</h1>
        <div class="password-container">
            <input type="text" id="password" readonly placeholder="Your secure password">
            <button id="copy-btn">Copy</button>
        </div>
        <div id="password-preview">
            <p>Preview: Length: <span id="preview-length">12</span>, Characters: <span id="preview-characters">A-Z, a-z, 0-9</span></p>
        </div>
        <div class="settings">
            <label for="length">Length: <span id="length-value">12</span></label>
            <input type="range" id="length" min="4" max="32" value="12">

            <label><input type="checkbox" id="uppercase" checked> Uppercase (A-Z)</label>
            <label><input type="checkbox" id="lowercase" checked> Lowercase (a-z)</label>
            <label><input type="checkbox" id="numbers" checked> Numbers (0-9)</label>
            <label><input type="checkbox" id="symbols"> Symbols (!@#$%^&*)</label>

            <!-- Advanced Options -->
            <label><input type="checkbox" id="no-repeats"> Avoid Repeating Characters</label>
            <label><input type="checkbox" id="force-uppercase-lowercase"> Enforce Both Uppercase & Lowercase</label>

            <button id="generate-btn">Generate Password</button>
            <button id="generate-multiple-btn">Generate Multiple Passwords</button>
        </div>
        <div class="strength-indicator">
            <p>Password Strength:</p>
            <div id="strength-bar">
                <div id="strength-fill"></div>
            </div>
        </div>
        <div id="password-history">
            <h3>Password History</h3>
            <ul id="history-list"></ul>
        </div>
        <div class="theme-toggle">
            <label for="dark-mode">Dark Mode</label>
            <input type="checkbox" id="dark-mode">
        </div>
        <button id="download-btn">Download Password</button>
        <p>Entropy: <span id="entropy-value">0</span> bits</p>
        <select id="language-selector">
            <option value="en">English</option>
            <option value="es">Español</option>
        </select>
        <button id="speak-btn">Speak Password</button>
        <div id="expiration-reminder">
            <label for="set-expiration">Set Expiration Date:</label>
            <input type="date" id="set-expiration">
            <p id="expiration-message"></p>
        </div>
        <div id="guided-suggestions">
            <p id="suggestions"></p>
        </div>
    </div>

    <!-- Copyright Label -->
    <div id="copyright">&copy; 2023 Password Generator.io. All rights reserved.</div>

    <script>
        // DOM Elements
        const passwordEl = document.getElementById('password');
        const copyBtn = document.getElementById('copy-btn');
        const lengthEl = document.getElementById('length');
        const lengthValueEl = document.getElementById('length-value');
        const uppercaseEl = document.getElementById('uppercase');
        const lowercaseEl = document.getElementById('lowercase');
        const numbersEl = document.getElementById('numbers');
        const symbolsEl = document.getElementById('symbols');
        const generateBtn = document.getElementById('generate-btn');
        const generateMultipleBtn = document.getElementById('generate-multiple-btn');
        const strengthFill = document.getElementById('strength-fill');
        const darkModeToggle = document.getElementById('dark-mode');
        const downloadBtn = document.getElementById('download-btn');
        const entropyValueEl = document.getElementById('entropy-value');
        const languageSelector = document.getElementById('language-selector');
        const speakBtn = document.getElementById('speak-btn');
        const noRepeatsEl = document.getElementById('no-repeats');
        const forceUppercaseLowercaseEl = document.getElementById('force-uppercase-lowercase');
        const setExpirationEl = document.getElementById('set-expiration');
        const expirationMessageEl = document.getElementById('expiration-message');
        const suggestionsEl = document.getElementById('suggestions');

        let passwordHistory = [];

        // Event Listeners
        lengthEl.addEventListener('input', () => {
            lengthValueEl.textContent = lengthEl.value;
            updatePasswordPreview();
        });

        generateBtn.addEventListener('click', () => {
            generatePassword();
            addToHistory(passwordEl.value);
            validatePassword(passwordEl.value);
        });

        generateMultipleBtn.addEventListener('click', () => {
            const count = prompt("How many passwords do you want to generate?");
            if (count && !isNaN(count)) {
                for (let i = 0; i < parseInt(count); i++) {
                    generatePassword();
                    addToHistory(passwordEl.value);
                }
            }
        });

        copyBtn.addEventListener('click', () => {
            const password = passwordEl.value;
            if (password) {
                navigator.clipboard.writeText(password);
                alert('Password copied to clipboard!');
            }
        });

        darkModeToggle.addEventListener('change', () => {
            document.body.classList.toggle('dark-mode');
        });

        downloadBtn.addEventListener('click', () => {
            const password = passwordEl.value;
            const blob = new Blob([password], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'password.txt';
            a.click();
            URL.revokeObjectURL(url);
        });

        languageSelector.addEventListener('change', (e) => {
            const lang = e.target.value;
            const translations = {
                en: { title: 'Password Generator', copy: 'Copy' },
                es: { title: 'Generador de Contraseñas', copy: 'Copiar' }
            };
            document.querySelector('h1').textContent = translations[lang].title;
            document.getElementById('copy-btn').textContent = translations[lang].copy;
        });

        speakBtn.addEventListener('click', () => {
            speakPassword(passwordEl.value);
        });

        setExpirationEl.addEventListener('change', () => {
            const expirationDate = setExpirationEl.value;
            localStorage.setItem('passwordExpiration', expirationDate);
            checkExpiration();
        });

        uppercaseEl.addEventListener('change', updatePasswordPreview);
        lowercaseEl.addEventListener('change', updatePasswordPreview);
        numbersEl.addEventListener('change', updatePasswordPreview);
        symbolsEl.addEventListener('change', updatePasswordPreview);

        // Functions
        function generatePassword() {
            const length = +lengthEl.value;
            const includeUppercase = uppercaseEl.checked;
            const includeLowercase = lowercaseEl.checked;
            const includeNumbers = numbersEl.checked;
            const includeSymbols = symbolsEl.checked;
            const avoidRepeats = noRepeatsEl.checked;
            const enforceUppercaseLowercase = forceUppercaseLowercaseEl.checked;

            let password = '';
            let characters = '';

            if (includeUppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (includeLowercase) characters += 'abcdefghijklmnopqrstuvwxyz';
            if (includeNumbers) characters += '0123456789';
            if (includeSymbols) characters += '!@#$%^&*()_+~`|}{[]:;?><,./-=';

            if (characters === '') {
                alert('Please select at least one character type.');
                return;
            }

            if (enforceUppercaseLowercase && !(includeUppercase && includeLowercase)) {
                alert('You must include both uppercase and lowercase letters.');
                return;
            }

            let usedCharacters = new Set();

            for (let i = 0; i < length; i++) {
                let randomIndex;
                let char;

                do {
                    randomIndex = Math.floor(Math.random() * characters.length);
                    char = characters[randomIndex];
                } while (avoidRepeats && usedCharacters.has(char));

                password += char;
                usedCharacters.add(char);
            }

            passwordEl.value = password;
            calculateEntropy(length, characters);
            updateStrengthIndicator(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols);
            provideSuggestions(password);
        }

        function updatePasswordPreview() {
            const length = lengthEl.value;
            let characters = [];

            if (uppercaseEl.checked) characters.push('A-Z');
            if (lowercaseEl.checked) characters.push('a-z');
            if (numbersEl.checked) characters.push('0-9');
            if (symbolsEl.checked) characters.push('Symbols');

            document.getElementById('preview-length').textContent = length;
            document.getElementById('preview-characters').textContent = characters.join(', ');
        }

        function updateStrengthIndicator(length, uppercase, lowercase, numbers, symbols) {
            let strength = 0;

            if (length >= 8) strength += 1;
            if (uppercase) strength += 1;
            if (lowercase) strength += 1;
            if (numbers) strength += 1;
            if (symbols) strength += 1;

            const strengthPercentage = (strength / 5) * 100;
            strengthFill.style.width = `${strengthPercentage}%`;

            if (strengthPercentage > 80) {
                strengthFill.style.backgroundColor = 'green';
            } else if (strengthPercentage > 50) {
                strengthFill.style.backgroundColor = 'orange';
            } else {
                strengthFill.style.backgroundColor = 'red';
            }
        }

        function calculateEntropy(length, characters) {
            const entropy = Math.log2(characters.length) * length;
            entropyValueEl.textContent = entropy.toFixed(2);
        }

        function addToHistory(password) {
            passwordHistory.push(password);
            const historyList = document.getElementById('history-list');
            const listItem = document.createElement('li');
            listItem.textContent = password;
            historyList.appendChild(listItem);
        }

        function validatePassword(password) {
            const validationMessage = document.getElementById('validation-message');
            if (password.includes('123') || password.includes('abc')) {
                validationMessage.textContent = 'Warning: Weak pattern detected!';
            } else {
                validationMessage.textContent = '';
            }
        }

        function speakPassword(password) {
            const utterance = new SpeechSynthesisUtterance(password);
            speechSynthesis.speak(utterance);
        }

        function checkExpiration() {
            const expirationDate = localStorage.getItem('passwordExpiration');
            if (expirationDate) {
                const today = new Date().toISOString().split('T')[0];
                if (today > expirationDate) {
                    expirationMessageEl.textContent = 'Your password has expired!';
                } else {
                    expirationMessageEl.textContent = 'Password is valid until ' + expirationDate;
                }
            }
        }

        function provideSuggestions(password) {
            let suggestions = [];
            if (password.length < 8) suggestions.push('Increase password length for better security.');
            if (!/[A-Z]/.test(password)) suggestions.push('Include uppercase letters.');
            if (!/[a-z]/.test(password)) suggestions.push('Include lowercase letters.');
            if (!/[0-9]/.test(password)) suggestions.push('Include numbers.');
            if (!/[^A-Za-z0-9]/.test(password)) suggestions.push('Include symbols.');

            suggestionsEl.textContent = suggestions.length ? 'Suggestions: ' + suggestions.join(' ') : 'Great password!';
        }

        // Initial preview update
        updatePasswordPreview();
        checkExpiration();
    </script>
</body>
</html>
