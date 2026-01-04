
var FullNameInput = document.getElementById("fullName")
var PhoneNumberInput = document.getElementById("phoneNumber")
var EmailAddressInput = document.getElementById("emailAddress")
var AddressInput = document.getElementById("address")
var GroupInput = document.getElementById("group")
var NotesInput = document.getElementById("notes")
var IsFavoriteInput = document.getElementById("isFavorite")
var IsEmergencyInput = document.getElementById("isEmergency")



var ContactDatabase = JSON.parse(localStorage.getItem('contacts')) || []
DisplayData()


var isFormValid = false
function AddContact() {


    var name = FullNameInput.value.trim();
    var phone = PhoneNumberInput.value.trim();
    var email = EmailAddressInput.value.trim();

    var fullName = /^[a-zA-Z0-9-\sأ-ي]{2,50}$/;
    var emailAddress = /^[\w\.]{3,50}@(gmail|Gmail|yahoo|Yahoo)\.com$/;
    var phoneNumber = /^(002|\+2)?01[0125][0-9]{8}$/;



    if (!fullName.test(name)) {
        Swal.fire({
            icon: "error",
            title: "Missing Name",
            text: " Name should contain only letters and spaces (2-50 characters)",
        });
        return;
    }
    if (!phoneNumber.test(phone)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Phone Number",
            text: "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)",
        });
        return;
    }

    if (!emailAddress.test(email)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Email",
            text: "Please enter a valid email address",
        });
        return;
    }
    Swal.fire({
        icon: "success",
        title: "Contact Added Successfully!",
        showConfirmButton: false,
        timer: 1500,
    });


    if (isFormValid) {

        var ContactObject = {
            name: FullNameInput.value.trim(),
            phone: PhoneNumberInput.value,
            email: EmailAddressInput.value.trim(),
            address: AddressInput.value,
            group: GroupInput.value,
            notes: NotesInput.value,
            favorite: IsFavoriteInput.checked,
            emergency: IsEmergencyInput.checked,

        }

        ContactDatabase.push(ContactObject)

        localStorage.setItem('contacts', JSON.stringify(ContactDatabase))

        DisplayData()

        RestForm()


        var modalEl = document.getElementById("addContactModal");
        var modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
        modalInstance.hide();



    }





}



function DisplayData() {


    var cartona = ""

    if (ContactDatabase.length === 0) {
        cartona = `
    
        <div id="isExtended" class=" alert  w-50 text-center text-secondary m-auto  my-5   rounded-2 p-1 pb-1 ">
        <h5 class=" fs-5  text-center">
            No contacts found
        </h5>
        <p class="text-center fst-normal  " >Click "Add Contact" to get started</p>
                    </div>
        `;
    } else {
        for (var i = 0; i < ContactDatabase.length; i++) {

            cartona +=
                `
                    <div class="col-md-6">    
                    <div class="contact-card">
                    <div class="contact-header">
                    <div class="contact-avatar ${ContactDatabase[i].favorite ? 'favorite' : ''} 
                    ${ContactDatabase[i].emergency ? 'emergency' : ''}">
                    ${ContactDatabase[i].name.split(" ").map(w => w[0]).join("").slice(0, 1)}
                    
                        </div>
                        <div class="contact-info">
                        <h4>${ContactDatabase[i].name}</h4>
                        </div>
                        </div>
                        <div class="contact-details">
                        <div class="contact-detail phone">
                        <i class="fas fa-phone text-primary  "></i>
                        <span class="text-secondary">${ContactDatabase[i].phone}</span>
                        </div>
                        <div class="contact-detail email ">
                        <i class="fas fa-envelope"></i>
                        <span >${ContactDatabase[i].email}</span>
                        </div>
                        <div class="contact-detail address">
                        <i class="fas fa-map-marker-alt"></i>
                        <span >${ContactDatabase[i].address}</span>
                        </div>
                        </div>
                        <div class="contact-tags">
                        <span class="tag family">${ContactDatabase[i].group}</span>
                        ${ContactDatabase[i].emergency ? `
                        <span class="tag emergency">
                        <i class="fas fa-heartbeat"></i> Emergency
                        </span>
`                       : ""}
                        </div>
                        <div class="contact-actions">
                        <button class="contact-action call " title="Call">
                        
                        <a href="tel:${ContactDatabase[i].phone}"><i class="fas fa-phone text-success"></i></a>
                        <a href=""></a>
                        </button>
                        <button class="contact-action email" title="Email">
                        <a href="mailto:${ContactDatabase[i].email}"><i class="fas fa-envelope "></i></a>
                        
                        </button>
                        <button class="contact-action favorite active" title="Favorite">
                        <i class="fa-regular fa-star"></i>
                        </button>
                        <button class="contact-action emergency active" title="Emergency">
                        <i class="fa-regular fa-heart"></i>
                        </button>
                        <button onclick="EditContact(${i})" class="contact-action edit " title="Edit">
                        <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="DeleteContact(${i})" class="contact-action delete" title="Delete">
                        <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    </div>
                    </div> 

        `

        }
    }



    document.getElementById("rowData").innerHTML = cartona

}



