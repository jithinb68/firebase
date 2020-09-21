const cafeList = document.getElementById("cafe-list");
const form = document.getElementById('add-cafe-form');

function renderCafe(doc) {
    let li = document.createElement('li');
    let name = document.createElement('span');
    let place = document.createElement('span');
    let cross = document.createElement('div');
    li.setAttribute('data-id', doc.id);
    name.innerHTML =  doc.data().name ;
    place.innerHTML =  doc.data().place;
    cross.innerHTML = 'x';
    li.appendChild(name);
    li.appendChild(place);
    li.appendChild(cross)
    cafeList.appendChild(li);

    cross.addEventListener('click', (e) => {
        e.stopPropagation();
        let id = e.target.parentElement.getAttribute('data-id');
        db.collection('cafes').doc(id).delete();
    })
}


// db.collection('cafes').orderBy('name').get().then((snapshot) => {
//     snapshot.docs.forEach(doc => {
//         renderCafe(doc);
//     })
// })

form.addEventListener('submit', (e) => {
    e.preventDefault();
    db.collection('cafes').add({
        name: form.name.value,
        place: form.place.value
    });
    form.name.value = '';
    form.place.value = '';
})

db.collection('cafes').orderBy('name').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        if(change.type == 'added'){
            renderCafe(change.doc);
        } else if (change.type == 'removed') {
            let li = document.querySelector('[data-id=' + change.doc.id + ']');
            cafeList.removeChild(li);
        }
    });
})