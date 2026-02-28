let contactName = document.getElementById("name");
let phone = document.getElementById("phone");
let email = document.getElementById("email");
let address = document.getElementById("address");
let group = document.getElementById("group");
let notes = document.getElementById("notes");
let checkFav = document.getElementById("checkFav");
let checkEmergency = document.getElementById("checkEmergency");
let rowData = document.getElementById("rowData");
let sideFavData = document.getElementById("sideFav");
let sideEmerData = document.getElementById("sideEmer");
let addBtn = document.getElementById("addBtn");
let updateBtn = document.getElementById("updateBtn");
let searchInput = document.getElementById("searchinput");
let contactList = [];

if (JSON.parse(localStorage.getItem("contactList")) !== null) {
  contactList = JSON.parse(localStorage.getItem("contactList"));
  updatefavAside();
  updateEmeAside();
  displayAllContact();
}

function addContact() {
  if (validateEmail() && validatePhone() && validateName()) {
    // Check for duplicate phone number
    let existingContact = contactList.find(
      (c) => c.contactPhone === phone.value,
    );

    if (existingContact) {
      Swal.fire({
        title: "Duplicate Phone Number!",
        text: `A contact with this phone number already exists: ${existingContact.contactName}`,
        icon: "error",
      });
      return; // Stop execution if duplicate found
    }

    // Create new contact object
    let contact = {
      contactName: contactName.value,
      contactPhone: phone.value,
      contactEmail: email.value,
      contactAddress: address.value,
      contactGroup: group.value,
      contactNotes: notes.value,
      contactcheckFav: checkFav.checked,
      contactcheckEmergency: checkEmergency.checked,
    };

    // Add contact to list
    contactList.push(contact);

    // Update UI & storage
    document.getElementById("totalContact").textContent = contactList.length;
    localStorage.setItem("contactList", JSON.stringify(contactList));

    displayAllContact();
    updatefavAside();
    updateEmeAside();
    clearContacts();
    closeModel();

    // Success message
    Swal.fire({
      title: "Added!",
      text: "Contact has been added successfully.",
      icon: "success",
    });
  }
}

function clearContacts() {
  ((contactName.value = null),
    (phone.value = null),
    (email.value = null),
    (address.value = null),
    (group.value = null),
    (notes.value = null),
    (checkFav.checked = false),
    (checkEmergency.checked = false));
}

function updatestar(i) {
  contactList[i].contactcheckFav = !contactList[i].contactcheckFav;
  localStorage.setItem("contactList", JSON.stringify(contactList));
  updatefavAside();
  displayAllContact();
}

function updatefav(i) {
  contactList[i].contactcheckEmergency = !contactList[i].contactcheckEmergency;
  localStorage.setItem("contactList", JSON.stringify(contactList));
  updateEmeAside();
  displayAllContact();
}

function displayAllContact() {
  let data = "";
  for (let i = 0; i < contactList.length; i++) {
    data += `
       <div class="col-12 col-md-6 ">
                  <div class="card p-2">

                    <div class="title d-flex align-content-center">
                      <div class="name rounded-3 d-flex justify-content-center align-items-center me-3">
                        <span class="">${getInitials(contactList[i].contactName)}</span>
                   
                        ${
                          contactList[i].contactcheckFav
                            ? `  <div class="favorite p-1 rounded-4"> <i class="fa-solid fa-star fa-md "
                            style="color: #ffffff;"></i> </div> `
                            : ``
                        }
                      
                         ${
                           contactList[i].contactcheckEmergency
                             ? `  <div class="emergency  p-1 rounded-4"> <i class="fa-solid fa-heart-pulse fa-md"
                            style="color: #ffffff;"></i> </div>`
                             : ``
                         }
                       
                      </div>

                      <div class="details">
                        <h3>${contactList[i].contactName}</h3>
                        <h4><i class="fa-solid fa-phone me-2 p-1 rounded-3"></i>${contactList[i].contactPhone}</h4>
                      </div>
                    </div>

                    <div class="content">
                      <div class="email">
                        <i class="fa-solid fa-envelope rounded-1 mb-1 p-2" style="color: #612a8d;"></i>
                        <p class="d-inline">${contactList[i].contactEmail}</p>
                      </div>

                      <div class="location">
                        <i class="fa-solid fa-location-dot rounded-1 p-2" style="color: #009e77;"></i>
                        <p class="d-inline">${contactList[i].contactAddress}</p>
                      </div>

                      <div class="feature pt-2">
                           ${contactList[i].contactGroup === "Select a group" ? `` : `<span class="group px-2 py-1 rounded-1">${contactList[i].contactGroup}</span>`}
                      
                        
                        ${
                          contactList[i].contactcheckEmergency
                            ? `   <span class="emergency px-2 py-1 rounded-1"> <i
                            class="fa-solid fa-heart-pulse fa-md me-1"></i> Emergency </span>`
                            : ``
                        }
                      
                      </div>
                    </div>

                    <div class="footer mt-3 d-flex justify-content-between">
                      <div class="right">
                        <button class="phone"><i class="fa-solid fa-phone rounded-3 me-1"></i></button>
                        <button class="msg"><i class="fa-solid fa-envelope rounded-3 "></i></button>
                      </div>

                      <div class="left">
                       ${contactList[i].contactcheckFav ? `  <button class="star" onclick="updatestar(${i})"><i class="fa-solid fa-star rounded-3 "></i></button> ` : ` <button class="offStar" onclick="updatestar(${i})"><i class="fa-regular fa-star rounded-3 "></i></button>`}
                       ${contactList[i].contactcheckEmergency ? `  <button class="fav" onclick="updatefav(${i})"><i class="fa-solid fa-heart-pulse rounded-3 "></i></button> ` : ` <button class="offStar" onclick="updatefav(${i})"><i class="fa-regular fa-heart rounded-3 "></i></button>`}
                      
                           
                       
                        
                        <button class="edit" data-bs-toggle="modal"
          data-bs-target="#staticBackdrop" onclick="setUpdateInfo(${i})"><i class="fa-solid fa-pen "></i></button>
                        <button class="delete" onclick="deleteContact(${i})"><i class="fa-solid fa-trash"></i></button>
                      </div>
                    </div>

                  </div>
                </div>
      
      `;
  }
  rowData.innerHTML = data;
  document.getElementById("totalContact").textContent = `${contactList.length}`;
}

