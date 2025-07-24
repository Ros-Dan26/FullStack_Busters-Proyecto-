const curFiles = input.files;
if (curFiles.length === 0) {
  const para = document.createElement("p");
  para.textContent = "No hay archivos seleccionados actualmente para subir";
  preview.appendChild(para);
}