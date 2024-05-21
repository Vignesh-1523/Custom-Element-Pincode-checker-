class PinCodeChecker extends HTMLElement {
    constructor() {
        super()

        // attachShadow creates a shadow root for elements and returns it
        this.attachShadow({ mode: 'open' })

        // Creating an input and setting up the attributes
        const input = document.createElement('input')
        input.setAttribute('type', 'text')
        input.setAttribute('placeholder', 'Enter your pincode')

        // shadowRoot Returns element's shadow root, if any, and if shadow root's mode is "open", and null otherwise.
        // Append input element to the Shadow DOM
        this.shadowRoot.appendChild(input)

        // Creating a Button for action
        const button = document.createElement('button')
        button.setAttribute('type', 'submit')
        button.textContent = "submit"

        this.shadowRoot.appendChild(button)

        // Add CSS for styling
        const style = document.createElement('style');
        style.textContent = `
     /* Style for the input */
     input {
         width: 200px;
         padding: 12px;
         font-size: 17px;
         border: none;
         outline: none;
         background-color: #DDDDDD;
     }

     /* Style for the button */
     button {
         background-color: #007bff;
         color: white;
         border: none;
         padding: 12px;
         font-size: 17px;
         cursor: pointer;
     }

     /* Optional: Add hover effect */
     button:hover {
         background-color: #003E81;
     }
 `;

        // Append the style to the Shadow DOM
        this.shadowRoot.appendChild(style);

    }

    // Getter method for value of custom input
    get value() {
        return this.shadowRoot.querySelector('input').value
    }
}

// Defines a new custom element, mapping the given name to the given constructor as an autonomous custom element.
customElements.define('pincode-checker', PinCodeChecker)
// Now when we create a <pincode-checker> custom tag a button along with this input also get created.

// --------------------------------------------------------------------------------------------------------

// function to fetch delivery status of that pincode..

const pinBox = document.querySelector('pincode-checker')
const input = pinBox.shadowRoot.querySelector('input')
const button = pinBox.shadowRoot.querySelector('button')

button.addEventListener('click', () => {
    if (input.value !== '' && !isNaN(input.value)) {
        console.log(input.value)
        getData(input.value)
        // input.value = ''
    } else {
        alert("Enter valid six digit pincode")
        input.value = ''
    }
});

async function getData(pincode) {
    try {
        const res = await fetch('https://api.postalpincode.in/pincode/' + pincode)
        const data = await res.json()
        console.log(data)
        showData(data)
    } catch (err) {
        console.error("Error while fetching data ", err)
    }
}

function showData(data) {
    const postalData = data[0].PostOffice
    console.log(postalData)
    const displayRecords = document.querySelector('.records')
    displayRecords.innerHTML = ""
    
    if (postalData !== null) {
        postalData.forEach(place => {
            const para = document.createElement('p')
            const span = document.createElement('span')
            span.innerHTML = `${place.DeliveryStatus}`
            para.textContent = `${place.Name} : `

            if(span.innerHTML == 'Delivery'){
                span.classList.add('success')
            } else {
                span.classList.add('failed')
            }

            para.appendChild(span)
            displayRecords.appendChild(para)
        })
    } else {
        const para = document.createElement('p')
        para.classList.add('failed')
        para.textContent = `No Records Found`
        displayRecords.appendChild(para)
    }
}