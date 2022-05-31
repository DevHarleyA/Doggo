document.querySelector('#new').addEventListener('click', newPet)
const dlt = document.getElementsByClassName('fa-ban')

function newPet() {
    document.querySelector('#newPet').classList.toggle('hide')
}

Array.from(dlt).forEach(function(element) {
  element.addEventListener('click', function(){
    const name = this.parentNode.childNodes[1].childNodes[2].innerText
    console.log(name)
  
    fetch('deletePet', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'name': name
      })
    })
    .then(function (response) {
      window.location.reload()
    })
  });
});
