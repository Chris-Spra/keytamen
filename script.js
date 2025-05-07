fetch("questions.txt")
    .then(response => response.text())
    .then(contents => {
        const lines = contents.split(/\r?\n/);

        const questions = [];
        const answers = [];
        const bonusQuestions1 = [];
        const bonusQuestions2 = [];
        const bonusAnswers1 = [];
        const bonusAnswers2 = [];

        lines.forEach(line => {
            const parts = line.split("&&");
            if (parts.length === 2) {
                if (line.substring(0, 4).trim() == "B1: ") {
                    bonusQuestions1.push(parts[0].trim());
                    bonusAnswers1.push(parts[1].trim());
                } else if (line.substring(0, 4).trim() == "B2: ") {
                    bonusQuestions2.push(parts[0].trim());
                    bonusAnswers2.push(parts[1].trim());
                } else {
                    questions.push(parts[0].trim());
                    answers.push(parts[1].trim());
                }
            }
        });

        function waitForModeChoice() {
            return new Promise((resolve) => {
                document.getElementById("mobileBtn").onclick = () => resolve("mobile");
                document.getElementById("desktopBtn").onclick = () => resolve("desktop");
            });
        }

        async function main() {
            const mode = await waitForModeChoice();
            console.log("Mode selected:", mode);
            if (mode === "desktop") {
                console.log("skibidi toilet")
                function waitForKeypress() {
                    return new Promise(resolve => {
                        function onKeyPress(event) {
                            if (event.key.length === 1) {
                                document.removeEventListener("keydown", onKeyPress);
                                resolve(event.key);
                            }
                        }
                        document.addEventListener("keydown", onKeyPress);
                    });
                }

                let interrupted = false;
                let paused = false;

                function waitForSpacebar() {
                    return new Promise(resolve => {
                        function onKeyPress(event) {
                            if (event.code === "Space") {
                                document.removeEventListener("keydown", onKeyPress);
                                resolve(event.key);
                            } else if (event.code === "Backspace") {
                                document.removeEventListener("keydown", onKeyPress);
                                resolve(event.key);
                            }
                        }
                        document.addEventListener("keydown", onKeyPress);
                    });
                }

                async function promptQuestion(questionNumber, questionType, answerType) {
                    const questionTypeId = [questions, bonusQuestions1, bonusQuestions2];
                    text = ["Question", "Bonus 1", "Bonus 2"];
                    const newQuestionType = text[questionTypeId.indexOf(questionType)];
                    const questionText = questionType[questionNumber];
                    const words = questionText.split(" ");
                    let questionSeen = "";
                    let currentIndex = 0;
                    let currentBuzzes = [];
                    paused = false;
                    console.log(interrupted)

                    document.getElementById("demo").innerHTML = '<h1 class="pb-4"><strong>' + newQuestionType + "</strong></h1><div id='questionText'></div>";
                    document.getElementById("demo2").innerHTML = "";
                    document.getElementById("output").innerHTML = "";

                    function handleBuzz(event) {
                        if (/^[a-z]$/.test(event.key)) {
                            currentBuzzes.push(event.key.toUpperCase());
                            document.getElementById("demo").innerHTML = `<h1 id='buzz' class='pb-4'>buzzes: ${currentBuzzes.join(' ')} </h1>`;
                            paused = true;
                        }
                    }

                    document.addEventListener("keydown", handleBuzz);

                    return new Promise(resolve => {
                        var questionElement = document.getElementById("questionText");

                        const interval = setInterval(() => {
                            if (interrupted) {
                                clearInterval(interval);
                                interrupted = false;
                                return;
                            }
                            if (!paused) {
                                if (currentIndex < words.length) {
                                    questionElement = document.getElementById("questionText");
                                    console.log(questionElement.innerHTML)
                                    const word = words[currentIndex];
                                    console.log("the word to be added: " + word);
                                    console.log("current index: " + currentIndex);
                                    questionSeen += word + " ";
                                    console.log("hi im here")
                                    questionElement.innerHTML += words[currentIndex] + " ";
                                    console.log("question text after adding: " + questionElement.innerHTML);
                                    currentIndex++;
                                    console.log("current index after adding: " + currentIndex);
                                    console.log("demo: " + document.getElementById("demo").innerHTML);
                                }
                            } else {
                                showAnswer();
                            }
                        }, 500);

                        document.addEventListener("keydown", handleBuzz);

                        async function showAnswer() {
                            document.getElementById("output").innerHTML = "<strong>Press the space bar to see the answer...</strong>";
                            while (true) {
                                const key = await waitForSpacebar();
                                if (key === " " && paused && currentIndex+1 <= words.length) {
                                    console.log("spacebar pressed again")

                                    interrupted = true;
                                    console.log(questionSeen)
                                    console.log(questionText)

                                    const seenText = `<strong>${questionSeen.trim()}</strong>`;
                                    const remainingText = questionText.slice(questionSeen.length).trim();
                                    document.getElementById("demo").innerHTML =
                                        `<h1 class="pb-4"><strong>${newQuestionType}</strong></h1>${seenText} ${remainingText}`;
                                    document.getElementById("output").innerHTML = "";
                                    document.getElementById("demo2").innerHTML = '<h1 class="pb-4"><strong>Answer</strong></h1>' + answerType[questionNumber];
                                    await waitForKeypress();
                                    paused = false;
                                    document.removeEventListener("keydown", handleBuzz);
                                    break;
                                } else if (key === "Backspace") {
                                    document.getElementById("demo").innerHTML = `<h1 class="pb-4"><strong>${newQuestionType}</strong></h1><div id='questionText'></div>`;
                                    document.getElementById("output").innerHTML = "";
                                    document.getElementById("questionText").innerHTML = "";
                                    questionSeen = "";
                                    currentIndex = 0;
                                    currentBuzzes = [];
                                    paused = false;
                                }
                            }
                            resolve();
                        }
                    });
                }

                async function runQA() {
                    document.removeEventListener("keydown", runQA);
                    while (questions.length > 0) {
                        const i = Math.floor(Math.random() * questions.length);
                        
                        await promptQuestion(i, questions, answers);
                        await promptQuestion(i, bonusQuestions1, bonusAnswers1);
                        await promptQuestion(i, bonusQuestions2, bonusAnswers2);

                        document.getElementById("demo2").innerHTML = "";

                        questions.splice(i, 1);
                        answers.splice(i, 1);
                        bonusQuestions1.splice(i, 1);
                        bonusAnswers1.splice(i, 1);
                        bonusQuestions2.splice(i, 1);
                        bonusAnswers2.splice(i, 1);
                    }
                }

                runQA();
            }
            else if (mode === "mobile") {
                function waitForKeypress() {
                    return new Promise(resolve => {
                        function onKeyPress(event) {
                            if (event.key.length === 1) {
                                document.removeEventListener("keydown", onKeyPress);
                                resolve(event.key);
                            }
                        }
                        document.addEventListener("keydown", onKeyPress);
                    });
                }

                let interrupted = false;
                let paused = false;

                function waitForSpacebar() {
                    return new Promise(resolve => {
                        function onKeyPress(event) {
                            if (event.code === "Space") {
                                document.removeEventListener("keydown", onKeyPress);
                                resolve(event.key);
                            } else if (event.code === "Backspace") {
                                document.removeEventListener("keydown", onKeyPress);
                                resolve(event.key);
                            }
                        }
                        document.addEventListener("keydown", onKeyPress);
                    });
                }

                async function promptQuestion(questionNumber, questionType, answerType) {
                    const questionTypeId = [questions, bonusQuestions1, bonusQuestions2];
                    text = ["Question", "Bonus 1", "Bonus 2"];
                    const newQuestionType = text[questionTypeId.indexOf(questionType)];
                    const questionText = questionType[questionNumber];
                    const words = questionText.split(" ");
                    let questionSeen = "";
                    let currentIndex = 0;
                    let currentBuzzes = [];
                    paused = false;
                    console.log(interrupted)

                    document.getElementById("demo").innerHTML = '<h1 class="pb-4"><strong>' + newQuestionType + "</strong></h1><div id='questionText'></div>";
                    document.getElementById("demo2").innerHTML = "";
                    document.getElementById("output").innerHTML = "";

                    function handleBuzz(event) {
                        if (/^[a-z]$/.test(event.key)) {
                            currentBuzzes.push(event.key.toUpperCase());
                            document.getElementById("demo").innerHTML = `<h1 id='buzz' class='pb-4'>buzzes: ${currentBuzzes.join(' ')} </h1>`;
                            paused = true;
                        }
                    }

                    document.addEventListener("keydown", handleBuzz);

                    return new Promise(resolve => {
                        var questionElement = document.getElementById("questionText");

                        const interval = setInterval(() => {
                            if (interrupted || currentIndex >= words.length) {
                                clearInterval(interval);
                                interrupted = false;
                                return;
                            }
                            if (!paused) {
                                questionElement = document.getElementById("questionText");
                                console.log(questionElement.innerHTML)
                                const word = words[currentIndex];
                                console.log("the word to be added: " + word);
                                console.log("current index: " + currentIndex);
                                questionSeen += word + " ";
                                console.log("hi im here")
                                questionElement.innerHTML += words[currentIndex] + " ";
                                console.log("question text after adding: " + questionElement.innerHTML);
                                currentIndex++;
                                console.log("current index after adding: " + currentIndex);
                                console.log("demo: " + document.getElementById("demo").innerHTML);
                            } else {
                                showAnswer();
                            }
                        }, 500);

                        document.addEventListener("keydown", handleBuzz);

                        async function showAnswer() {
                            document.getElementById("output").innerHTML = "<strong>Press the space bar to see the answer...</strong>";
                            while (true) {
                                const key = await waitForSpacebar();
                                if (key === " " && paused) {
                                    console.log("spacebar pressed again")

                                    interrupted = true;
                                    console.log(questionSeen)
                                    console.log(questionText)

                                    const seenText = `<strong>${questionSeen.trim()}</strong>`;
                                    const remainingText = questionText.slice(questionSeen.length).trim();
                                    document.getElementById("demo").innerHTML =
                                        `<h1 class="pb-4"><strong>${newQuestionType}</strong></h1>${seenText} ${remainingText}`;
                                    document.getElementById("output").innerHTML = "";
                                    document.getElementById("demo2").innerHTML = '<h1 class="pb-4"><strong>Answer</strong></h1>' + answerType[questionNumber];
                                    await waitForKeypress();
                                    paused = false;
                                    document.removeEventListener("keydown", handleBuzz);
                                    break;
                                } else if (key === "Backspace") {
                                    document.getElementById("demo").innerHTML = `<h1 class="pb-4"><strong>${newQuestionType}</strong></h1><div id='questionText'></div>`;
                                    document.getElementById("output").innerHTML = "";
                                    document.getElementById("questionText").innerHTML = "";
                                    questionSeen = "";
                                    currentIndex = 0;
                                    currentBuzzes = [];
                                    paused = false;
                                }
                            }
                            resolve();
                        }
                    });
                }

                async function runQA() {
                    document.removeEventListener("keydown", runQA);
                    while (questions.length > 0) {
                        const i = Math.floor(Math.random() * questions.length);

                        await promptQuestion(i, questions, answers);
                        await promptQuestion(i, bonusQuestions1, bonusAnswers1);
                        await promptQuestion(i, bonusQuestions2, bonusAnswers2);

                        document.getElementById("demo2").innerHTML = "";

                        questions.splice(i, 1);
                        answers.splice(i, 1);
                        bonusQuestions1.splice(i, 1);
                        bonusAnswers1.splice(i, 1);
                        bonusQuestions2.splice(i, 1);
                        bonusAnswers2.splice(i, 1);
                    }
                }

                document.addEventListener("keydown", runQA);
            }
        }

        main();
    })
    .catch(error => {
        console.error("Failed to load questions.txt:", error);
    });