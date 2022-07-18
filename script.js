const inputBar = document.getElementById("input-bar");
const submitBtn = document.getElementById("submit");
const container = document.querySelector('.container');
const bulletin = document.querySelector('.bulletin-board');
const storage = document.querySelector('.store-new-note');
// const completed = document.getElementById('bulletin-board-done');
let notes = document.querySelectorAll('.note');


//get notes from local storage
const getNote = function(){
    const todosJson = localStorage.getItem('todos');
    try{
        return todosJson ? JSON.parse(todosJson) : []
    } catch(err){
        console.log(err)
        return []
    } 
}

let todos = getNote('todos');

// //create note object
function Note(text, id){
    this.content = text;
    this.status = [];
    this.id = id;
    
}

// //create new note, store in local storage
const createNewNoteObject = function(text){
    if(text !== ''){
        const noteId = (Date.now() + "").slice(-10);
        const noteObject = new Note(text, noteId);
        todos.push(noteObject);
        //store in local storage
        localStorage.setItem('todos', JSON.stringify(todos));
        inputBar.value = '';  
        return noteObject         
    }
}
console.log(todos)
//render note
const renderNotes = function(note){
    // let noteEl = `
    //     <div class="note" draggable="true" class=${note.status} id=${note.id}>
    //         <input type="text" class="note__content" value=${note.content}>
    //         <i class="fa-regular fa-pen-to-square"></i>
    //         <i class="fa-solid fa-xmark"></i>
    //     </div>`
        const noteEl = document.createElement('div');
        noteEl.classList.add('note');
        if(note.status[0]) noteEl.classList.add('note-done');
        

        console.log(noteEl);
        noteEl.setAttribute('id', note.id);
        noteEl.setAttribute('draggable', 'true');

        let noteElInnerHTML = `
            <i class="fa-regular fa-pen-to-square"></i>
            <i class="fa-solid fa-xmark"></i>`
        noteEl.innerHTML = noteElInnerHTML;

        if(!note.status[0]) noteEl.insertAdjacentHTML('afterbegin', '<i class="fa-regular fa-square"></i>')
        else noteEl.insertAdjacentHTML('afterbegin', '<i class="fa-regular fa-square-check"></i>')
        
        const noteContent = document.createElement('input');
        noteContent.setAttribute('type', "text");
        noteContent.setAttribute('value', note.content);
        noteContent.setAttribute('readonly', 'readonly');

        noteContent.classList.add('note__content');
        noteEl.insertAdjacentElement('afterbegin', noteContent)
  
        bulletin.insertAdjacentElement('beforeend', noteEl)
}
//load: render old notes
window.addEventListener('load' , (e)=>{
    todos.forEach((todo)=>{
        renderNotes(todo)
    })
    
})
// //submit / enter : render new note


submitBtn.addEventListener('click', (e)=>{
    if(!inputBar.value){
         alert('note cannot be empty');
        return
    }
    else{
        // if(!e.target.classList.contains('editing'))
        renderNotes(createNewNoteObject(inputBar.value));
        }
    });
    
inputBar.addEventListener('keypress', (e)=>{
        if(e.key == 'Enter'){
            if(!inputBar.value) alert('note cannot be empty');
            // else if(!e.target.classList.contains('editing')){
            renderNotes(createNewNoteObject(inputBar.value))};
    
    })



// //delete note

bulletin.addEventListener('click', (e)=>{
        if(e.target.classList.contains('fa-xmark')){
            const deletedEl = e.target.parentNode;
            //delete from local storage
            todos = todos.filter((todo)=>{
            return todo.id !== deletedEl.getAttribute('id');
            })
            localStorage.setItem('todos', JSON.stringify(todos));
            deletedEl.remove()
        }
    })




//edit note
const editNote = function(e){
    if(e.target.classList.contains('fa-pen-to-square')){
        const editingNote = e.target.parentNode;
        const editingNoteContent = editingNote.firstElementChild;
        let editingNoteContentValue = editingNoteContent.getAttribute('value');
        

        editingNoteContent.removeAttribute('readonly');
        editingNoteContent.focus();
        editingNote.removeAttribute('draggable');

        //replace edit button to save button
        const saveBtn = document.createElement('i');
        saveBtn.classList.add("fa-regular", "fa-floppy-disk");  
        const editingBtn = editingNoteContent.nextElementSibling.nextElementSibling;
        editingNote.replaceChild(saveBtn, editingBtn);
        console.log(editingBtn)
        //saving
        saveBtn.addEventListener('click', (e)=>{
            const inputContent = editingNoteContent.value;
            editingNote.replaceChild(editingBtn, saveBtn);
            editingNoteContent.setAttribute('value', inputContent);
            //update object
            todos.forEach((todo)=>{
                if(todo.id === editingNote.id) todo.content = inputContent
            })
            //set localstorage
            localStorage.setItem('todos', JSON.stringify(todos));
            editingNoteContent.setAttribute('readonly', 'readonly');
            editingNote.setAttribute('draggable', 'true')
        })
        
    }

}

const checkNote = function(e){
    if(e.target.classList.contains('fa-square') || e.target.classList.contains('fa-square-check')){
        const checkedNote = e.target.parentNode;
        const checkBox = checkedNote.firstElementChild.nextElementSibling;
        // checkBox.classList.remove('fa-square');
        // checkBox.classList.add('fa-square-check');
        checkBox.classList.toggle('fa-square');

        checkBox.classList.toggle('fa-square-check');
        checkedNote.classList.toggle('note-done');
        console.log(checkedNote.className);

        todos.forEach((todo)=>{
            if(todo.id === checkedNote.getAttribute('id')){
                if(!todo.status[0]) todo.status.push('note-done')
                else todo.status = []
                
            }
        })
        localStorage.setItem('todos', JSON.stringify(todos));
    }
}

bulletin.addEventListener('click', editNote)
bulletin.addEventListener('click', checkNote)
//dragging functionality
// for(const dropZone of document.querySelectorAll('.drop-zone')){
//     dropZone.addEventListener('dragstart', (e)=>{
//         if(e.target.classList.contains('note')){
//             const id = e.target.getAttribute('id')
//             e.dataTransfer.setData("taskItem", id)
//         }
          
//     })

//     dropZone.addEventListener('dragover', (e)=>{
//         e.preventDefault();
//         e.dataTransfer.dropEffect = 'move'
//     })

//     dropZone.addEventListener('drop', (e)=>{
//         e.preventDefault(); 
//         if(e.target.classList.contains('drop-zone')){    
//         const draggingElId = e.dataTransfer.getData('taskItem');
//         const draggingEl = document.getElementById(id);
//         e.target.append(document.getElementById(id));
      
//         clearClass(draggingEl);
//         //根據drop的地點調整local storage
//         if(e.target.classList.contains('drop-zone-done')){
//             //localstorage的todos中刪除，加入completedTodos
//             draggingEl.classList.add('done')
//             deleteFromLocalStorage(todos, 'todos', draggingEl.textContent);
//             storeObjectInLocalStorage(completedTodos, 'todos-done', draggingEl.textContent)
//         }else if(e.target.classList.contains('bulletin-board')){
//             draggingEl.classList.add('active');
//             storeObjectInLocalStorage(todos, 'todos', draggingEl.textContent);
//             deleteFromLocalStorage(completedTodos, 'todos-done', draggingEl.textContent)
//         }}



//     })
// }



