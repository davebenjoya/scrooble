import themesJSON from './themes.json';


const editUser = () => {

// document.querySelector(".edit-page-identifier").load(window.location.href + "/users/edit" )

// changeColors()

  if (document.querySelector('.edit-user-identifier')) {
    document.querySelector('#update-user-changes').addEventListener('click', updateUser);
  }



  function updateUser() {
    console.log(window.location.href )
  }
}

export { editUser }
