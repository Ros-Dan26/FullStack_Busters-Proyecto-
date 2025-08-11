const curFiles = input.files;
if (curFiles.length === 0) {
  const para = document.createElement("p");
  para.textContent = "No hay archivos seleccionados actualmente para subir";
  preview.appendChild(para);
}

let boton = document.getElementById("btnRegistrar");


boton.addEventListener("click", function (e) {
  e.preventDefault();
  let form = document.getElementById("formularioRegistro");
  let formData = new FormData(form);
  
  fetch("http://localhost:8081/api/v1/nso/save", {
    method: "POST",
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.success) {
      alert("Producto registrado exitosamente");
      form.reset();
      preview.innerHTML = ""; // Limpiar la vista previa
    } else {
      alert("Error al registrar el producto: " + data.message);
    }
  })
  .catch(error => {
    console.error("Error:", error);
    alert("Ocurrió un error al registrar el producto");
  });
});