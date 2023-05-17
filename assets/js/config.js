const BACKEND_URL = "https://grihobanglabd.cyclic.app"

function IsNotFilled(obj) { return obj.type==="checkbox"? !obj.checked: (obj.value.trim() === "") }