function updatefavAside() {
  let favCount = 0;
  let data = "";
  for (let i = 0; i < contactList.length; i++) {
    if (contactList[i].contactcheckFav) {
      favCount++;
      data += ` 
    <div class="contact d-flex align-items-center px-1 rounded-3 mb-2">
                      <div class="name rounded-3 d-flex justify-content-center align-items-center me-2">
                        <span class="">${getInitials(contactList[i].contactName)}</span>
                      </div>
                      <div class="details">
                        <h5 class="pt-2">${contactList[i].contactName}</h5>
                        <p>${contactList[i].contactPhone}</p>
                      </div>
                      <div class="icon ms-auto p-2 rounded-2">
                        <i class="fa-solid fa-phone  "></i>
                      </div>
                    </div>`;
    }
  }
  document.getElementById("favcount").textContent = `${favCount}`;
  sideFavData.innerHTML = data;
}

function updateEmeAside() {
  let emerCount = 0;
  let data = "";
  for (let i = 0; i < contactList.length; i++) {
    if (contactList[i].contactcheckEmergency) {
      emerCount++;
      data += ` 
        <div class="contact d-flex align-items-center px-1 rounded-3 mb-2">
                      <div class="name rounded-3 d-flex justify-content-center align-items-center me-2">
                       <span class="">${getInitials(contactList[i].contactName)}</span>
                      </div>
                      <div class="details">
                        <h5 class="pt-2">${contactList[i].contactName}</h5>
                        <p>${contactList[i].contactPhone}</p>
                      </div>
                      <div class="icon ms-auto p-2 rounded-2">
                        <i class="fa-solid fa-phone  "></i>
                      </div>
                    </div>
`;
    }
  }
  document.getElementById("emercount").textContent = `${emerCount}`;
  sideEmerData.innerHTML = data;
}

function deleteContact(i) {
  contactList.splice(i, 1);
  localStorage.setItem("contactList", JSON.stringify(contactList));
  displayAllContact();
  updatefavAside();
  updateEmeAside();
}

function setUpdateInfo(i) {
  currentIndex = i;
  ((contactName.value = contactList[i].contactName),
    (phone.value = contactList[i].contactPhone),
    (email.value = contactList[i].contactEmail),
    (address.value = contactList[i].contactAddress),
    (group.value = contactList[i].contactGroup),
    (notes.value = contactList[i].contactNotes),
    (checkFav.checked = contactList[i].contactcheckFav),
    (checkEmergency.checked = contactList[i].contactcheckEmergency));

  addBtn.classList.add("d-none");
  updateBtn.classList.remove("d-none");
}

function updateContact() {
  contact = {
    contactName: contactName.value,
    contactPhone: phone.value,
    contactEmail: email.value,
    contactAddress: address.value,
    contactGroup: group.value,
    contactNotes: notes.value,
    contactcheckFav: checkFav.checked,
    contactcheckEmergency: checkEmergency.checked,
  };
  contactList.splice(currentIndex, 1, contact);
  localStorage.setItem("contactList", JSON.stringify(contactList));
  clearContacts();
  displayAllContact();
  updatefavAside();
  updateEmeAside();
  updateBtn.classList.add("d-none");
  addBtn.classList.remove("d-none");
  closeModel();
}

