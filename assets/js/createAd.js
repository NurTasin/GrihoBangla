const AdTitleField = document.getElementById("AdTitle");
const AdAddressDivision = document.getElementById("AdAddressDivision");
const AdAddressDistrict = document.getElementById("AdAddressDistrict");
const AdAddressUpazilla = document.getElementById("AdAddressUpazila");
const AdAddressUpazillaWrite = document.getElementById("upazila-other-writing");
const AdAddressPostOffice = document.getElementById("AdAddressPostOffice");
const AdAddressUnion = document.getElementById("AdAddressUnion");
const AdAddressStreet = document.getElementById("AdAddressStreet");
const AdAddressVillage = document.getElementById("AdAddressVillage");
const AdDescription = document.getElementById("AdDescription");
const AdCategory = document.getElementById("AdCategory");
const AdRentCost = document.getElementById("AdRentCost");
const AdRentNegotiable = document.getElementById("AdRentNegotiable");
const AdContactName = document.getElementById("AdContactName");
const AdContactPhoneNum1 = document.getElementById("AdContactPhn1");
const AdContactPhoneNum2 = document.getElementById("AdContactPhn2");
const AdContactWA = document.getElementById("AdContactWA");
const AdContactEmail = document.getElementById("AdContactEmail");
const ImagePreview = document.getElementById("imagePreview");
const ImageFileSelector = document.getElementById("ImageSelector");
const AgreeTnC = document.getElementById("AdAgreeTC");
const AdCreateBtn = document.getElementById("CreateBtn");

function validateForm(afterValidate) {
    let toCheck = [AdTitleField, AdAddressDivision, AdAddressDistrict, AdAddressUpazilla,
        AdDescription, AdCategory, AdRentCost, AdContactName, AdContactPhoneNum1, AgreeTnC];
    let intoView = false;
    toCheck.forEach(elem => {
        if (IsNotFilled(elem)) {
            elem.style.border = "2px solid red";
            elem.addEventListener("change", (ev) => {
                elem.style.border = "";
            });
            if (!intoView) {
                elem.scrollIntoView({ behavior: "smooth" });
                intoView = true;
            }
        }
    })
    if (!intoView) {
        if (afterValidate) { afterValidate() }
        else { alert("Submitted") }
    }
}

AdCreateBtn.addEventListener("click", (ev) => {
    validateForm();
})

function updateImagePreview() {
    let fileList = ImageFileSelector.files;
    let innerCarousel = document.querySelector("#imagePreview .carousel-inner")
    let carouselIndicator = document.querySelector("#imagePreview .carousel-indicators")
    innerCarousel.innerHTML="";
    carouselIndicator.innerHTML="";
    for(let i=0;i<fileList.length;i++){
        innerCarousel.innerHTML+=`<div class="carousel-item${i===0?" active":""}"><img class="w-100 d-block" src="https://cdn.bootstrapstudio.io/placeholders/1400x800.png" alt="Slide Image"></div>`
        carouselIndicator.innerHTML+=`<li data-bs-target="#imagePreview" data-bs-slide-to="${i}" ${i===0?'class="active"':''}></li>`
    }
    let imageObjects = document.querySelectorAll("#imagePreview img")
    for (let index=0;index<fileList.length;index++){
        let elem = fileList.item(index);
        let reader = new FileReader();
        reader.onloadend = () => {
            imageObjects[index].src=reader.result;
            console.log(reader);
        }
        reader.readAsDataURL(elem);
    }
}

console.log("HEHE")
AdAddressUpazillaWrite.hidden=true;
ImagePreview.hidden = true;
ImageFileSelector.addEventListener("change", ev => {
    updateImagePreview();
    ImagePreview.hidden = false;
})
function renderOptions(dropdown,list,data){
    dropdown.innerHTML=``
    list.forEach((elem,index)=>{
        dropdown.innerHTML+=`<option value="${data[elem]["name_en"]}">${data[elem]["name_bn"]}</option>`
    })
}

renderOptions(AdAddressDivision,Object.keys(geo_data),geo_data);
AdAddressDistrict.disabled=true;
AdAddressUpazilla.disabled=true;

AdAddressDivision.addEventListener("change",(ev)=>{
    renderOptions(AdAddressDistrict,Object.keys(geo_data[AdAddressDivision.value]["districts"]),geo_data[AdAddressDivision.value]["districts"]);
    renderOptions(AdAddressUpazilla,[""],{"":{"name_en":"","name_bn":"Select Your District First"}})
    AdAddressDistrict.disabled=false;
    AdAddressUpazilla.disabled=true;
})

AdAddressDistrict.addEventListener("change",(ev)=>{
    renderOptions(AdAddressUpazilla,Object.keys(geo_data[AdAddressDivision.value]["districts"][AdAddressDistrict.value]["upazilas"]),geo_data[AdAddressDivision.value]["districts"][AdAddressDistrict.value]["upazilas"])
    AdAddressUpazilla.disabled=false;
})
AdAddressUpazilla.addEventListener("change",(ev)=>{
    if(AdAddressUpazilla.value==="OTHER"){
        AdAddressUpazillaWrite.hidden=false;
        AdAddressUpazillaWrite.focus();
    }
})

let imageUrls={}
function uploadImages(){
    let fileList = ImageFileSelector.files;
    for (let index=0;index<fileList.length;index++){
        let elem = fileList.item(index);
        let reader = new FileReader();
        reader.onloadend = () => {
            fetch(BACKEND_URL+"/api/v1/image/uploadB64",{
                method:"POST",
                body:JSON.stringify({
                    data:reader.result
                }),
                mode:"no-cors"
            }).then(res=>res.json()).then((data)=>{
                if(data.status==="Success"){
                    imageUrls[String(index)]=data.data.path
                }
            })
        }
        reader.readAsDataURL(elem);
    }
}

function MakeSendableData(imageLinks){
    return{
        "name": AdTitleField.value,
        "category":AdCategory.value,
        "address": {
            "division":AdAddressDivision.value,
            "district":AdAddressDistrict.value,
            "upzilla":AdAddressUpazilla.value,
            "postOffice":AdAddressPostOffice.value,
            "union":AdAddressUnion.value,
            "village":AdAddressVillage.value,
            "street":AdAddressStreet.value
        },
        "descriptions":AdDescription.value,
        "gpsLocation": [
            undefined,
            undefined
        ],
        "availableForRent": true,
        "rentCost": parseInt(AdRentCost.value),
        "priceNegotiable":AdRentNegotiable.checked,
        "owner": localStorage.name,
        "contact": {
            "phoneNumber1": AdContactPhoneNum1.value,
            "phoneNumber2": AdContactPhoneNum2.value,
            "email": AdContactEmail.value,
            "whatsapp": AdContactWA.value
        },
        "images": imageLinks
    }
}