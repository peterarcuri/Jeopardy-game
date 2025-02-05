// categories is the main data structure for the app; it looks like this:

//  [
//    { title: "Math",
//      clues: [
//        {question: "2+2", answer: 4, showing: null},
//        {question: "1+1", answer: 2, showing: null}
//        ...
//      ],
//    },
//    { title: "Literature",
//      clues: [
//        {question: "Hamlet Author", answer: "Shakespeare", showing: null},
//        {question: "Bell Jar Author", answer: "Plath", showing: null},
//        ...
//      ],
//    },
//    ...
//  ]

document.getElementById("start-game").addEventListener('click', async() => {
    showLoadingView(); // Show loading spinner    
    const categories = await getCategoryIds(); // Fetch category data
    hideLoadingView(); //Hide loading spinner and reset button text
    await fillTable(categories); // Ensure table is filled after fetching categories
    
});

async function getCategoryCount() {
    const res = await axios.get("https://rithm-jeopardy.herokuapp.com/api/categories?count=100");

    const rawCategories = res.data;
    
    let categoryObjs = _.take(_.shuffle(rawCategories), 6);
    let categoryIds = categoryObjs.map(cat => cat.id);

    return categoryIds;

    /** Get NUM_CATEGORIES random category from API.
 *
 * Returns array of category ids
 */

}

async function getCategoryIds() {

    const categoryIds = await getCategoryCount();
    const categories = [];

    for (let id of categoryIds) {

        const res = await axios.get(`https://rithm-jeopardy.herokuapp.com/api/category?id=${id}`);
        const data = res.data;
        const title = data.title;

        const cluesFor2 = data.clues.map(clue => { return {question: clue.question, answer: clue.answer, showing: null} });



    categories.push({ title: title, clues: cluesFor2});
    }    

    return categories;


    /** Return object with data about a category:
 *
 *  Returns { title: "Math", clues: clue-array }
 *
 * Where clue-array is:
 *   [
 *      {question: "Hamlet Author", answer: "Shakespeare", showing: null},
 *      {question: "Bell Jar Author", answer: "Plath", showing: null},
 *      ...
 *   ]
 */

}

const nums_Questions_Per_Cat = 5;

function getCategory(categories) {

    const thead = document.getElementById('category-row');
    thead.innerHTML = ""; // Clear any existing content    

    

    // Create table header row for category titles
    for (let category of categories) {
        const th = document.createElement('th');
        th.innerText = category.title;        
        th.className = 'clue-box category-box';
        thead.appendChild(th);
    }
}




/** Fill the HTML table#jeopardy with the categories & cells for questions.
 *
 * - The <thead> should be filled w/a <tr>, and a <td> for each category
 * - The <tbody> should be filled w/NUM_QUESTIONS_PER_CAT <tr>s,
 *   each with a question for each category in a <td>
 *   (initally, just show a "?" where the question/answer would go.)
 */

async function fillTable(categories) {

    getCategory(categories); // Call getCategory to populate the category row

    const tbody = document.getElementById('clue-board');
    tbody.innerHTML = ""; // Clears any existing rows
    

    // Loop over each row of questions for specified number of questions per category
    for (let i = 0; i < nums_Questions_Per_Cat; i++) {
        const row = document.createElement('tr');
        row.className = "clue-row";

        for (let category of categories) {
            const clue = category.clues[i]; // Get the current clue for this category

            const td = document.createElement('td');
            td.className = 'clue-box';
            td.innerText = "?"; // Initial placeholder
            td.onclick = () => handleClueClick(td, clue); // Attach click event

            row.appendChild(td);
        }
        tbody.appendChild(row);
    }
}

function handleClueClick(td, clue) {  // Function handles clicking on a clue
    if (clue.showing === null) {
        td.innerText = clue.question;
        clue.showing = "question";
    } else if (clue.showing === "question") {
        td.innerText = clue.answer;
        clue.showing = "answer";
        td.style.backgroundColor = "green"; // Change background color when clicked on
    }
}




/** Handle clicking on a clue: show the question or answer.
 *
 * Uses .showing property on clue to determine what to show:
 * - if currently null, show question & set .showing to "question"
 * - if currently "question", show answer & set .showing to "answer"
 * - if currently "answer", ignore click
 * */

function handleClick(evt) {

    // Clear the current Jeopardy board
    const tbody = document.getElementById('clue-board');
    tbody.innerHTML = ""; // Wipes the current board content

    const thead = document.getElementById('category-row');
    thead.innerHTML = "";

    // Show the laoding spinner in the board
    const spinnerRow = document.createElement('tr');
    const spinnerCell = document.createElement('td');
    spinnerCell.colSpan = 6; // Span across all category columns
    spinnerCell.className = 'loading-spinner';
    spinnerCell.innerText = "Loading...";
    spinnerRow.appendChild(spinnerCell);
    tbody.appendChild(spinnerRow);

    // Update button text to indicate loading
    const startButton = document.getElementById('start-game');
    startButton.innerText = "Loading...";

    
}

/** Wipe the current Jeopardy board, show the loading spinner,
 * and update the button used to fetch data.
 */

function showLoadingView() {

    // find the loading spinner in the clue board and remove it
    const tbody = document.getElementById('clue-board');
    tbody.innerHTML = ""; // Clear the board content

    // Create and display the loading spinner
    const spinnerRow = document.createElement('tr');
    const spinnerCell = document.createElement('td');
    spinnerCell.colSpan = 6; // Span across all category columns
    spinnerCell.className = 'loading-spinner';
    spinnerCell.innerText = "Loading...";
    spinnerRow.appendChild(spinnerCell);
    tbody.appendChild(spinnerRow);

    const startButton = document.getElementById('start-game'); // Fix undefined reference
    startButton.innerText = "Loading...";

}

/** Remove the loading spinner and update the button used to fetch data. */

function hideLoadingView() {

    // Find and remove the loading spinner in the clue board
    const tbody = document.getElementById('clue-board');
    tbody.innerHTML = ""; // Clears the loading Spinner
    
    // Reset the Start Game button text
    const startButton = document.getElementById('start-game');
    startButton.innerText = "Start Game";
}

/** Start game:
 *
 * - get random category Ids
 * - get data for each category
 * - create HTML table
 * */

async function setupAndStart() {

    // Clear the current Jeoaprdy board and show loading spinner
    showLoadingView();

    // Fetch new category data
    const categories = await getCategoryIds();

    // Hide laoding spinner once data is fetched
    hideLoadingView();

    // Fill the table with the new categories and clues
    await fillTable(categories);

    
}

/** On click of start / restart button, set up game. */

// TODO

/** On page load, add event handler for clicking clues */

// TODO