function closeModel() {
  const modal = bootstrap.Modal.getInstance(
    document.getElementById("staticBackdrop"),
  );
  modal.hide();
}

function searchContact() {
  let term = searchInput.value;
  let data = ``;
  for (let i = 0; i < contactList.length; i++) {
    if (
      contactList[i].contactName.toUpperCase().includes(term.toUpperCase()) ||
      contactList[i].contactEmail.toUpperCase().includes(term.toUpperCase()) ||
      contactList[i].contactPhone.toUpperCase().includes(term)
    ) {
      data += `
       <div class="col-12 col-md-6 ">
                  <div class="card p-2">

                    <div class="title d-flex align-content-center">
                      <div class="name rounded-3 d-flex justify-content-center align-items-center me-3">
                        <span class="">IE</span>
                   
                        ${
                          contactList[i].contactcheckFav
                            ? `  <div class="favorite p-1 rounded-4"> <i class="fa-solid fa-star fa-md "
                            style="color: #ffffff;"></i> </div> `
                            : ``
                        }
                      
                         ${
                           contactList[i].contactcheckEmergency
                             ? `  <div class="emergency  p-1 rounded-4"> <i class="fa-solid fa-heart-pulse fa-md"
                            style="color: #ffffff;"></i> </div>`
                             : ``
                         }
                       
                      </div>

                      <div class="details">
                        <h3>${contactList[i].contactName}</h3>
                        <h4><i class="fa-solid fa-phone me-2 p-1 rounded-3"></i>${contactList[i].contactPhone}</h4>
                      </div>
                    </div>

                    <div class="content">
                      <div class="email">
                        <i class="fa-solid fa-envelope rounded-1 mb-1 p-2" style="color: #612a8d;"></i>
                        <p class="d-inline">${contactList[i].contactEmail}</p>
                      </div>

                      <div class="location">
                        <i class="fa-solid fa-location-dot rounded-1 p-2" style="color: #009e77;"></i>
                        <p class="d-inline">${contactList[i].contactAddress}</p>
                      </div>

                      <div class="feature pt-2">
                        <span class="group px-2 py-1 rounded-1">${contactList[i].contactGroup}</span>
                        ${
                          contactList[i].contactcheckEmergency
                            ? `   <span class="emergency px-2 py-1 rounded-1"> <i
                            class="fa-solid fa-heart-pulse fa-md me-1"></i> Emergency </span>`
                            : ``
                        }
                      
                      </div>
                    </div>

                    <div class="footer mt-3 d-flex justify-content-between">
                      <div class="right">
                        <button class="phone"><i class="fa-solid fa-phone rounded-3 me-1"></i></button>
                        <button class="msg"><i class="fa-solid fa-envelope rounded-3 "></i></button>
                      </div>

                      <div class="left">
                        <button class="star" onclick="updatestar(${i})"><i class="fa-solid fa-star rounded-3 "></i></button>
                        <button class="fav" onclick="updatefav(${i})"><i class="fa-solid fa-heart-pulse rounded-3 "></i></button>
                        <button class="edit" data-bs-toggle="modal"
          data-bs-target="#staticBackdrop" onclick="setUpdateInfo(${i})"><i class="fa-solid fa-pen "></i></button>
                        <button class="delete" onclick="deleteContact(${i})"><i class="fa-solid fa-trash"></i></button>
                      </div>
                    </div>

                  </div>
                </div>
      
      `;
    }
  }
  rowData.innerHTML = data;
}

function getInitials(fullName) {
  let parts = fullName.trim().split(/\s+/);

  if (parts.length === 1) return parts[0][0].toUpperCase();

  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function validatePhone() {
  var regex = /^(?:\+20\s?|0)?1[0-2,5]\d{8}$/gm;
  var validphone = phone.value;
  let validateNote = document.getElementById("validatep");
  if (regex.test(validphone)) {
    validateNote.classList.add("d-none");
    return true;
  } else {
    validateNote.classList.remove("d-none");
    return false;
  }
}

function validateEmail() {
  var regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/gm;
  var validemail = email.value;
  let validateNote = document.getElementById("validatee");
  if (regex.test(validemail)) {
    validateNote.classList.add("d-none");
    return true;
  } else {
    validateNote.classList.remove("d-none");
    return false;
  }
}

function validateName() {
  var regex = /^^.{3,}$/gm;
  var valideName = contactName.value;
  let validateNote = document.getElementById("validaten");
  if (regex.test(valideName)) {
    validateNote.classList.add("d-none");
    return true;
  } else {
    validateNote.classList.remove("d-none");
    return false;
  }
}

