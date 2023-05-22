const TimeAddedLable = document.getElementById("time-added-label");
const AdTitle = document.getElementById("ad-title");
const AdDescription = document.getElementById("ad-description");
const LocationTable = document.getElementById("location-table");
const AdTypeLabel = document.getElementById("ad-type");
const AdRentCostLabel = document.getElementById("ad-rent-cost");
const AdContactRevealBtn = document.getElementById("ad-contact-reveal-btn");
const AdContactTable = document.getElementById("contact-table");
const PageBody = document.getElementById("body");
const ModalDropDown = document.getElementById("report-cause");
const ModalExplain = document.getElementById("report-explain");
const ModalObject = document.getElementById("report-modal");
const ReportBtn = document.getElementById("report-btn");
const ReportSubmitBtn = document.getElementById("report-submit-btn");

const QueryParams = new URLSearchParams(window.location.search);
function formatEpochToString(epochTimestamp) {
    const dt = new Date(epochTimestamp); // Convert epoch timestamp to milliseconds
    const months = ['Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

    const month = months[dt.getMonth()];
    const day = dt.getDate();
    const year = dt.getFullYear();
    const hours = dt.getHours();
    const minutes = dt.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    const formattedMinutes = minutes.toString().padStart(2, '0');

    const formattedString = `${month} ${day}, ${year} (${formattedHours}:${formattedMinutes} ${period})`;
    return formattedString;
}

function updateImagePreview(imageIdArray) {
    let innerCarousel = document.querySelector("#imagePreview .carousel-inner")
    let carouselIndicator = document.querySelector("#imagePreview .carousel-indicators")
    innerCarousel.innerHTML = "";
    carouselIndicator.innerHTML = "";
    for (let i = 0; i < imageIdArray.length; i++) {
        innerCarousel.innerHTML += `<div class="carousel-item${i === 0 ? " active" : ""}"><img class="w-100 d-block" src="${BACKEND_URL + "/api/v1/image/get/" + imageIdArray[i].replace("/", "_")}" alt="Slide Image"></div>`
        carouselIndicator.innerHTML += `<li data-bs-target="#imagePreview" data-bs-slide-to="${i}" ${i === 0 ? 'class="active"' : ''}></li>`
    }
}

AdContactTable.hidden = true;
if (QueryParams.has("id")) {
    const adId = QueryParams.get("id");
    if (adId.length === 39) { // "AD-"+36 character long uuid4
        fetch(BACKEND_URL + `/api/v1/ad/get/${adId}`, {
            method: "GET",
            credentials: "include"
        }).then(res => res.json()).then((data) => {
            if (data.status === "Success" && data.code === "200") {
                const AdData = data.data;
                TimeAddedLable.innerText = formatEpochToString(AdData.dateCreated);
                updateImagePreview(AdData.images);
                AdTitle.innerText = AdData.name;
                AdDescription.innerText = AdData.descriptions;
                let typeToText = {
                    "HOME": "Home",
                    "HOTEL": "Hotel",
                    "HOSTEL": "Hostel",
                    "OTHER": "Other"
                }
                AdTypeLabel.innerText = "Category: " + typeToText[AdData.category]
                AdRentCostLabel.innerText = `${AdData.rentCost} Taka${AdData.priceNegotiable ? " (Negotiable)" : " (Fixed)"}`;
                let addressData = ""
                addressData += `<tr>
                <td>Division</td>
                <td>${AdData.address.division}</td>
                </tr><tr>
                    <td>District</td>
                    <td>${AdData.address.district}</td>
                </tr><tr>
                    <td>Upazila / Police Station</td>
                    <td>${AdData.address.upzilla}</td>
                </tr>`
                if (AdData.address.postOffice) {
                    addressData += `<tr>
                    <td>Post Office</td>
                    <td>${AdData.address.postOffice}</td>
                    </tr>`
                }
                if (AdData.address.union) {
                    addressData += `<tr>
                    <td>Union</td>
                    <td>${AdData.address.union}</td>
                    </tr>`
                }
                if (AdData.address.village) {
                    addressData += `<tr>
                    <td>Village</td>
                    <td>${AdData.address.village}</td>
                    </tr>`
                }
                if (AdData.address.street) {
                    addressData += `<tr>
                    <td>Street</td>
                    <td>${AdData.address.street}</td>
                    </tr>`
                }
                LocationTable.innerHTML = addressData;
                let contactData = ""
                contactData += `<tr>
                    <td>Name</td>
                    <td>${AdData.contact.name ? AdData.contact.name : "N/A"}</td>
                </tr><tr>
                    <td>Phone Number</td>
                    <td><a href="tel:${AdData.contact.phoneNumber1}">${AdData.contact.phoneNumber1}</td>
                </tr>`
                if (AdData.contact.phoneNumber2) {
                    contactData += `<tr>
                    <td>Phone Number (2)</td>
                    <td><a href="tel:${AdData.contact.phoneNumber2}">${AdData.contact.phoneNumber2}</td>
                </tr>`
                }
                if (AdData.contact.telephone) {
                    contactData += `<tr>
                    <td>Telephone</td>
                    <td><a href="tel:${AdData.contact.telephone}">${AdData.contact.telephone}</td>
                </tr>`
                }
                if (AdData.contact.whatsapp) {
                    contactData += `<tr>
                    <td>WhatsApp</td>
                    <td><a href="https://wa.me/${AdData.contact.whatsapp}">${AdData.contact.whatsapp}</td>
                </tr>`
                }
                if (AdData.contact.email) {
                    contactData += `<tr>
                    <td>Email</td>
                    <td><a href="mailto:${AdData.contact.email}">${AdData.contact.email}</td>
                </tr>`
                }
                AdContactRevealBtn.addEventListener("click", ev => {
                    let agreed = confirm("A Nice Disclaimer Text Here");
                    if (agreed) {
                        AdContactTable.innerHTML = contactData;
                    }
                    AdContactRevealBtn.hidden = true;
                    AdContactTable.hidden = false;
                })
            }
        });
    } else {

    }
} else {
    // Return to home
    window.location.href = "/"
}




ReportBtn.addEventListener("click", (ev) => {
    if (localStorage.getItem("LOGGED_IN") === "1") {
        const ReportModal = new bootstrap.Modal(ModalObject, {
            keyboard: true
        })
        ModalExplain.hidden = true;
        ModalDropDown.addEventListener("change", (e) => {
            if (ModalDropDown.value === "OTHER") {
                ModalExplain.hidden = false;
                ModalExplain.focus();
            } else {
                ModalExplain.hidden = true;
            }
        })
        ReportSubmitBtn.addEventListener("click", (ev) => {
            if (ModalDropDown.value !== "") {
                let cause;
                if (ModalDropDown.value === "OTHER") {
                    if (ModalExplain.value === "") {
                        ModalExplain.style.border = "solid red 1px";
                        ModalExplain.addEventListener("keydown", (ev) => {
                            ModalExplain.style.border = "";
                        })
                        alert("Please Explain the Reason.")
                        return;
                    } else {
                        cause = ModalExplain.value
                    }
                } else {
                    cause = ModalDropDown.value
                }
                let head = new Headers()
                head.append("Content-Type","application/json");
                fetch(BACKEND_URL + "/api/v1/report/submit", {
                    method: "POST",
                    credentials: "include",
                    headers:head,
                    body: JSON.stringify({
                        data: {
                            contentId: QueryParams.get("id"),
                            cause
                        }
                    })
                }).then(res => res.json()).then(data => {
                    if (data.status === "Success") {
                        ReportModal.hide();
                        alert("Report Submitted Successfully! We appreciate your feedback.");
                    }else if(data.code==="400" && msg==="You have to login to use this feature."){
                        localStorage.setItem("LOGGED_IN","0");
                        alert("Login Session Expired. Please Login Again.");
                        window.location.href=`/login.html?redirect=${window.location.href}`
                    }
                }).catch(err => {
                    console.log(err)
                    alert("Server Busy. Try Again Later.");
                    ReportModal.hide();
                })
            } else {
                alert("Please Select Your Reason.");
            }
        })
        ReportModal.show();
    } else {
        alert("To report Ad, you have to login")
    }
})