function RestForm() {
    FullNameInput.value = ""
    PhoneNumberInput.value = ""
    EmailAddressInput.value = ""
    AddressInput.value = ""
    GroupInput.value = ""
    NotesInput.value = ""
    IsFavoriteInput.checked = ""
    IsEmergencyInput.checked = ""
}


function DeleteContact(index) {

    Swal.fire({
        title: "Delete Contact?",
        text: "Are you sure you want to delete ? This action cannot be undone.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
        confirmButtonColor: "#C62222",
        cancelButtonColor: "#606773"
    }).then((result) => {

        if (result.isConfirmed) {

            // 🗑️ المسح
            ContactDatabase.splice(index, 1);
            localStorage.setItem('contacts', JSON.stringify(ContactDatabase));
            DisplayData();

            Swal.fire(
                "Deleted!",
                "Your item has been deleted.",
                "success"
            );

        } else {
            // ❌ Cancel
            console.log("تم الإلغاء");
        }

    });
}



var itemIndex;
function EditContact(contactIndex) {


    itemIndex = contactIndex

    document.getElementById("saveContactBtn").style.display = "none"
    document.getElementById("updateContactBtn").style.display = "block"

    FullNameInput.value = ContactDatabase[contactIndex].name
    PhoneNumberInput.value = ContactDatabase[contactIndex].phone
    EmailAddressInput.value = ContactDatabase[contactIndex].email
    AddressInput.value = ContactDatabase[contactIndex].address
    GroupInput.value = ContactDatabase[contactIndex].group
    NotesInput.value = ContactDatabase[contactIndex].notes
    IsFavoriteInput.checked = ContactDatabase[contactIndex].favorite
    IsEmergencyInput.checked = ContactDatabase[contactIndex].emergency

    var modal = new bootstrap.Modal(
        document.getElementById("addContactModal")
    );
    modal.show();
    document.getElementById("addContactModalLabel").innerText = "Update Contact";
}



function updateItem() {


    var name = FullNameInput.value.trim();
    var phone = PhoneNumberInput.value.trim();
    var email = EmailAddressInput.value.trim();




    var fullName = /^[a-zA-Z0-9-\sأ-ي]{2,50}$/;
    var emailAddress = /^[\w\.]{3,50}@(gmail|Gmail|yahoo|Yahoo)\.com$/;
    var phoneNumber = /^(002|\+2)?01[0125][0-9]{8}$/;

    if (!phoneNumber.test(phone)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Phone Number",
            text: "Please enter a valid Egyptian phone number (e.g., 01012345678 or +201012345678)",
        });
        return;
    }


    if (!fullName.test(name)) {
        Swal.fire({
            icon: "error",
            title: "Missing Name",
            text: " Name should contain only letters and spaces (2-50 characters)",
        });
        return;
    }


    if (!emailAddress.test(email)) {
        Swal.fire({
            icon: "error",
            title: "Invalid Email",
            text: "Please enter a valid email address",
        });
        return;
    }
    document.getElementById("saveContactBtn").style.display = "block"
    document.getElementById("updateContactBtn").style.display = "none"

    ContactDatabase[itemIndex].name = FullNameInput.value.trim();
    ContactDatabase[itemIndex].phone = PhoneNumberInput.value
    ContactDatabase[itemIndex].email = EmailAddressInput.value
    ContactDatabase[itemIndex].address = AddressInput.value
    ContactDatabase[itemIndex].group = GroupInput.value
    ContactDatabase[itemIndex].notes = NotesInput.value
    ContactDatabase[itemIndex].favorite = IsFavoriteInput.checked
    ContactDatabase[itemIndex].emergency = IsEmergencyInput.checked
    localStorage.setItem('contacts', JSON.stringify(ContactDatabase))
    DisplayData()
    RestForm()
    var modalEl = document.getElementById("addContactModal");
    var modalInstance = bootstrap.Modal.getOrCreateInstance(modalEl);
    modalInstance.hide();
    document.getElementById("addContactModalLabel").innerText = "Add New Contact";
    Swal.fire({
        icon: "success",
        title: "Updated Successfully!",
        showConfirmButton: false,
        timer: 1500,
    });
}


