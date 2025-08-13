const curFiles = input.files;
if (curFiles.length === 0) {
  const para = document.createElement("p");
  para.textContent = "No hay archivos seleccionados actualmente para subir";
  preview.appendChild(para);
}

let boton = document.getElementById("btn-publicar");


boton.addEventListener("click", function (e) {
  console.log("registrar producto")
  e.preventDefault();
  let form = document.getElementById("formularioRegistro");
  let formData = new FormData(form);

  fetch('http://jft314.ddns.net:8080/nso/api/v1/nso/product/save', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
        const contenedor = document.getElementById('producto');
        const producto = data.products;
        const imagenes = data.images || [];

        contenedor.innerHTML = `
            <h2>${producto.name} (${producto.model})</h2>
            <p><b>Marca:</b> ${producto.brand}</p>
            <p><b>Precio:</b> $${producto.price}</p>
            <p><b>Color:</b> ${producto.colorProduct}</p>
            <p><b>Status:</b> ${producto.status}</p>
            <p><b>Talla:</b> ${producto.size}</p>
            <p><b>Descripción:</b> ${producto.description}</p>
            <p><b>Detalles:</b> ${producto.details}</p>
            <img src="${producto.urlBrand}" alt="${producto.brand}" width="100">
            <div>
                ${imagenes.map(img => `<img src="${img.url}" width="150">`).join('')}
            </div>
        `;
    })
    .catch(err => console.error('Error al traer el producto:', err));
});


