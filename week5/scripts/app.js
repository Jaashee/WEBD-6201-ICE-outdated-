// IIFE -- Immediately Invoking Function Expression
// AKA -- Anonymous Self-Executing Function
(function ()
{

    /**
     * Instantiates a contact and stores in localstorage
     * @param fullName
     * @param contactNumber
     * @param emailAddress
     * @constructor
     */
    function AddContact(fullName, contactNumber, emailAddress)
    {
        let contact = new core.Contact(fullName, contactNumber, emailAddress);
        if (contact.serialize()){
            let key = contact.FullName.substring(0,1) + Date.now();
            localStorage.setItem(key, contact.serialize())
        }
    }

    function DisplayHomePage() {

        console.log("DisplayHomePage");

        $("#AboutUsButton").on("click", () => {
            location.href = "about.html"
        });

        $("main").append(`<p id="MainParagraph" class="mt-3" >This is the main paragraph<p/>`);
        $("body").append(`<article class="container">
                                <p id="ArticleParagraph" class="mt-3">This is my article paragraph</p>\`<article/>`);

    }
    function DisplayProductsPage()
    {

    }

    function DisplayServicesPage()
    {

    }

    function DisplayAboutPage()
    {

    }

    /**
     * This function will validate a input provided based on given regular expression
     * @param {string}input_field_id
     * @param {RegExp}regular_expression
     * @param {string}error_message
     * @constructor
     */
    function ValidateField (input_field_id, regular_expression, error_message){

        let messageArea = $("#messageArea").hide();

        $(input_field_id).on("blur", function() {
            let inputFieldText = $(this).val();
            if(!regular_expression.test(inputFieldText)){
                //fails validation
                $(this).trigger("focus").trigger("select")
                messageArea.addClass("alert alert-danger").text(error_message).show();
            }
            else
            {
                // Passes validation
                messageArea.removeAttr("class").hide();
            }

        });
    }

    function ContactFormValidation() {
        ValidateField("#fullName",
            /^([A-Z][a-z]{1,3}\.?\s)?([A-Z][a-z]+)+([\s,-]([A-z][a-z]+))*$/,
            "please enter a valid first and lastname (ex: Bruce Wayne)");

        ValidateField("#contactNumber",
            /^(\+\d{1,3}[\s-.])?\(?\d{3}\)?[\s-.]?\d{3}[\s-.]\d{4}$/,
            "please enter a valid phone contact number (ex: 416-123-12345)");

        ValidateField("#emailAddress", /^[a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]{2,10}$/,
            "please enter a valid Email address (ex:suername@isp.com)");
    }

    function DisplayContactPage()
    {
        ContactFormValidation();


        let sendButton = document.getElementById("sendButton");
        let subscribedCheckbox = document.getElementById("subscribeCheckBox")

        sendButton.addEventListener("click", function (event)
        {
            if (subscribedCheckbox.checked){
                let contact = new core.Contact(fullName.value, contactNumber.value, emailAddress.value);
                if (contact.serialize()){
                    let key = contact.FullName.substring(0,1) + Date.now();
                    localStorage.setItem(key, contact.serialize())
                }
            }
        });
    }

    function DisplayContactListPage()
    {
        console.log("Contact List Page Called!");

        if(localStorage.length > 0)
        {
            let contactList = document.getElementById("contactList");
            let data = "";      // add deserialized data from local storage

            let keys = Object.keys(localStorage);

            let index = 1;
            for(const key of keys){
                let contactData = localStorage.getItem(key);
                let contact = new core.Contact();
                contact.deserialize(contactData);
                data += `<tr><th scope="row" class="text-center">${index}</th>
                         <td>${contact.FullName}</td>
                         <td>${contact.ContactNumber}</td>
                         <td>${contact.EmailAddress}</td>
                         
                         <td class="text-center">
                            <button value="${key}" class="btn btn-primary btn-sm edit">
                            <i class="fas fa-edit fa-sm"></i> Edit</button>
                         </td>
                         
                         <td class="text-center">
                            <button value="${key}" class="btn btn-danger btn-sm delete">
                            <i class="fas fa-trash-alt  fa-sm"></i> Delete</button>
                         </td>
                         
                         </tr>`;
                index++;
            }
            contactList.innerHTML = data;

            $("#addButton").on("click", () => {
                location.href = "edit.html#add"
            });

            $("button.delete").on("click", function (){
                // confirm delete
                if(confirm("Delete contact, are you sure?")){
                    localStorage.removeItem($(this).val())
                }
                location.href = "contact-list.html";
            });

            $("button.edit").on("click", function()
            {
                location.href = "edit.html#" + $(this).val();
            });

        }
    }

    function DisplayEditPage()
    {

        console.log("Edit Page");

        ContactFormValidation();

        let page = location.hash.substring(1);
        switch(page){
            case "add":
                $("main>h1").text("Add Contact");
                $("#editButton").html(`<i class="fas fa-plus-circle fa-sm"></i> Add `)

                $("editButton").on(("click"), (event) => {
                    event.preventDefault();
                    AddContact(fullName.value, contactNumber.value, emailAddress.value);
                    // refresh contact-List page
                    location.href = "contact-list.html"
                });

                $("#cancelButton").on(("click"), () => {
                    location.href = "contact-list.html";
                });

                break;
            default:{
                // get contact information from localstorage
                let contact = new core.Contact();
                contact.deserialize(localStorage.getItem(page));

                //display the contact info in the edit form
                $("#fullName").val(contact.FullName);
                $("#contactNumber").val(contact.ContactNumber);
                $("#emailAddress").val(contact.EmailAddress);

                // when editButton is pressed - update the contact
                $("editButton").on("click", (event) => {

                    event.preventDefault();
                    //get any changes from the form
                    contact.FullName = $("fullName").val();
                    contact.ContactNumber = $("contactNumber").val();
                    contact.EmailAddress = $("emailAddress").val();

                    // replace the item in localstorage
                    localStorage.setItem(page, contact.serialize());

                    // return ti the contact-list
                    location.href = "contact-list.html"
                });

            }
            break;
        }
    }

    function DisplayLoginPage()
    {

    }

    function DisplayRegisterPage()
    {

    }

    // named  function option
    function Start()
    {
        console.log("App Started!!");

        
        switch (document.title)
        {
            case "Home":
                DisplayHomePage();
                break;
            case "Our Products":
                DisplayProductsPage();
                break;
            case "Our Services":
                DisplayServicesPage();
                break;
            case "About Us":
                DisplayAboutPage();
                break;
            case "Contact Us":
                DisplayContactPage();
                break;

            case "Contact List":
                DisplayContactListPage();
                break;

            case "Edit Contact":
                DisplayEditPage();
                break;
            case "Login":
                DisplayLoginPage();
                break;
            case "Register":
                DisplayRegisterPage();
                break;
        }
    }

    window.addEventListener("load", Start);


})();