function search(searchWord) {

    var cartona = ""

    for (var i = 0; i < ContactDatabase.length; i++) {

        if (ContactDatabase[i].name.toLowerCase().includes(searchWord.toLowerCase())) {
            cartona +=
                `
                    <div class="col-md-6">    
                    <div class="contact-card">
                    <div class="contact-header">
                    <div class="contact-avatar ${ContactDatabase[i].favorite ? 'favorite' : ''} 
                    ${ContactDatabase[i].emergency ? 'emergency' : ''}">
                    ${ContactDatabase[i].name.split(" ").map(w => w[0]).join("").slice(0, 1)}
                    
                        </div>
                        <div class="contact-info">
                        <h4>${ContactDatabase[i].name}</h4>
                        </div>
                        </div>
                        <div class="contact-details">
                        <div class="contact-detail phone">
                        <i class="fas fa-phone text-primary  "></i>
                        <span>${ContactDatabase[i].phone}</span>
                        </div>
                        <div class="contact-detail email ">
                        <i class="fa-regular fa-envelope"></i>
                        <span>${ContactDatabase[i].email}</span>
                        </div>
                        <div class="contact-detail address">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${ContactDatabase[i].address}</span>
                        </div>
                        </div>
                        <div class="contact-tags">
                        <span class="tag family">${ContactDatabase[i].group}</span>
                        ${ContactDatabase[i].emergency ? `
                        <span class="tag emergency">
                        <i class="fas fa-heartbeat"></i> Emergency
                        </span>
`                       : ""}
                        </div>
                        <div class="contact-actions">
                        <button class="contact-action call " title="Call">
                        
                        <a href="tel:${ContactDatabase[i].phone}"><i class="fas fa-phone text-success"></i></a>
                        <a href=""></a>
                        </button>
                        <button class="contact-action email" title="Email">
                        <a href="mailto:${ContactDatabase[i].email}"><i class="fas fa-envelope "></i></a>
                        
                        </button>
                        <button class="contact-action favorite active" title="Favorite">
                        <i class="fas fa-star"></i>
                        </button>
                        <button class="contact-action emergency active" title="Emergency">
                        <i class="fas fa-heart"></i>
                        </button>
                        <button onclick="EditContact(${i})" class="contact-action" title="Edit">
                        <i class="fas fa-edit"></i>
                        </button>
                        <button onclick="DeleteContact(${i})" class="contact-action delete" title="Delete">
                        <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    </div>
                    </div> 

        `

        }

        document.getElementById("rowData").innerHTML = cartona
    }


}




var productPattern = {
    fullName: /^[a-zA-Z0-9-\sأ-ي]{2,50}$/,
    phoneNumber: /^(002|\+2)?01[0125][0-9]{8}$/,
    emailAddress: /^[\w\.]{3,50}@(gmail|Gmail|yahoo|Yahoo)\.com$/,


}


function validation(input) {




    if (productPattern[input.id].test(input.value)) {
        input.classList.add("is-valid")
        input.classList.remove("is-invalid")
        input.nextElementSibling.classList.replace("d-block", "d-none")
        isFormValid = true
    } else {
        input.classList.add("is-invalid")
        input.classList.remove("is-valid")
        input.nextElementSibling.classList.replace("d-none", "d-block")
        isFormValid = false
    }
}