const BACKEND_URL = "http://localhost:3000"

function IsNotFilled(obj) { return obj.type==="checkbox"? !obj.checked: (obj.value.trim() === "") }