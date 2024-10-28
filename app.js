// Initialize game board on page load

initCatRow();
initBoard();

document.querySelector('button').addEventListener('click', restartGame);

let questionsData = [];

// RESTART GAME

function restartGame() {

    clearBoard(); // Clear the category row and board

    initCatRow(); // Initialize new categories and board
    initBoard();

    buildCategories(); // Load new categories and questions

}


// CREATE CATEGORY ROW

function initCatRow() {

    let catRow = document.getElementById('category-row');

    for(let i=0; i < 6; i++) {
        let box = document.createElement('div');
        box.className = 'clue-box category-box';   
        catRow.appendChild(box) // for every box we create, we put it into its parent row
    }
}



// CREATE CLUE BOARD

function initBoard() {

    let board = document.getElementById('clue-board');

    // Generate 5 Rows, then place 6 Boxes in each row

    for(let i = 0; i < 5; i++) {
        let row = document.createElement('div');
        let boxSign = '?';
        row.className = 'clue-row';

        for(let j=0; j < 6; j++) {
            let box = document.createElement('div');
            box.className = 'clue-box';
            box.textContent = boxSign;
            box.addEventListener('click', getClue);
            row.appendChild(box) // for every box we create, we put it into its parent row
        }

        board.appendChild(row);
    }

}
    // Clear the category row and clue board

    function clearBoard() {
        document.getElementById('category-row').innerHTML = '';
        document.getElementById('clue-board').innerHTML = '';
    }

    // CALL API


    async function buildCategories() {
    
        const url = `https://opentdb.com/api.php?amount=50&type=multiple`;

        const response = await axios.get(url);
        let catArray = response.data.results.map(result => result.category);

        let uniqueCategories = [...new Set(catArray)].slice(0, 6); // Create a set to filer out duplicate categories

        questionsData = uniqueCategories.map(category => {  // Organize questions by category
            
                    let questions = response.data.results
                    .filter(result => result.category === category)
                    .map(result => ({
                        question: result.question,
                        correct_answer: result.correct_answer
                    }));
                
                // Ensure each category has 5 questions
                while (questions.length < 5) {
                    questions.push({ question: "No question available", correct_answer: ""});
                }

                return { category, questions };
            
        });


        setCategories(uniqueCategories);

}

    function setCategories(catArray) {

        let element = document.getElementById('category-row');
        let children = element.children;

        for(let i = 0; i < 6; i++) {
            children[i].innerHTML = catArray[i] || "Category " + (i + 1); // Fallback in case of missing data
        }        
}


    // Display CLUE or ANSWER in the CLICKED BOX

    function getClue(event) {

    const box = event.target;

    // Get the row and column index from the box's parent (clue row) and it position
    const rowElement = box.parentElement

    const rowIndex = Array.from(rowElement.parentElement.children).indexOf(rowElement);
    const colIndex = Array.from(rowElement.children).indexOf(box);

    const currentCategory = questionsData[colIndex];

    if (!currentCategory) return; // just in case there's an invalid index or no category data
    
    const question = currentCategory.questions[rowIndex];

    if(box.textContent === '?') {

        box.textContent = question.question; // show the question text if box displays '?'

    } else if(box.textContent === question.question) {

        box.textContent = question.correct_answer;
    }
}
